export const SUNAT_UBL_XML_SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
         xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
         xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2">
  <ext:UBLExtensions>
    <ext:UBLExtension>
      <ext:ExtensionContent>
        <!-- Firma Digital X.509 generada por FIT-CORE OS Fiscal Engine -->
        <ds:Signature Id="SignatureFITCORE">
          <ds:SignedInfo>
            <ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
            <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
            <ds:Reference URI="">
              <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
              <ds:DigestValue>k9YJ87Zxq2m4L9vP1p9ZqL8vP1p=</ds:DigestValue>
            </ds:Reference>
          </ds:SignedInfo>
          <ds:SignatureValue>aB3...[Firma Digital PEM 2048-bit]...==</ds:SignatureValue>
        </ds:Signature>
      </ext:ExtensionContent>
    </ext:UBLExtension>
  </ext:UBLExtensions>

  <!-- Datos del Comprobante -->
  <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
  <cbc:CustomizationID>2.0</cbc:CustomizationID>
  <cbc:ID>B001-0004921</cbc:ID>
  <cbc:IssueDate>2026-08-24</cbc:IssueDate>
  <cbc:IssueTime>08:30:00</cbc:IssueTime>
  <cbc:InvoiceTypeCode listID="0101">03</cbc:InvoiceTypeCode> <!-- 03: Boleta de Venta Electrónica -->
  <cbc:DocumentCurrencyCode>PEN</cbc:DocumentCurrencyCode>

  <!-- Datos del Emisor (Gimnasio / Franquicia) -->
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyIdentification>
        <cbc:ID schemeID="6">20601234567</cbc:ID> <!-- RUC Emisor -->
      </cac:PartyIdentification>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>FIT-CORE WELLNESS PERU S.A.C.</cbc:RegistrationName>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingSupplierParty>

  <!-- Datos del Receptor (Socio) -->
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyIdentification>
        <cbc:ID schemeID="1">72849102</cbc:ID> <!-- DNI Receptor -->
      </cac:PartyIdentification>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>CARLOS MENDOZA PAREDES</cbc:RegistrationName>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingCustomerParty>

  <!-- Totales e Impuestos (IGV 18%) -->
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="PEN">30.36</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="PEN">168.64</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="PEN">30.36</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:Percent>18.00</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID>1000</cbc:ID>
          <cbc:Name>IGV</cbc:Name>
          <cbc:TaxTypeCode>VAT</cbc:TaxTypeCode>
        </cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>

  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="PEN">168.64</cbc:LineExtensionAmount>
    <cbc:TaxInclusiveAmount currencyID="PEN">199.00</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="PEN">199.00</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>

  <!-- Ítem de Facturación: Plan de Membresía Mensual -->
  <cac:InvoiceLine>
    <cbc:ID>1</cbc:ID>
    <cbc:InvoicedQuantity unitCode="ZZ">1</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="PEN">168.64</cbc:LineExtensionAmount>
    <cac:Item>
      <cbc:Description>MEMBRESIA BLACK MULTISEDE - 1 MES (SEDE SAN ISIDRO)</cbc:Description>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="PEN">168.64</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>
</Invoice>
`;

export const PAYMENT_INTEGRATION_GUIDE = {
  culqi: {
    name: 'Culqi (LatAm / Perú)',
    description: 'Cobro con tarjeta y suscripciones con tokenización segura sin tocar datos PCI en frontend.',
    flow: [
      '1. Frontend captura tarjeta con Culqi Checkout v4 / SDK JS -> Retorna `token_id` (ej. tkn_live_92019481).',
      '2. Backend NestJS recibe `token_id` junto con el `idempotency_key` y el `user_id`.',
      '3. Invoca API `/v2/charges` con headers de autenticación bearer token.',
      '4. Si el cobro es exitoso, dispara automáticamente la emisión del comprobante SUNAT.',
      '5. Almacena `card_id` y `customer_id` en PostgreSQL para cargos automáticos recurrentes de meses futuros.'
    ],
    codeSnippet: `// NestJS Service: Culqi Charge & Auto SUNAT Trigger
async processCulqiSubscriptionCharge(tenantId: string, userId: string, tokenId: string, amountPen: number) {
  const idempotencyKey = \`charge_\${tenantId}_\${userId}_\${Date.now()}\`;
  
  const culqiResponse = await axios.post('https://api.culqi.com/v2/charges', {
    amount: Math.round(amountPen * 100), // En céntimos
    currency_code: 'PEN',
    email: user.email,
    source_id: tokenId,
    antifraud_details: {
      first_name: user.firstName,
      last_name: user.lastName,
      phone_number: user.phone,
    }
  }, {
    headers: {
      'Authorization': \`Bearer \${tenant.settings.culqiPrivateKey}\`,
      'X-Idempotency-Key': idempotencyKey,
    }
  });

  if (culqiResponse.data.object === 'charge' && culqiResponse.data.outcome.type === 'venta_exitosa') {
    // Disparar emisión de Boleta Electrónica a SUNAT
    const invoice = await this.sunatService.emitElectronicVoucher({
      tenantId,
      paymentId: culqiResponse.data.id,
      amount: amountPen,
      docType: '1', // DNI
      docNumber: user.docNumber,
      clientName: \`\${user.firstName} \${user.lastName}\`,
      description: 'Membresía Mensual FIT-CORE Black'
    });

    return { status: 'SUCCESS', chargeId: culqiResponse.data.id, invoiceSeries: invoice.seriesNumber };
  }
}`
  },
  niubiz: {
    name: 'Niubiz (VisaNet Perú)',
    description: 'Pasarela líder en Perú con soporte para tokenización 3DS 2.0 y débito recurrente de bancos locales.',
    flow: [
      '1. Backend solicita Security Token con credenciales de comercio a `https://apisandbox.vnforappsprod.com/api.security/v1/security`.',
      '2. Se genera `sessionKey` con el monto de la membresía y se abre el formulario de pago embebido.',
      '3. Niubiz retorna `transactionToken`.',
      '4. Backend ejecuta la confirmación `POST /api.authorization/v3/authorization/ecommerce/{merchantId}`.',
      '5. Al recibir código `0000` (Aprobado), se activa la membresía y se emite la factura electrónica.'
    ]
  },
  yapePlin: {
    name: 'Yape & Plin QR Dinámico en Recepción',
    description: 'Cobro rápido por billeteras móviles sin comisiones de tarjeta mediante QR dinámico en tablet de caja.',
    flow: [
      '1. La recepcionista selecciona un plan (ej. S/. 199) o un suplemento (ej. Proteína S/. 140).',
      '2. El sistema genera un QR dinámico con el código de operación o alias único.',
      '3. El cliente escanea el QR desde su app Yape/Plin y transfiere.',
      '4. El webhook de Yape Business / conciliación OCR valida el número de operación en <3 segundos.',
      '5. La caja confirma el pago con sonido de éxito y abre el torniquete automáticamente.'
    ]
  }
};
