import React, { useState } from 'react';
import { 
  Receipt, 
  CreditCard, 
  QrCode, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Copy, 
  Check, 
  Clock, 
  Smartphone,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SUNAT_UBL_XML_SAMPLE, PAYMENT_INTEGRATION_GUIDE } from '../../data/sunatPaymentsLogic';
import { InvoiceSUNAT } from '../../types';

export const SunatPaymentTester: React.FC = () => {
  const [selectedGateway, setSelectedGateway] = useState<'CULQI' | 'NIUBIZ' | 'YAPE_QR'>('CULQI');
  const [selectedVoucherType, setSelectedVoucherType] = useState<'03' | '01'>('03'); // 03: Boleta, 01: Factura
  const [docNumber, setDocNumber] = useState('72849102');
  const [clientName, setClientName] = useState('CARLOS MENDOZA PAREDES');
  const [planAmount, setPlanAmount] = useState<number>(199.00);
  const [planName, setPlanName] = useState('Membresía Mensual FIT-CORE Black Pass');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [generatedInvoice, setGeneratedInvoice] = useState<InvoiceSUNAT | null>(null);
  const [activeTab, setActiveTab] = useState<'SANDBOX' | 'XML_UBL' | 'GATEWAY_DOCS'>('SANDBOX');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleProcessPaymentAndSunat = () => {
    setIsProcessing(true);
    setGeneratedInvoice(null);

    const steps = [
      `1. Tokenizando credenciales en pasarela ${selectedGateway}...`,
      `2. Verificando fondos y generando cargo de S/. ${planAmount.toFixed(2)} (Idempotency Key OK)...`,
      `3. Generando documento XML UBL 2.1 (${selectedVoucherType === '03' ? 'Boleta B001' : 'Factura F001'})...`,
      '4. Firmando digitalmente con Certificado X.509 y calculando SHA-256 Digest...',
      '5. Enviando Web Service SOAP a SUNAT / Servidor OSE...',
      '6. CDR Recibido: Código 0 - Comprobante ACEPTADO por SUNAT.'
    ];

    let current = 0;
    setProcessingStep(steps[0]);

    const interval = setInterval(() => {
      current++;
      if (current < steps.length) {
        setProcessingStep(steps[current]);
      } else {
        clearInterval(interval);
        setIsProcessing(false);

        const subtotal = Number((planAmount / 1.18).toFixed(2));
        const igv = Number((planAmount - subtotal).toFixed(2));
        const correlative = Math.floor(Math.random() * 8000 + 1000);
        const series = selectedVoucherType === '03' ? 'B001' : 'F001';

        const newInvoice: InvoiceSUNAT = {
          id: `inv-${Date.now()}`,
          tenantId: 't-peru-01',
          invoiceType: selectedVoucherType,
          series,
          correlative,
          issueDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
          clientDocType: selectedVoucherType === '03' ? '1' : '6',
          clientDocNumber: docNumber,
          clientName: clientName.toUpperCase(),
          currency: 'PEN',
          subtotal,
          igv,
          total: planAmount,
          paymentMethod: selectedGateway === 'CULQI' ? 'CULQI_CARD' : selectedGateway === 'NIUBIZ' ? 'NIUBIZ' : 'YAPE_QR',
          sunatStatus: 'ACCEPTED',
          hashDigest: 'k9YJ87Zxq2m4L9vP1p9ZqL8vP1p=',
          cdrResponseCode: '0',
          cdrDescription: `El comprobante ${series}-${String(correlative).padStart(8, '0')} ha sido aceptado por SUNAT exitosamente.`
        };

        setGeneratedInvoice(newInvoice);

        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.6 }
        });
      }
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SUNAT UBL 2.1 (Perú)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Culqi • Niubiz • Yape QR
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Motor Fiscal SUNAT & Pasarelas de Pago Híbridas
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Emisión instantánea de Boletas de Venta y Facturas Electrónicas con firma digital, validación de CDR con SUNAT y conciliación de cobros con Culqi, Niubiz y Yape.
            </p>
          </div>

          {/* VIEW TABS */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 self-start">
            <button
              onClick={() => setActiveTab('SANDBOX')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'SANDBOX' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Sandbox de Pagos & SUNAT
            </button>
            <button
              onClick={() => setActiveTab('XML_UBL')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'XML_UBL' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              XML UBL 2.1 Generado
            </button>
            <button
              onClick={() => setActiveTab('GATEWAY_DOCS')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'GATEWAY_DOCS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              Guías Culqi & Niubiz
            </button>
          </div>
        </div>
      </div>

      {/* TAB: SANDBOX */}
      {activeTab === 'SANDBOX' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* PAYMENT & INVOICE FORM (5 COLS) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Configurar Transacción en Vivo
            </h2>

            {/* GATEWAY SELECTOR */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Método / Pasarela de Cobro:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGateway('CULQI')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                    selectedGateway === 'CULQI'
                      ? 'bg-emerald-950/60 border-emerald-500 text-white'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-emerald-400">Culqi v4</span>
                  <span className="text-[10px] text-slate-400 font-normal">Tarjeta / Débito</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGateway('NIUBIZ')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                    selectedGateway === 'NIUBIZ'
                      ? 'bg-blue-950/60 border-blue-500 text-white'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-blue-400">Niubiz</span>
                  <span className="text-[10px] text-slate-400 font-normal">VisaNet 3DS 2.0</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGateway('YAPE_QR')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                    selectedGateway === 'YAPE_QR'
                      ? 'bg-purple-950/60 border-purple-500 text-white'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-purple-400">Yape QR</span>
                  <span className="text-[10px] text-slate-400 font-normal">Caja Dinámica</span>
                </button>
              </div>
            </div>

            {/* VOUCHER TYPE (BOLETA VS FACTURA) */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Tipo de Comprobante SUNAT:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVoucherType('03');
                    setDocNumber('72849102');
                    setClientName('CARLOS MENDOZA PAREDES');
                  }}
                  className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                    selectedVoucherType === '03'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Boleta Electrónica (B001) - DNI
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVoucherType('01');
                    setDocNumber('20601928471');
                    setClientName('TECHCORP INNOVATIONS S.A.C.');
                  }}
                  className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                    selectedVoucherType === '01'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Factura Electrónica (F001) - RUC
                </button>
              </div>
            </div>

            {/* CLIENT DATA INPUTS */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  {selectedVoucherType === '03' ? 'DNI del Cliente:' : 'RUC de la Empresa:'}
                </label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Nombre / Razón Social:
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Plan / Concepto:
                  </label>
                  <select
                    value={planAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPlanAmount(val);
                      if (val === 199) setPlanName('Membresía Mensual FIT-CORE Black');
                      else if (val === 350) setPlanName('Pack Boutique 20 Clases');
                      else setPlanName('Anual Multisede VIP');
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={199}>Black Pass (S/. 199.00)</option>
                    <option value={350}>Boutique 20 Clases (S/. 350.00)</option>
                    <option value={1800}>Anual VIP (S/. 1,800.00)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Importe Total (PEN):
                  </label>
                  <div className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-emerald-400">
                    S/. {planAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* PROCESS BUTTON */}
            <button
              id="btn-process-sunat"
              onClick={handleProcessPaymentAndSunat}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50 cursor-pointer text-xs"
            >
              <Send className="w-4 h-4" />
              {isProcessing ? 'Procesando con SUNAT...' : 'Cobrar con Pasarela & Emitir Comprobante'}
            </button>

            {/* REAL-TIME PROGRESS STEPS */}
            {isProcessing && (
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span>Pipeline Fiscal en Ejecución:</span>
                </div>
                <p className="text-xs text-slate-200 font-mono animate-pulse">
                  {processingStep}
                </p>
              </div>
            )}

          </div>

          {/* VOUCHER PREVIEW & CDR RESPONSE (7 COLS) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Comprobante Electrónico Oficial SUNAT (Vista Renderizada)
                </h3>
              </div>
              {generatedInvoice && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                  CDR SUNAT Código 0 (ACEPTADO)
                </span>
              )}
            </div>

            {generatedInvoice ? (
              <div className="space-y-4">
                
                {/* VOUCHER CARD (OFFICIAL SUNAT FORMAT) */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 text-xs font-mono">
                  
                  {/* EMISOR HEADER */}
                  <div className="text-center border-b border-slate-800 pb-3 space-y-1">
                    <h4 className="font-bold text-white text-sm">FIT-CORE WELLNESS PERÚ S.A.C.</h4>
                    <p className="text-slate-400 text-[11px]">RUC: 20601234567 | Av. Conquistadores 840, San Isidro, Lima</p>
                    <div className="inline-block bg-slate-900 border border-slate-700 px-3 py-1 rounded text-emerald-400 font-bold mt-1">
                      {generatedInvoice.invoiceType === '03' ? 'BOLETA DE VENTA ELECTRÓNICA' : 'FACTURA ELECTRÓNICA'}
                      <div className="text-white text-sm">{generatedInvoice.series}-{String(generatedInvoice.correlative).padStart(8, '0')}</div>
                    </div>
                  </div>

                  {/* RECEPTOR DETAILS */}
                  <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                    <div>
                      <span className="text-slate-400">Cliente:</span> {generatedInvoice.clientName}
                    </div>
                    <div>
                      <span className="text-slate-400">{generatedInvoice.clientDocType === '1' ? 'DNI:' : 'RUC:'}</span> {generatedInvoice.clientDocNumber}
                    </div>
                    <div>
                      <span className="text-slate-400">Fecha Emisión:</span> {generatedInvoice.issueDate}
                    </div>
                    <div>
                      <span className="text-slate-400">Método Pago:</span> {generatedInvoice.paymentMethod}
                    </div>
                  </div>

                  {/* ITEMS TABLE */}
                  <div className="border border-slate-800 rounded-lg overflow-hidden">
                    <div className="bg-slate-900 px-3 py-1.5 text-slate-400 font-bold grid grid-cols-12 text-[10px]">
                      <span className="col-span-1">Cant</span>
                      <span className="col-span-7">Descripción</span>
                      <span className="col-span-2 text-right">P. Unit</span>
                      <span className="col-span-2 text-right">Total</span>
                    </div>
                    <div className="px-3 py-2 text-white grid grid-cols-12 text-[11px] items-center">
                      <span className="col-span-1">1</span>
                      <span className="col-span-7 truncate">{planName}</span>
                      <span className="col-span-2 text-right">S/. {generatedInvoice.subtotal.toFixed(2)}</span>
                      <span className="col-span-2 text-right font-bold">S/. {generatedInvoice.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* TOTALS */}
                  <div className="flex justify-between items-end border-t border-slate-800 pt-3">
                    <div className="space-y-1 text-[10px] text-slate-400">
                      <p>Digest: <span className="text-emerald-400 font-mono">{generatedInvoice.hashDigest}</span></p>
                      <p>Representación impresa autorizada por SUNAT</p>
                    </div>
                    <div className="text-right space-y-0.5 text-[11px]">
                      <div><span className="text-slate-400">Op. Gravada:</span> S/. {generatedInvoice.subtotal.toFixed(2)}</div>
                      <div><span className="text-slate-400">I.G.V. (18%):</span> S/. {generatedInvoice.igv.toFixed(2)}</div>
                      <div className="text-sm font-bold text-emerald-400 pt-1 border-t border-slate-800">
                        Total a Pagar: S/. {generatedInvoice.total.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* SUNAT QR CODE PAYLOAD PREVIEW */}
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-8 h-8 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-white font-bold block">Código QR Fiscal SUNAT</span>
                        <span className="text-slate-400 text-[10px]">20601234567|{generatedInvoice.invoiceType}|{generatedInvoice.series}|{generatedInvoice.correlative}|{generatedInvoice.igv}|{generatedInvoice.total}|...</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Certificado OK
                    </span>
                  </div>

                </div>

                {/* AUTOMATED WHATSAPP DISPATCH NOTIFICATION */}
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-200">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Comprobante enviado automáticamente al WhatsApp del socio con su link de descarga en PDF y XML.
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
                <Receipt className="w-12 h-12 text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-300">Ningún comprobante emitido en esta sesión</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Selecciona la pasarela (Culqi, Niubiz o Yape) a la izquierda y presiona "Cobrar con Pasarela" para ver la emisión en tiempo real.
                </p>
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB: XML UBL 2.1 */}
      {activeTab === 'XML_UBL' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Estructura de Documento Electrónico UBL 2.1 Firmado (Estándar OASIS / SUNAT)
              </h3>
            </div>
            <button
              onClick={() => handleCopy(SUNAT_UBL_XML_SAMPLE, 'xml')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700 cursor-pointer"
            >
              {copiedText === 'xml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedText === 'xml' ? '¡Copiado!' : 'Copiar XML'}
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed select-all">
            {SUNAT_UBL_XML_SAMPLE}
          </pre>
        </div>
      )}

      {/* TAB: GATEWAY DOCS */}
      {activeTab === 'GATEWAY_DOCS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              {PAYMENT_INTEGRATION_GUIDE.culqi.name}
            </h3>
            <p className="text-xs text-slate-300">{PAYMENT_INTEGRATION_GUIDE.culqi.description}</p>
            <ul className="space-y-1 text-xs text-slate-400">
              {PAYMENT_INTEGRATION_GUIDE.culqi.flow.map((f, i) => (
                <li key={i} className="leading-relaxed">{f}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-400" />
              {PAYMENT_INTEGRATION_GUIDE.niubiz.name}
            </h3>
            <p className="text-xs text-slate-300">{PAYMENT_INTEGRATION_GUIDE.niubiz.description}</p>
            <ul className="space-y-1 text-xs text-slate-400">
              {PAYMENT_INTEGRATION_GUIDE.niubiz.flow.map((f, i) => (
                <li key={i} className="leading-relaxed">{f}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};
