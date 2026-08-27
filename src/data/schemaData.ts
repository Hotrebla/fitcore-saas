export interface SchemaTable {
  name: string;
  description: string;
  category: 'Core & Multi-Tenant' | 'Memberships & Billing' | 'Access & IoT' | 'Bookings & Scheduling' | 'Training & Workouts' | 'CRM & POS';
  columns: {
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
    foreignRef?: string;
    isNullable?: boolean;
    description: string;
  }[];
  indexes: string[];
}

export const SCHEMA_TABLES: SchemaTable[] = [
  {
    name: 'tenants',
    category: 'Core & Multi-Tenant',
    description: 'Aislamiento multi-tenant raíz. Representa la franquicia o cadena de gimnasios.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Identificador único global del tenant (v4 UUID)' },
      { name: 'name', type: 'VARCHAR(255)', description: 'Razón social o nombre comercial de la franquicia' },
      { name: 'slug', type: 'VARCHAR(100)', description: 'Slug único para subdominios (ej. goldgym.fitcore.io)' },
      { name: 'tax_id', type: 'VARCHAR(50)', description: 'Identificador fiscal (RUC en Perú, RFC en México, EIN en USA)' },
      { name: 'country_code', type: 'CHAR(2)', description: 'Código ISO 3166-1 alpha-2 (PE, MX, US, CL, CO)' },
      { name: 'currency', type: 'CHAR(3)', description: 'Moneda base del tenant (PEN, USD, EUR, MXN, CLP)' },
      { name: 'fiscal_engine', type: 'VARCHAR(50)', description: 'Motor fiscal: SUNAT_PERU, SAT_MEXICO, STRIPE_INVOICING' },
      { name: 'settings', type: 'JSONB', description: 'Configuraciones de branding, WhatsApp API keys y pasarelas' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Fecha de creación con zona horaria' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', description: 'Fecha de última modificación' }
    ],
    indexes: ['CREATE UNIQUE INDEX idx_tenants_slug ON tenants(slug);', 'CREATE INDEX idx_tenants_tax_id ON tenants(tax_id);']
  },
  {
    name: 'branches',
    category: 'Core & Multi-Tenant',
    description: 'Sedes físicas o locales pertenecientes a un Tenant con capacidad y zona horaria.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'ID único de la sede' },
      { name: 'tenant_id', type: 'UUID', isForeign: true, foreignRef: 'tenants.id', description: 'Tenant propietario (Foreign Key RLS)' },
      { name: 'name', type: 'VARCHAR(150)', description: 'Nombre de la sede (ej. Sede San Isidro, Miraflores Express)' },
      { name: 'address', type: 'TEXT', description: 'Dirección física completa' },
      { name: 'city', type: 'VARCHAR(100)', description: 'Ciudad / Departamento' },
      { name: 'timezone', type: 'VARCHAR(50)', description: 'Zona horaria IANA (ej. America/Lima, America/Bogota)' },
      { name: 'max_capacity', type: 'INT', description: 'Capacidad máxima de aforo simultáneo' },
      { name: 'is_active', type: 'BOOLEAN', description: 'Estado operativo de la sede' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Timestamp de creación' }
    ],
    indexes: ['CREATE INDEX idx_branches_tenant ON branches(tenant_id);', 'CREATE INDEX idx_branches_city ON branches(tenant_id, city);']
  },
  {
    name: 'users',
    category: 'Core & Multi-Tenant',
    description: 'Usuarios del sistema: Socios, Entrenadores, Recepcionistas, Administradores.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'ID de usuario' },
      { name: 'tenant_id', type: 'UUID', isForeign: true, foreignRef: 'tenants.id', description: 'Tenant asignado (RLS isolation key)' },
      { name: 'primary_branch_id', type: 'UUID', isForeign: true, foreignRef: 'branches.id', description: 'Sede de registro principal' },
      { name: 'role', type: 'VARCHAR(50)', description: 'Rol: SuperAdmin, FranchiseOwner, BranchManager, Coach, Member' },
      { name: 'doc_type', type: 'VARCHAR(20)', description: 'Tipo doc: DNI, RUC, CE, PASAPORTE' },
      { name: 'doc_number', type: 'VARCHAR(50)', description: 'Número de documento de identidad' },
      { name: 'first_name', type: 'VARCHAR(100)', description: 'Nombres' },
      { name: 'last_name', type: 'VARCHAR(100)', description: 'Apellidos' },
      { name: 'email', type: 'VARCHAR(255)', description: 'Correo electrónico de autenticación' },
      { name: 'phone', type: 'VARCHAR(50)', description: 'Número de WhatsApp con código de país (ej. +51987654321)' },
      { name: 'password_hash', type: 'VARCHAR(255)', description: 'Hash Argon2id de la contraseña' },
      { name: 'totp_qr_secret', type: 'VARCHAR(64)', description: 'Semilla secreta para generación de QR dinámico 15s' },
      { name: 'status', type: 'VARCHAR(30)', description: 'ACTIVE, EXPIRED, FROZEN, DEBTOR, INACTIVE' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Timestamp de creación' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_users_tenant_email ON users(tenant_id, email);',
      'CREATE UNIQUE INDEX idx_users_tenant_doc ON users(tenant_id, doc_type, doc_number);',
      'CREATE INDEX idx_users_tenant_role ON users(tenant_id, role);'
    ]
  },
  {
    name: 'membership_plans',
    category: 'Memberships & Billing',
    description: 'Catálogo de planes de suscripción (Mensual, Trimestral, Anual, Pases VIP, Clases Boutique).',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'ID del plan' },
      { name: 'tenant_id', type: 'UUID', isForeign: true, foreignRef: 'tenants.id', description: 'Tenant propietario' },
      { name: 'name', type: 'VARCHAR(150)', description: 'Nombre del plan (ej. Black Pass Multisede, Boutique Pilates 12 Clases)' },
      { name: 'duration_days', type: 'INT', description: 'Duración en días (30, 90, 365, etc.)' },
      { name: 'price', type: 'DECIMAL(12,2)', description: 'Precio base en la moneda del tenant' },
      { name: 'currency', type: 'CHAR(3)', description: 'Moneda (PEN, USD, EUR)' },
      { name: 'is_recurring', type: 'BOOLEAN', description: 'Si aplica débito automático mensual' },
      { name: 'allows_multibranch', type: 'BOOLEAN', description: 'Acceso a todas las sedes o solo a sede local' },
      { name: 'class_credits', type: 'INT', isNullable: true, description: 'Créditos incluidos para clases boutique (NULL = ilimitado)' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Timestamp de creación' }
    ],
    indexes: ['CREATE INDEX idx_plans_tenant ON membership_plans(tenant_id);']
  },
  {
    name: 'subscriptions',
    category: 'Memberships & Billing',
    description: 'Membresías activas/históricas de socios con fechas de vigencia y estado de congelamiento.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'ID de la suscripción' },
      { name: 'tenant_id', type: 'UUID', isForeign: true, foreignRef: 'tenants.id', description: 'Tenant propietario' },
      { name: 'user_id', type: 'UUID', isForeign: true, foreignRef: 'users.id', description: 'Socio suscrito' },
      { name: 'plan_id', type: 'UUID', isForeign: true, foreignRef: 'membership_plans.id', description: 'Plan contratado' },
      { name: 'start_date', type: 'DATE', description: 'Fecha de inicio de vigencia' },
      { name: 'end_date', type: 'DATE', description: 'Fecha de fin de vigencia' },
      { name: 'status', type: 'VARCHAR(30)', description: 'ACTIVE, EXPIRED, FROZEN, CANCELLED' },
      { name: 'auto_renew', type: 'BOOLEAN', description: 'Débito recurrente habilitado' },
      { name: 'payment_token_id', type: 'VARCHAR(255)', isNullable: true, description: 'Token de tarjeta en Culqi/Niubiz/Stripe' },
      { name: 'freeze_days_used', type: 'INT', description: 'Días de congelamiento consumidos' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Fecha de suscripción' }
    ],
    indexes: [
      'CREATE INDEX idx_subs_user_status ON subscriptions(tenant_id, user_id, status);',
      'CREATE INDEX idx_subs_end_date ON subscriptions(end_date) WHERE status = \'ACTIVE\';'
    ]
  },
  {
    name: 'payment_transactions',
    category: 'Memberships & Billing',
    description: 'Registro de cobros vía Culqi, Niubiz, Stripe, Yape, Plin o Efectivo en POS.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'ID de transacción' },
      { name: 'tenant_id', type: 'UUID', isForeign: true, foreignRef: 'tenants.id', description: 'Tenant propietario' },
      { name: 'subscription_id', type: 'UUID', isForeign: true, foreignRef: 'subscriptions.id', isNullable: true, description: 'Suscripción relacionada' },
      { name: 'user_id', type: 'UUID', isForeign: true, foreignRef: 'users.id', description: 'Socio que paga' },
      { name: 'gateway', type: 'VARCHAR(50)', description: 'CULQI, NIUBIZ, STRIPE, YAPE_QR, PLIN, CASH_POS' },
      { name: 'gateway_transaction_id', type: 'VARCHAR(255)', description: 'ID de transacción en pasarela externa' },
      { name: 'amount', type: 'DECIMAL(12,2)', description: 'Monto cobrado' },
      { name: 'currency', type: 'CHAR(3)', description: 'Moneda (PEN, USD)' },
      { name: 'status', type: 'VARCHAR(30)', description: 'SUCCESS, FAILED, PENDING, REFUNDED' },
      { name: 'idempotency_key', type: 'VARCHAR(255)', description: 'Clave única para evitar cobros dobles' },
      { name: 'raw_payload', type: 'JSONB', description: 'Payload completo recibido del webhook' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Timestamp de la transacción' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_payments_idempotency ON payment_transactions(tenant_id, idempotency_key);',
      'CREATE INDEX idx_payments_gateway_id ON payment_transactions(gateway, gateway_transaction_id);'
    ]
  },
  {
    name: 'invoices_sunat',
    category: 'Memberships & Billing',
    description: 'Facturación Electrónica SUNAT (Perú) con XML UBL 2.1, CDR firmado y código QR.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'ID fiscal interno' },
      { name: 'tenant_id', type: 'UUID', isForeign: true, foreignRef: 'tenants.id', description: 'Tenant emisor' },
      { name: 'payment_id', type: 'UUID', isForeign: true, foreignRef: 'payment_transactions.id', description: 'Transacción origen' },
      { name: 'invoice_type', type: 'CHAR(2)', description: '01: Factura, 03: Boleta de Venta, 07: Nota de Crédito' },
      { name: 'series', type: 'CHAR(4)', description: 'Serie del comprobante (B001, F001, etc.)' },
      { name: 'correlative', type: 'INT', description: 'Número correlativo autoincrementable' },
      { name: 'client_doc_type', type: 'CHAR(1)', description: '1: DNI, 6: RUC, 4: Carné Extranjería, 7: Pasaporte' },
      { name: 'client_doc_number', type: 'VARCHAR(20)', description: 'Número de documento fiscal del receptor' },
      { name: 'client_legal_name', type: 'VARCHAR(255)', description: 'Razón social o nombre completo del receptor' },
      { name: 'subtotal', type: 'DECIMAL(12,2)', description: 'Valor de venta gravado' },
      { name: 'igv_amount', type: 'DECIMAL(12,2)', description: 'Impuesto General a las Ventas (18%)' },
      { name: 'total_amount', type: 'DECIMAL(12,2)', description: 'Importe total a pagar' },
      { name: 'hash_digest', type: 'VARCHAR(255)', description: 'Firma digital SHA-256 del XML' },
      { name: 'sunat_status', type: 'VARCHAR(30)', description: 'ACCEPTED, REJECTED, EXCEPTION, PENDING' },
      { name: 'cdr_code', type: 'VARCHAR(10)', description: 'Código de respuesta de SUNAT (0 = Aceptado)' },
      { name: 'cdr_description', type: 'TEXT', description: 'Mensaje de respuesta oficial SUNAT' },
      { name: 'xml_url', type: 'TEXT', description: 'URL de almacenamiento del XML firmado' },
      { name: 'pdf_url', type: 'TEXT', description: 'URL del comprobante renderizado en PDF' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Timestamp de emisión' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_invoices_series_correlative ON invoices_sunat(tenant_id, invoice_type, series, correlative);',
      'CREATE INDEX idx_invoices_client_doc ON invoices_sunat(tenant_id, client_doc_number);'
    ]
  },
  {
    name: 'access_logs',
    category: 'Access & IoT',
    description: 'Bitácora de accesos a torniquetes, molinetes y puertas con validación en <150ms.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'ID del registro de acceso' },
      { name: 'tenant_id', type: 'UUID', isForeign: true, foreignRef: 'tenants.id', description: 'Tenant propietario' },
      { name: 'branch_id', type: 'UUID', isForeign: true, foreignRef: 'branches.id', description: 'Sede física donde ocurrió el intento' },
      { name: 'user_id', type: 'UUID', isForeign: true, foreignRef: 'users.id', description: 'Usuario que intenta acceder' },
      { name: 'device_id', type: 'VARCHAR(100)', description: 'ID del hardware (ZKTeco ProFaceX, Dahua, ESP32 IoT)' },
      { name: 'auth_method', type: 'VARCHAR(50)', description: 'QR_DYNAMIC, FACIAL_RECOG, RFID_NFC, FINGERPRINT, PIN' },
      { name: 'decision', type: 'VARCHAR(20)', description: 'GRANTED, DENIED' },
      { name: 'denial_reason', type: 'VARCHAR(100)', isNullable: true, description: 'PLAN_EXPIRED, DEBT_PENDING, FROZEN, ANTI_PASSBACK, INVALID_QR' },
      { name: 'latency_ms', type: 'INT', description: 'Tiempo de respuesta del backend/edge en milisegundos' },
      { name: 'is_offline_sync', type: 'BOOLEAN', description: 'Si fue validado en caché local por caída de internet' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Timestamp exacto del acceso' }
    ],
    indexes: [
      'CREATE INDEX idx_access_tenant_created ON access_logs(tenant_id, created_at DESC);',
      'CREATE INDEX idx_access_user_date ON access_logs(user_id, created_at DESC);'
    ]
  },
  {
    name: 'class_schedules',
    category: 'Bookings & Scheduling',
    description: 'Programación de clases grupales (Spinning, Pilates Reformer, CrossFit, Yoga, Box).',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'ID de la sesión de clase' },
      { name: 'tenant_id', type: 'UUID', isForeign: true, foreignRef: 'tenants.id', description: 'Tenant propietario' },
      { name: 'branch_id', type: 'UUID', isForeign: true, foreignRef: 'branches.id', description: 'Sede física' },
      { name: 'instructor_id', type: 'UUID', isForeign: true, foreignRef: 'users.id', description: 'Coach o entrenador asignado' },
      { name: 'title', type: 'VARCHAR(150)', description: 'Nombre de la clase (ej. Power Cycling 45 min)' },
      { name: 'category', type: 'VARCHAR(50)', description: 'SPINNING, PILATES, CROSSFIT, BOXING, YOGA' },
      { name: 'start_time', type: 'TIMESTAMPTZ', description: 'Hora y fecha de inicio' },
      { name: 'end_time', type: 'TIMESTAMPTZ', description: 'Hora y fecha de finalización' },
      { name: 'total_spots', type: 'INT', description: 'Cupos físicos totales en sala' },
      { name: 'booked_spots', type: 'INT', description: 'Cupos confirmados (Sincronizado vía Redis Atómico)' },
      { name: 'has_spot_layout', type: 'BOOLEAN', description: 'Si permite elegir bicicleta/reformer específico' },
      { name: 'spot_matrix_config', type: 'JSONB', description: 'Matriz visual de asientos en sala (Grid de 4x6)' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Timestamp de creación' }
    ],
    indexes: ['CREATE INDEX idx_classes_branch_start ON class_schedules(tenant_id, branch_id, start_time);']
  },
  {
    name: 'class_bookings',
    category: 'Bookings & Scheduling',
    description: 'Reservas individuales con número de spot, bloqueo de concurrencia y lista de espera.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'ID de la reserva' },
      { name: 'tenant_id', type: 'UUID', isForeign: true, foreignRef: 'tenants.id', description: 'Tenant propietario' },
      { name: 'class_id', type: 'UUID', isForeign: true, foreignRef: 'class_schedules.id', description: 'Clase reservada' },
      { name: 'user_id', type: 'UUID', isForeign: true, foreignRef: 'users.id', description: 'Socio que reserva' },
      { name: 'spot_number', type: 'INT', isNullable: true, description: 'Número de bicicleta o reformer asignado (ej. #14)' },
      { name: 'status', type: 'VARCHAR(30)', description: 'CONFIRMED, WAITLIST, CANCELLED, ATTENDED, NO_SHOW' },
      { name: 'waitlist_position', type: 'INT', isNullable: true, description: 'Posición en cola si la clase estaba llena' },
      { name: 'penalty_charged', type: 'BOOLEAN', description: 'Si se aplicó cargo por cancelación tardía' },
      { name: 'booked_at', type: 'TIMESTAMPTZ', description: 'Timestamp exacto de la reserva' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_bookings_unique_active_spot ON class_bookings(class_id, spot_number) WHERE status = \'CONFIRMED\';',
      'CREATE INDEX idx_bookings_user ON class_bookings(user_id, status);'
    ]
  },
  {
    name: 'exercises',
    category: 'Training & Workouts',
    description: 'Biblioteca multimedia de ejercicios con grupos musculares, equipo y animaciones.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'ID del ejercicio' },
      { name: 'tenant_id', type: 'UUID', isNullable: true, description: 'Tenant propietario (NULL para catálogo global FitCore)' },
      { name: 'name', type: 'VARCHAR(150)', description: 'Nombre (ej. Press Militar con Barra, Peso Muerto Rumano)' },
      { name: 'muscle_group', type: 'VARCHAR(50)', description: 'Pecho, Espalda, Piernas, Hombros, Brazos, Core' },
      { name: 'equipment', type: 'VARCHAR(50)', description: 'Barra Olímpica, Mancuernas, Polea, Peso Corporal, Máquina' },
      { name: 'difficulty', type: 'VARCHAR(30)', description: 'PRINCIPIANTE, INTERMEDIO, AVANZADO' },
      { name: 'media_3d_url', type: 'TEXT', description: 'URL de animación 3D o video HD instruccional' },
      { name: 'biomechanics_tips', type: 'JSONB', description: 'Puntos clave de técnica y errores comunes' }
    ],
    indexes: ['CREATE INDEX idx_exercises_muscle ON exercises(muscle_group, equipment);']
  },
  {
    name: 'body_compositions',
    category: 'Training & Workouts',
    description: 'Seguimiento de bioimpedancia y antropometría sincronizado con InBody / Tanita.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'ID de la medición' },
      { name: 'tenant_id', type: 'UUID', isForeign: true, foreignRef: 'tenants.id', description: 'Tenant propietario' },
      { name: 'user_id', type: 'UUID', isForeign: true, foreignRef: 'users.id', description: 'Socio evaluado' },
      { name: 'evaluated_by_id', type: 'UUID', isNullable: true, description: 'Nutricionista o Coach evaluador' },
      { name: 'weight_kg', type: 'DECIMAL(5,2)', description: 'Peso corporal total' },
      { name: 'body_fat_pct', type: 'DECIMAL(4,2)', description: 'Porcentaje de grasa corporal' },
      { name: 'muscle_mass_kg', type: 'DECIMAL(5,2)', description: 'Masa muscular esquelética' },
      { name: 'visceral_fat_level', type: 'INT', description: 'Nivel de grasa visceral (1-20)' },
      { name: 'metabolic_age', type: 'INT', description: 'Edad metabólica calculada' },
      { name: 'inbody_sync_data', type: 'JSONB', description: 'Datos raw exportados por Bluetooth / InBody API' },
      { name: 'measured_at', type: 'TIMESTAMPTZ', description: 'Fecha de la evaluación' }
    ],
    indexes: ['CREATE INDEX idx_body_comp_user ON body_compositions(user_id, measured_at DESC);']
  }
];

export const DBML_SPEC = `// ============================================================================
// FIT-CORE OS - Database Schema Specification (DBML)
// Multi-Tenant SaaS Architecture for Fitness, IoT & Fiscal Engine
// ============================================================================

Project fit_core_os {
  database_type: 'PostgreSQL'
  Note: 'Enterprise Multi-Tenant SaaS for Gym Management (FITCO + Virtuagym + Glofox)'
}

Table tenants {
  id uuid [pk, default: \`gen_random_uuid()\`]
  name varchar(255) [not null]
  slug varchar(100) [unique, not null]
  tax_id varchar(50) [not null, note: 'RUC en Perú, RFC en México']
  country_code char(2) [not null, default: 'PE']
  currency char(3) [not null, default: 'PEN']
  fiscal_engine varchar(50) [not null, default: 'SUNAT_PERU']
  settings jsonb [note: 'Configuraciones de WhatsApp, Culqi/Niubiz y Branding']
  created_at timestamptz [default: \`now()\`]
  updated_at timestamptz [default: \`now()\`]
}

Table branches {
  id uuid [pk, default: \`gen_random_uuid()\`]
  tenant_id uuid [ref: > tenants.id, not null]
  name varchar(150) [not null]
  address text [not null]
  city varchar(100) [not null]
  timezone varchar(50) [default: 'America/Lima']
  max_capacity int [not null, default: 250]
  is_active boolean [default: true]
  created_at timestamptz [default: \`now()\`]
}

Table users {
  id uuid [pk, default: \`gen_random_uuid()\`]
  tenant_id uuid [ref: > tenants.id, not null]
  primary_branch_id uuid [ref: > branches.id]
  role varchar(50) [not null, note: 'SuperAdmin, FranchiseOwner, BranchManager, Coach, Member']
  doc_type varchar(20) [not null, default: 'DNI']
  doc_number varchar(50) [not null]
  first_name varchar(100) [not null]
  last_name varchar(100) [not null]
  email varchar(255) [not null]
  phone varchar(50) [not null, note: 'WhatsApp con prefijo internacional (+519...)']
  password_hash varchar(255) [not null]
  totp_qr_secret varchar(64) [not null, note: 'Semilla para QR dinámico 15 seg']
  status varchar(30) [not null, default: 'ACTIVE', note: 'ACTIVE, EXPIRED, FROZEN, DEBTOR']
  created_at timestamptz [default: \`now()\`]

  indexes {
    (tenant_id, email) [unique]
    (tenant_id, doc_type, doc_number) [unique]
  }
}

Table membership_plans {
  id uuid [pk, default: \`gen_random_uuid()\`]
  tenant_id uuid [ref: > tenants.id, not null]
  name varchar(150) [not null]
  duration_days int [not null]
  price decimal(12,2) [not null]
  currency char(3) [not null, default: 'PEN']
  is_recurring boolean [default: false]
  allows_multibranch boolean [default: false]
  class_credits int [note: 'NULL para acceso ilimitado']
  created_at timestamptz [default: \`now()\`]
}

Table subscriptions {
  id uuid [pk, default: \`gen_random_uuid()\`]
  tenant_id uuid [ref: > tenants.id, not null]
  user_id uuid [ref: > users.id, not null]
  plan_id uuid [ref: > membership_plans.id, not null]
  start_date date [not null]
  end_date date [not null]
  status varchar(30) [not null, default: 'ACTIVE']
  auto_renew boolean [default: false]
  payment_token_id varchar(255) [note: 'Token Culqi / Niubiz guardado']
  freeze_days_used int [default: 0]
  created_at timestamptz [default: \`now()\`]
}

Table payment_transactions {
  id uuid [pk, default: \`gen_random_uuid()\`]
  tenant_id uuid [ref: > tenants.id, not null]
  subscription_id uuid [ref: > subscriptions.id]
  user_id uuid [ref: > users.id, not null]
  gateway varchar(50) [not null, note: 'CULQI, NIUBIZ, YAPE_QR, STRIPE, POS_CASH']
  gateway_transaction_id varchar(255) [not null]
  amount decimal(12,2) [not null]
  currency char(3) [not null, default: 'PEN']
  status varchar(30) [not null, default: 'SUCCESS']
  idempotency_key varchar(255) [unique, not null]
  raw_payload jsonb
  created_at timestamptz [default: \`now()\`]
}

Table invoices_sunat {
  id uuid [pk, default: \`gen_random_uuid()\`]
  tenant_id uuid [ref: > tenants.id, not null]
  payment_id uuid [ref: - payment_transactions.id, not null]
  invoice_type char(2) [not null, note: '01: Factura, 03: Boleta, 07: NC']
  series char(4) [not null, note: 'B001, F001']
  correlative int [not null]
  client_doc_type char(1) [not null, note: '1: DNI, 6: RUC']
  client_doc_number varchar(20) [not null]
  client_legal_name varchar(255) [not null]
  subtotal decimal(12,2) [not null]
  igv_amount decimal(12,2) [not null, note: '18% IGV Perú']
  total_amount decimal(12,2) [not null]
  hash_digest varchar(255) [not null, note: 'SHA-256 Digest del XML UBL 2.1']
  sunat_status varchar(30) [not null, default: 'ACCEPTED']
  cdr_code varchar(10) [default: '0']
  cdr_description text
  xml_url text
  pdf_url text
  created_at timestamptz [default: \`now()\`]

  indexes {
    (tenant_id, invoice_type, series, correlative) [unique]
  }
}

Table access_logs {
  id uuid [pk, default: \`gen_random_uuid()\`]
  tenant_id uuid [ref: > tenants.id, not null]
  branch_id uuid [ref: > branches.id, not null]
  user_id uuid [ref: > users.id, not null]
  device_id varchar(100) [not null]
  auth_method varchar(50) [not null, note: 'QR_DYNAMIC, FACIAL, RFID_NFC']
  decision varchar(20) [not null, note: 'GRANTED, DENIED']
  denial_reason varchar(100)
  latency_ms int [not null]
  is_offline_sync boolean [default: false]
  created_at timestamptz [default: \`now()\`]
}

Table class_schedules {
  id uuid [pk, default: \`gen_random_uuid()\`]
  tenant_id uuid [ref: > tenants.id, not null]
  branch_id uuid [ref: > branches.id, not null]
  instructor_id uuid [ref: > users.id, not null]
  title varchar(150) [not null]
  category varchar(50) [not null]
  start_time timestamptz [not null]
  end_time timestamptz [not null]
  total_spots int [not null]
  booked_spots int [not null, default: 0]
  has_spot_layout boolean [default: true]
  spot_matrix_config jsonb
  created_at timestamptz [default: \`now()\`]
}

Table class_bookings {
  id uuid [pk, default: \`gen_random_uuid()\`]
  tenant_id uuid [ref: > tenants.id, not null]
  class_id uuid [ref: > class_schedules.id, not null]
  user_id uuid [ref: > users.id, not null]
  spot_number int
  status varchar(30) [not null, default: 'CONFIRMED', note: 'CONFIRMED, WAITLIST, CANCELLED']
  waitlist_position int
  penalty_charged boolean [default: false]
  booked_at timestamptz [default: \`now()\`]

  indexes {
    (class_id, spot_number) [unique, note: 'Garantiza que una bicicleta no tenga 2 reservas activas']
  }
}

Table exercises {
  id uuid [pk, default: \`gen_random_uuid()\`]
  tenant_id uuid [ref: > tenants.id]
  name varchar(150) [not null]
  muscle_group varchar(50) [not null]
  equipment varchar(50) [not null]
  difficulty varchar(30) [not null]
  media_3d_url text
  biomechanics_tips jsonb
}

Table body_compositions {
  id uuid [pk, default: \`gen_random_uuid()\`]
  tenant_id uuid [ref: > tenants.id, not null]
  user_id uuid [ref: > users.id, not null]
  evaluated_by_id uuid [ref: > users.id]
  weight_kg decimal(5,2) [not null]
  body_fat_pct decimal(4,2) [not null]
  muscle_mass_kg decimal(5,2) [not null]
  visceral_fat_level int [not null]
  metabolic_age int
  inbody_sync_data jsonb
  measured_at timestamptz [default: \`now()\`]
}
`;

export const POSTGRESQL_DDL_RLS = `-- ============================================================================
-- FIT-CORE OS: PostgreSQL DDL + Row Level Security (RLS) Multi-Tenant Policies
-- ============================================================================

-- 1. Habilitar extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Esquema y contexto de sesión para Multi-Tenant RLS
-- La aplicación NestJS inyecta SET LOCAL app.current_tenant_id = '<tenant_uuid>'; en cada transacción

-- Tabla: tenants
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tax_id VARCHAR(50) NOT NULL, -- RUC / RFC / Tax ID
    country_code CHAR(2) NOT NULL DEFAULT 'PE',
    currency CHAR(3) NOT NULL DEFAULT 'PEN',
    fiscal_engine VARCHAR(50) NOT NULL DEFAULT 'SUNAT_PERU',
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: branches
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'America/Lima',
    max_capacity INT NOT NULL DEFAULT 250,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    primary_branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    role VARCHAR(50) NOT NULL,
    doc_type VARCHAR(20) NOT NULL DEFAULT 'DNI',
    doc_number VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    totp_qr_secret VARCHAR(64) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_users_tenant_email UNIQUE(tenant_id, email),
    CONSTRAINT uq_users_tenant_doc UNIQUE(tenant_id, doc_type, doc_number)
);

-- Tabla: membership_plans
CREATE TABLE membership_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    duration_days INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'PEN',
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    allows_multibranch BOOLEAN NOT NULL DEFAULT FALSE,
    class_credits INT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES membership_plans(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
    payment_token_id VARCHAR(255) NULL,
    freeze_days_used INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: payment_transactions
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    gateway VARCHAR(50) NOT NULL, -- CULQI, NIUBIZ, YAPE_QR, STRIPE, POS_CASH
    gateway_transaction_id VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'PEN',
    status VARCHAR(30) NOT NULL DEFAULT 'SUCCESS',
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    raw_payload JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: invoices_sunat
CREATE TABLE invoices_sunat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    payment_id UUID NOT NULL REFERENCES payment_transactions(id) ON DELETE RESTRICT,
    invoice_type CHAR(2) NOT NULL, -- 01: Factura, 03: Boleta, 07: Nota Crédito
    series CHAR(4) NOT NULL, -- B001, F001
    correlative INT NOT NULL,
    client_doc_type CHAR(1) NOT NULL, -- 1: DNI, 6: RUC
    client_doc_number VARCHAR(20) NOT NULL,
    client_legal_name VARCHAR(255) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    igv_amount DECIMAL(12,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    hash_digest VARCHAR(255) NOT NULL,
    sunat_status VARCHAR(30) NOT NULL DEFAULT 'ACCEPTED',
    cdr_code VARCHAR(10) DEFAULT '0',
    cdr_description TEXT,
    xml_url TEXT,
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_invoices_correlative UNIQUE(tenant_id, invoice_type, series, correlative)
);

-- Tabla: access_logs
CREATE TABLE access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(100) NOT NULL,
    auth_method VARCHAR(50) NOT NULL,
    decision VARCHAR(20) NOT NULL,
    denial_reason VARCHAR(100),
    latency_ms INT NOT NULL,
    is_offline_sync BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: class_schedules
CREATE TABLE class_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    total_spots INT NOT NULL,
    booked_spots INT NOT NULL DEFAULT 0,
    has_spot_layout BOOLEAN NOT NULL DEFAULT TRUE,
    spot_matrix_config JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: class_bookings
CREATE TABLE class_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES class_schedules(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    spot_number INT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
    waitlist_position INT NULL,
    penalty_charged BOOLEAN NOT NULL DEFAULT FALSE,
    booked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_class_spot_booking UNIQUE (class_id, spot_number)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Aislamiento criptográfico estricto a nivel de base de datos PostgreSQL
-- ============================================================================

-- Habilitar RLS en todas las tablas sensibles
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices_sunat ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_bookings ENABLE ROW LEVEL SECURITY;

-- Política Genérica de Aislamiento Tenant por session variable (app.current_tenant_id)
CREATE POLICY tenant_isolation_users ON users
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_branches ON branches
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_subscriptions ON subscriptions
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_payments ON payment_transactions
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_invoices ON invoices_sunat
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_access ON access_logs
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_classes ON class_schedules
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_bookings ON class_bookings
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
`;
