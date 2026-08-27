import {
  Tenant,
  Branch,
  UserMember,
  AccessLog,
  BoutiqueClass,
  ExerciseItem,
  WodItem,
  InvoiceSUNAT,
  WhatsAppMessage,
  PosProduct
} from '../types';

export const SAMPLE_TENANTS: Tenant[] = [
  {
    id: 't-peru-01',
    name: 'FIT-CORE Wellness & Fitness Perú S.A.C.',
    slug: 'fitcore-peru',
    country: 'Perú',
    currency: 'PEN',
    taxId: '20601234567', // RUC
    fiscalEngine: 'SUNAT_PERU',
    activeBranches: 4,
    totalMembers: 2450,
    logo: '🏋️‍♂️',
    phone: '+51 1 700 8890',
    adminName: 'Carlos Mendizábal',
    adminEmail: 'carlos@fitcoreperu.com',
    adminPassword: '••••••••••••',
    primaryColor: '#059669', // Emerald
    createdAt: '2025-01-15',
    saasSubscription: {
      plan: 'ENTERPRISE_CHAIN',
      planName: 'Enterprise Chain (Multisede)',
      monthlyPriceUsd: 299,
      status: 'ACTIVE',
      billingCycle: 'MONTHLY',
      nextBillingDate: '2026-09-01',
      maxBranches: 10,
      maxMembers: 5000,
      paymentMethod: 'Tarjeta Crédito •••• 8821'
    }
  },
  {
    id: 't-chile-02',
    name: 'PowerStudio Boutique Santiago',
    slug: 'powerstudio-chile',
    country: 'Chile',
    currency: 'CLP',
    taxId: '76.452.120-K', // RUT
    fiscalEngine: 'SII_CHILE',
    activeBranches: 2,
    totalMembers: 1120,
    logo: '⚡',
    phone: '+56 2 2890 1200',
    adminName: 'Valentina Valenzuela',
    adminEmail: 'valen@powerstudio.cl',
    adminPassword: '••••••••••••',
    primaryColor: '#2563EB', // Blue
    createdAt: '2025-03-10',
    saasSubscription: {
      plan: 'BOUTIQUE_STUDIO',
      planName: 'Boutique Studio (Pilates & Cycling)',
      monthlyPriceUsd: 99,
      status: 'ACTIVE',
      billingCycle: 'MONTHLY',
      nextBillingDate: '2026-09-05',
      maxBranches: 2,
      maxMembers: 1500,
      paymentMethod: 'Transbank Webpay •••• 4019'
    }
  },
  {
    id: 't-usa-03',
    name: 'Iron Forge Athletic Club Miami',
    slug: 'ironforge-miami',
    country: 'USA',
    currency: 'USD',
    taxId: '84-2910394', // EIN
    fiscalEngine: 'STRIPE_GLOBAL',
    activeBranches: 2,
    totalMembers: 1890,
    logo: '🔥',
    phone: '+1 305 490 2931',
    adminName: 'Marcus Reynolds',
    adminEmail: 'marcus@ironforgemiami.com',
    adminPassword: '••••••••••••',
    primaryColor: '#D97706', // Amber
    createdAt: '2025-06-20',
    saasSubscription: {
      plan: 'GYM_PRO',
      planName: 'Gym Pro (Torniquetes IoT + WhatsApp)',
      monthlyPriceUsd: 149,
      status: 'ACTIVE',
      billingCycle: 'MONTHLY',
      nextBillingDate: '2026-09-12',
      maxBranches: 3,
      maxMembers: 3000,
      paymentMethod: 'Stripe ACH / Card •••• 1029'
    }
  }
];

export const SAMPLE_BRANCHES: Branch[] = [
  {
    id: 'b-san-isidro',
    tenantId: 't-peru-01',
    name: 'Sede San Isidro (Flagship)',
    city: 'Lima',
    address: 'Av. Conquistadores 840, San Isidro',
    timezone: 'America/Lima',
    capacity: 250,
    activeCount: 84,
    status: 'OPEN'
  },
  {
    id: 'b-miraflores',
    tenantId: 't-peru-01',
    name: 'Sede Miraflores Boutique',
    city: 'Lima',
    address: 'Av. Larco 1150, Miraflores',
    timezone: 'America/Lima',
    capacity: 180,
    activeCount: 62,
    status: 'OPEN'
  },
  {
    id: 'b-surco',
    tenantId: 't-peru-01',
    name: 'Sede Surco El Polo',
    city: 'Lima',
    address: 'Av. El Polo 670, Santiago de Surco',
    timezone: 'America/Lima',
    capacity: 300,
    activeCount: 112,
    status: 'OPEN'
  }
];

export const SAMPLE_MEMBERS: UserMember[] = [
  {
    id: 'u-carlos-mendoza',
    tenantId: 't-peru-01',
    branchId: 'b-san-isidro',
    firstName: 'Carlos',
    lastName: 'Mendoza Paredes',
    docType: 'DNI',
    docNumber: '72849102',
    email: 'carlos.mendoza@gmail.com',
    phone: '+51 984 512 890',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    membershipPlan: 'Black Pass Anual Multisede',
    membershipExpiresAt: '2027-02-15',
    outstandingBalance: 0,
    qrSeed: 'FITCORE_TOTP_SEED_K9921_CARLOS',
    lastAccess: 'Hoy 07:15 AM (Torniquete Principal)',
    emergencyContact: 'Lucía Paredes (+51 991 223 445)',
    bioMetrics: {
      weightKg: 78.4,
      fatPercentage: 14.2,
      muscleKg: 41.8,
      visceralFat: 4,
      metabolicAge: 24,
      lastAssessment: '2026-08-10'
    }
  },
  {
    id: 'u-valeria-rojas',
    tenantId: 't-peru-01',
    branchId: 'b-san-isidro',
    firstName: 'Valeria',
    lastName: 'Rojas Castro',
    docType: 'DNI',
    docNumber: '71938201',
    email: 'valeria.rojas@outlook.com',
    phone: '+51 977 124 990',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    membershipPlan: 'Boutique Pilates & Spinning 20 Clases',
    membershipExpiresAt: '2026-10-30',
    outstandingBalance: 0,
    qrSeed: 'FITCORE_TOTP_SEED_R8812_VALERIA',
    lastAccess: 'Ayer 06:30 PM (Molinetes Boutique)',
    emergencyContact: 'Martín Rojas (+51 980 112 334)',
    bioMetrics: {
      weightKg: 58.2,
      fatPercentage: 19.5,
      muscleKg: 26.4,
      visceralFat: 2,
      metabolicAge: 22,
      lastAssessment: '2026-08-18'
    }
  },
  {
    id: 'u-roberto-alvarez',
    tenantId: 't-peru-01',
    branchId: 'b-miraflores',
    firstName: 'Roberto',
    lastName: 'Álvarez Nuñez',
    docType: 'CE',
    docNumber: '003920194',
    email: 'roberto.alvarez@techcorp.io',
    phone: '+51 961 889 012',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'DEBTOR',
    membershipPlan: 'Mensual Recurrente Débito',
    membershipExpiresAt: '2026-08-20',
    outstandingBalance: 199.00,
    qrSeed: 'FITCORE_TOTP_SEED_A3301_ROBERTO',
    lastAccess: 'Hace 4 días (Denegado por Deuda)',
    emergencyContact: 'Elena Nuñez (+51 955 443 221)',
    bioMetrics: {
      weightKg: 85.0,
      fatPercentage: 21.0,
      muscleKg: 39.2,
      visceralFat: 7,
      metabolicAge: 33,
      lastAssessment: '2026-07-15'
    }
  },
  {
    id: 'u-mariana-duran',
    tenantId: 't-peru-01',
    branchId: 'b-san-isidro',
    firstName: 'Mariana',
    lastName: 'Durán Siles',
    docType: 'DNI',
    docNumber: '48201928',
    email: 'mariana.duran@gmail.com',
    phone: '+51 988 776 655',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'FROZEN',
    membershipPlan: 'Trimestral Estudiante (Congelado por Viaje)',
    membershipExpiresAt: '2026-11-15',
    outstandingBalance: 0,
    qrSeed: 'FITCORE_TOTP_SEED_F9901_MARIANA',
    lastAccess: 'Hace 12 días',
    emergencyContact: 'Jorge Durán (+51 999 111 222)'
  },
  {
    id: 'u-gabriel-soto',
    tenantId: 't-peru-01',
    branchId: 'b-san-isidro',
    firstName: 'Gabriel',
    lastName: 'Soto Vargas',
    docType: 'DNI',
    docNumber: '70291048',
    email: 'gabriel.soto@gmail.com',
    phone: '+51 944 332 110',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'EXPIRED',
    membershipPlan: 'Pase 30 Días Básico',
    membershipExpiresAt: '2026-08-10',
    outstandingBalance: 0,
    qrSeed: 'FITCORE_TOTP_SEED_E1102_GABRIEL',
    lastAccess: 'Hace 14 días',
    emergencyContact: 'Carmen Soto (+51 988 221 009)'
  }
];

export const SAMPLE_ACCESS_LOGS: AccessLog[] = [
  {
    id: 'acc-001',
    timestamp: 'Hoy 08:24:12 AM',
    memberId: 'u-carlos-mendoza',
    memberName: 'Carlos Mendoza',
    branchId: 'b-san-isidro',
    branchName: 'Sede San Isidro',
    method: 'QR_DYNAMIC',
    device: 'Torniquete A - Tornillo ZKTeco ProFaceX',
    decision: 'GRANTED',
    latencyMs: 84,
    isOfflineSync: false
  },
  {
    id: 'acc-002',
    timestamp: 'Hoy 08:21:40 AM',
    memberId: 'u-valeria-rojas',
    memberName: 'Valeria Rojas',
    branchId: 'b-san-isidro',
    branchName: 'Sede San Isidro',
    method: 'FACIAL_RECOG',
    device: 'Cámara Terminal ZK Face 5.0',
    decision: 'GRANTED',
    latencyMs: 112,
    isOfflineSync: false
  },
  {
    id: 'acc-003',
    timestamp: 'Hoy 08:15:02 AM',
    memberId: 'u-roberto-alvarez',
    memberName: 'Roberto Álvarez',
    branchId: 'b-san-isidro',
    branchName: 'Sede San Isidro',
    method: 'QR_DYNAMIC',
    device: 'Torniquete B - Dahua Scanner',
    decision: 'DENIED',
    reason: 'DEUDA PENDIENTE (S/. 199.00 - Cuota Vencida)',
    latencyMs: 92,
    isOfflineSync: false
  },
  {
    id: 'acc-004',
    timestamp: 'Hoy 08:02:18 AM',
    memberId: 'u-mariana-duran',
    memberName: 'Mariana Durán',
    branchId: 'b-san-isidro',
    branchName: 'Sede San Isidro',
    method: 'RFID_BAND',
    device: 'Lector Pulsera RFID NFC #3',
    decision: 'DENIED',
    reason: 'MEMBRESÍA CONGELADA (Regresa el 15/09)',
    latencyMs: 65,
    isOfflineSync: false
  },
  {
    id: 'acc-005',
    timestamp: 'Hoy 07:55:40 AM',
    memberId: 'u-gabriel-soto',
    memberName: 'Gabriel Soto',
    branchId: 'b-san-isidro',
    branchName: 'Sede San Isidro',
    method: 'QR_DYNAMIC',
    device: 'Torniquete A - Tornillo ZKTeco',
    decision: 'DENIED',
    reason: 'PLAN VENCIDO EL 10/08/2026',
    latencyMs: 78,
    isOfflineSync: false
  }
];

export const INITIAL_BOUTIQUE_CLASSES: BoutiqueClass[] = [
  {
    id: 'cls-spinning-01',
    tenantId: 't-peru-01',
    branchId: 'b-san-isidro',
    title: 'RPM Power Cycling (Spinning)',
    category: 'SPINNING',
    instructor: 'Diego "Beast" Santillán',
    instructorAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
    startTime: '07:00 AM',
    durationMin: 45,
    totalSpots: 20,
    bookedSpots: 19, // 1 spot remaining to simulate overbooking test!
    spots: Array.from({ length: 20 }, (_, i) => ({
      spotNumber: i + 1,
      status: i + 1 === 12 ? 'AVAILABLE' : 'OCCUPIED',
      memberName: i + 1 === 12 ? undefined : `Socio #${i + 1}`
    })),
    waitlist: []
  },
  {
    id: 'cls-pilates-02',
    tenantId: 't-peru-01',
    branchId: 'b-san-isidro',
    title: 'Reformer Core & Align Pilates',
    category: 'PILATES_REFORMER',
    instructor: 'Camila Zegarra',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    startTime: '08:30 AM',
    durationMin: 50,
    totalSpots: 12,
    bookedSpots: 9,
    spots: Array.from({ length: 12 }, (_, i) => ({
      spotNumber: i + 1,
      status: [3, 7, 11].includes(i + 1) ? 'AVAILABLE' : 'OCCUPIED',
      memberName: [3, 7, 11].includes(i + 1) ? undefined : `Socio #${i + 1}`
    })),
    waitlist: []
  },
  {
    id: 'cls-crossfit-03',
    tenantId: 't-peru-01',
    branchId: 'b-san-isidro',
    title: 'CrossFit WOD & Strength',
    category: 'CROSSFIT_WOD',
    instructor: 'Rodrigo "Viking" Benítez',
    instructorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    startTime: '06:00 PM',
    durationMin: 60,
    totalSpots: 16,
    bookedSpots: 12,
    spots: Array.from({ length: 16 }, (_, i) => ({
      spotNumber: i + 1,
      status: [2, 5, 9, 14].includes(i + 1) ? 'AVAILABLE' : 'OCCUPIED',
      memberName: [2, 5, 9, 14].includes(i + 1) ? undefined : `Socio #${i + 1}`
    })),
    waitlist: []
  }
];

export const SAMPLE_EXERCISES: ExerciseItem[] = [
  {
    id: 'ex-bench-press',
    name: 'Press de Banca Plano con Barra',
    category: 'Pecho',
    equipment: 'Barra Olímpica',
    level: 'Intermedio',
    targetMuscle: 'Pectoral Mayor, Deltoides Anterior, Tríceps',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&auto=format&fit=crop&q=80',
    tips: [
      'Retracción escapular activa durante todo el rango',
      'Puntos de apoyo firmes: pies, glúteos y parte alta de la espalda',
      'Trayectoria en ligera diagonal hacia el esternón'
    ]
  },
  {
    id: 'ex-squat',
    name: 'Sentadilla Trasera con Barra (Back Squat)',
    category: 'Piernas',
    equipment: 'Barra Olímpica',
    level: 'Avanzado',
    targetMuscle: 'Cuádriceps, Glúteo Mayor, Erectores Espinales',
    thumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&auto=format&fit=crop&q=80',
    tips: [
      'Maniobra de Valsalva para presión intraabdominal',
      'Romper paralelo manteniendo neutralidad lumbo-pélvica',
      'Rodillas alineadas con la punta de los pies'
    ]
  },
  {
    id: 'ex-deadlift',
    name: 'Peso Muerto Convencional (Deadlift)',
    category: 'Espalda',
    equipment: 'Barra Olímpica',
    level: 'Avanzado',
    targetMuscle: 'Isquiosurales, Glúteos, Dorsal Ancho, Trapecios',
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=80',
    tips: [
      'Barra pegada a las tibias en el despegue',
      'Empuje con el suelo antes de extender la cadera',
      'Bloqueo dorsal para proteger la columna'
    ]
  },
  {
    id: 'ex-pullup',
    name: 'Dominadas Pronas Estrictas',
    category: 'Espalda',
    equipment: 'Peso Corporal',
    level: 'Intermedio',
    targetMuscle: 'Dorsal Ancho, Bíceps Braquial, Redondo Mayor',
    thumbnail: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=300&auto=format&fit=crop&q=80',
    tips: [
      'Iniciar con depresión escapular',
      'Pecho hacia la barra evitando balanceo (kipping)',
      'Control excéntrico de 2-3 segundos'
    ]
  },
  {
    id: 'ex-hip-thrust',
    name: 'Hip Thrust con Barra y Banco',
    category: 'Piernas',
    equipment: 'Barra Olímpica',
    level: 'Intermedio',
    targetMuscle: 'Glúteo Mayor (aislamiento superior)',
    thumbnail: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=300&auto=format&fit=crop&q=80',
    tips: [
      'Mentón pegado al pecho en la extensión',
      'Tibia perpendicular al piso en el punto álgido',
      'Pausa isométrica de 1 segundo arriba'
    ]
  },
  {
    id: 'ex-military-press',
    name: 'Press Militar de Pie (Overhead Press)',
    category: 'Hombros',
    equipment: 'Barra Olímpica',
    level: 'Intermedio',
    targetMuscle: 'Deltoides Anterior y Medio, Tríceps, Core',
    thumbnail: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=300&auto=format&fit=crop&q=80',
    tips: [
      'Glúteos y abdomen fuertemente contraídos',
      'Meter la cabeza hacia adelante al pasar la coronilla',
      'Trayectoria vertical pura'
    ]
  }
];

export const SAMPLE_TODAY_WOD: WodItem = {
  id: 'wod-today',
  date: '24 de Agosto, 2026',
  title: 'HERO WOD "MURPH CONDICIONADO"',
  type: 'FOR_TIME',
  durationDesc: 'Time Cap: 40:00 min',
  description: [
    '🏃‍♂️ 1 Milla de Carrera (1600m)',
    '💪 100 Dominadas Estrictas (Pull-ups)',
    '🔥 200 Flexiones de Pecho (Push-ups)',
    '🦵 300 Sentadillas Libres (Air Squats)',
    '🏃‍♂️ 1 Milla de Carrera Final (1600m)'
  ],
  records: [
    { rank: 1, athleteName: 'Carlos Mendoza', score: '32:45 min', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80' },
    { rank: 2, athleteName: 'Diego Santillán (Coach)', score: '33:10 min', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=80&auto=format&fit=crop&q=80' },
    { rank: 3, athleteName: 'Rodrigo Benítez', score: '35:20 min', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&auto=format&fit=crop&q=80' },
    { rank: 4, athleteName: 'Valeria Rojas', score: '37:50 min', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80' }
  ]
};

export const SAMPLE_INVOICES: InvoiceSUNAT[] = [
  {
    id: 'inv-001',
    tenantId: 't-peru-01',
    invoiceType: '03', // Boleta
    series: 'B001',
    correlative: 4921,
    issueDate: '2026-08-24 08:30',
    clientDocType: '1',
    clientDocNumber: '72849102',
    clientName: 'CARLOS MENDOZA PAREDES',
    currency: 'PEN',
    subtotal: 168.64,
    igv: 30.36,
    total: 199.00,
    paymentMethod: 'CULQI_CARD',
    sunatStatus: 'ACCEPTED',
    hashDigest: 'k9YJ87Zxq2m4L9vP1p9ZqL8vP1p=',
    cdrResponseCode: '0',
    cdrDescription: 'La Boleta numero B001-0004921 ha sido aceptada por SUNAT'
  },
  {
    id: 'inv-002',
    tenantId: 't-peru-01',
    invoiceType: '01', // Factura
    series: 'F001',
    correlative: 1204,
    issueDate: '2026-08-24 07:15',
    clientDocType: '6',
    clientDocNumber: '20554910291',
    clientName: 'TECHCORP INNOVATIONS S.A.C.',
    clientAddress: 'Av. Las Begonias 441, San Isidro, Lima',
    currency: 'PEN',
    subtotal: 1525.42,
    igv: 274.58,
    total: 1800.00,
    paymentMethod: 'NIUBIZ',
    sunatStatus: 'ACCEPTED',
    hashDigest: 'm091KzP991kLmNp8811KLLxZqp8=',
    cdrResponseCode: '0',
    cdrDescription: 'La Factura numero F001-0001204 ha sido aceptada por SUNAT'
  },
  {
    id: 'inv-003',
    tenantId: 't-peru-01',
    invoiceType: '03',
    series: 'B001',
    correlative: 4922,
    issueDate: '2026-08-23 18:40',
    clientDocType: '1',
    clientDocNumber: '71938201',
    clientName: 'VALERIA ROJAS CASTRO',
    currency: 'PEN',
    subtotal: 296.61,
    igv: 53.39,
    total: 350.00,
    paymentMethod: 'YAPE_QR',
    sunatStatus: 'ACCEPTED',
    hashDigest: 'p481QvNm9921zLmKl8911KxL990=',
    cdrResponseCode: '0',
    cdrDescription: 'La Boleta numero B001-0004922 ha sido aceptada por SUNAT'
  }
];

export const SAMPLE_WHATSAPP_MESSAGES: WhatsAppMessage[] = [
  {
    id: 'wa-001',
    toPhone: '+51 984 512 890',
    memberName: 'Carlos Mendoza',
    type: 'WELCOME_CREDENTIAL',
    content: '¡Hola Carlos! 🏋️‍♂️ Bienvenido a FIT-CORE San Isidro. Tu credencial digital y código QR dinámico de acceso ya están activos en la App: https://app.fitcore.io/qr?u=72849102. ¡Te esperamos en sala!',
    timestamp: 'Hoy 08:31 AM',
    status: 'READ',
    actions: ['Abrir App QR', 'Ver Rutina Asignada']
  },
  {
    id: 'wa-002',
    toPhone: '+51 961 889 012',
    memberName: 'Roberto Álvarez',
    type: 'PAYMENT_REMINDER',
    content: 'Hola Roberto 💳 Te recordamos que tu cuota de membresía venció el 20/08 (S/. 199.00). Evita bloqueos en torniquete y renueva con 1 clic aquí: https://pay.fitcore.io/link/cuota-9921 o paga con Yape escaneando en caja.',
    timestamp: 'Hoy 08:00 AM',
    status: 'DELIVERED',
    actions: ['Pagar con Culqi / Niubiz', 'Pagar con Yape']
  },
  {
    id: 'wa-003',
    toPhone: '+51 944 332 110',
    memberName: 'Gabriel Soto',
    type: 'INACTIVITY_REACTIVATION',
    content: '¡Gabriel, te extrañamos en el box! 🔥 Han pasado 14 días desde tu último entrenamiento. Para ayudarte a retomar tus metas, te regalamos un pase libre a nuestra clase boutique de Spinning mañana.',
    timestamp: 'Ayer 06:00 PM',
    status: 'READ',
    actions: ['Reservar Clase Gratis', 'Hablar con un Coach']
  }
];

export const SAMPLE_POS_PRODUCTS: PosProduct[] = [
  {
    id: 'prod-iso-whey',
    name: 'Dymatize ISO 100 Hydrolyzed 5lb (Gourmet Chocolate)',
    sku: 'SUP-ISO-5LB',
    category: 'Suplementos',
    price: 349.00,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-creatine',
    name: 'Creapure Creatine Monohydrate 300g Micronized',
    sku: 'SUP-CREA-300G',
    category: 'Suplementos',
    price: 139.00,
    stock: 42,
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-shake-protein',
    name: 'Smoothie Proteico Post-Entreno (Shake Bar)',
    sku: 'BEV-SHAKE-PB',
    category: 'Bebidas',
    price: 18.00,
    stock: 999,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-towel-fitcore',
    name: 'Toalla Microfibra FIT-CORE Antimicrobiana',
    sku: 'ACC-TOWEL-01',
    category: 'Ropa & Accesorios',
    price: 35.00,
    stock: 58,
    image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=200&auto=format&fit=crop&q=80'
  }
];
