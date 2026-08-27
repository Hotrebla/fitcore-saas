export type Role = 'SuperAdmin' | 'FranchiseOwner' | 'BranchManager' | 'Receptionist' | 'Coach' | 'Nutritionist' | 'Member';

export type Currency = 'PEN' | 'USD' | 'EUR' | 'CLP' | 'MXN';

export type ActiveModule =
  | 'SAAS_SUPERADMIN'
  | 'ERD_SCHEMA'
  | 'NESTJS_MICROSERVICES'
  | 'OVERBOOKING_CONCURRENCY'
  | 'SUNAT_PAYMENTS'
  | 'ACCESS_CONTROL'
  | 'BOUTIQUE_BOOKING'
  | 'TRAINING_BIOMETRICS'
  | 'WHATSAPP_CRM'
  | 'FINANCIAL_BI';

export interface SaaSSubscription {
  plan: 'BOUTIQUE_STUDIO' | 'GYM_PRO' | 'ENTERPRISE_CHAIN';
  planName: string;
  monthlyPriceUsd: number;
  status: 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'CANCELLED';
  billingCycle: 'MONTHLY' | 'ANNUAL';
  nextBillingDate: string;
  maxBranches: number;
  maxMembers: number;
  paymentMethod: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  country: string;
  currency: Currency;
  taxId: string; // RUC in Peru, RFC in Mexico, EIN in US
  fiscalEngine: 'SUNAT_PERU' | 'SAT_MEXICO' | 'STRIPE_GLOBAL' | 'SII_CHILE';
  activeBranches: number;
  totalMembers: number;
  logo: string;
  phone: string;
  adminEmail?: string;
  adminName?: string;
  adminPassword?: string;
  whatsappApiKey?: string;
  primaryColor: string;
  saasSubscription?: SaaSSubscription;
  createdAt?: string;
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  city: string;
  address: string;
  timezone: string;
  capacity: number;
  activeCount: number;
  status: 'OPEN' | 'CLOSED' | 'MAINTENANCE';
}

export interface UserMember {
  id: string;
  tenantId: string;
  branchId: string;
  firstName: string;
  lastName: string;
  docType: 'DNI' | 'CE' | 'PASAPORTE' | 'RUC';
  docNumber: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'ACTIVE' | 'EXPIRED' | 'FROZEN' | 'DEBTOR';
  membershipPlan: string;
  membershipExpiresAt: string;
  outstandingBalance: number;
  qrSeed: string;
  lastAccess?: string;
  emergencyContact: string;
  bioMetrics?: {
    weightKg: number;
    fatPercentage: number;
    muscleKg: number;
    visceralFat: number;
    metabolicAge: number;
    lastAssessment: string;
  };
}

export interface AccessLog {
  id: string;
  timestamp: string;
  memberId: string;
  memberName: string;
  branchId: string;
  branchName: string;
  method: 'QR_DYNAMIC' | 'FACIAL_RECOG' | 'RFID_BAND' | 'PIN_MANUAL';
  device: string;
  decision: 'GRANTED' | 'DENIED';
  reason?: string;
  latencyMs: number;
  isOfflineSync: boolean;
}

export interface BoutiqueClass {
  id: string;
  tenantId: string;
  branchId: string;
  title: string;
  category: 'SPINNING' | 'PILATES_REFORMER' | 'CROSSFIT_WOD' | 'BOXING' | 'YOGA';
  instructor: string;
  instructorAvatar: string;
  startTime: string;
  durationMin: number;
  totalSpots: number;
  bookedSpots: number;
  spots: SpotLayout[];
  waitlist: string[];
}

export interface SpotLayout {
  spotNumber: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'LOCKED_RESERVED' | 'MAINTENANCE';
  memberId?: string;
  memberName?: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: 'Pecho' | 'Espalda' | 'Piernas' | 'Hombros' | 'Brazos' | 'Core' | 'Cardio';
  equipment: 'Barra Olímpica' | 'Mancuernas' | 'Polea' | 'Máquina Guiada' | 'Peso Corporal' | 'Kettlebell';
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  targetMuscle: string;
  thumbnail: string;
  videoUrl?: string;
  tips: string[];
}

export interface WodItem {
  id: string;
  date: string;
  title: string;
  type: 'AMRAP' | 'EMOM' | 'FOR_TIME' | 'TABATA';
  durationDesc: string;
  description: string[];
  records: { athleteName: string; score: string; avatar: string; rank: number }[];
}

export interface InvoiceSUNAT {
  id: string;
  tenantId: string;
  invoiceType: '01' | '03' | '07'; // 01: Factura, 03: Boleta, 07: Nota de Crédito
  series: string; // B001 or F001
  correlative: number;
  issueDate: string;
  clientDocType: '1' | '6' | '4' | '7'; // 1: DNI, 6: RUC
  clientDocNumber: string;
  clientName: string;
  clientAddress?: string;
  currency: 'PEN' | 'USD';
  subtotal: number;
  igv: number; // 18% in Peru
  total: number;
  paymentMethod: 'CULQI_CARD' | 'NIUBIZ' | 'YAPE_QR' | 'PLIN' | 'CASH';
  sunatStatus: 'ACCEPTED' | 'REJECTED' | 'PENDING';
  hashDigest: string;
  cdrResponseCode: string;
  cdrDescription: string;
  pdfUrl?: string;
  xmlUrl?: string;
}

export interface WhatsAppMessage {
  id: string;
  toPhone: string;
  memberName: string;
  type: 'WELCOME_CREDENTIAL' | 'PAYMENT_REMINDER' | 'INACTIVITY_REACTIVATION' | 'CLASS_CONFIRMATION' | 'INVOICE_DELIVERY';
  content: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  actions?: string[];
}

export interface PosProduct {
  id: string;
  name: string;
  sku: string;
  category: 'Suplementos' | 'Bebidas' | 'Ropa & Accesorios' | 'Pases';
  price: number;
  stock: number;
  image: string;
}
