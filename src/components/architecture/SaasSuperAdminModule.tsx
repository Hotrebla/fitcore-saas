import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  DollarSign, 
  ShieldAlert, 
  KeyRound, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Globe, 
  Server, 
  GitBranch, 
  Lock, 
  Send, 
  UserCheck, 
  TrendingUp, 
  CreditCard, 
  AlertCircle, 
  HelpCircle, 
  Layers, 
  Zap, 
  CheckCircle2,
  Users,
  Store
} from 'lucide-react';
import { Tenant, Branch, SaaSSubscription, Currency } from '../../types';

interface SaasSuperAdminModuleProps {
  tenants: Tenant[];
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  onAddTenant: (newTenant: Tenant, newBranch: Branch) => void;
  onUpdateTenantStatus: (tenantId: string, status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED') => void;
}

export const SaasSuperAdminModule: React.FC<SaasSuperAdminModuleProps> = ({
  tenants,
  currentTenant,
  onSelectTenant,
  onAddTenant,
  onUpdateTenantStatus
}) => {
  const [activeTab, setActiveTab] = useState<'CLIENTS_LIST' | 'NEW_ONBOARDING' | 'HOW_TO_SELL' | 'ROI_CALCULATOR'>('HOW_TO_SELL');

  // Form State for New Gym Onboarding
  const [gymName, setGymName] = useState('');
  const [country, setCountry] = useState('Perú');
  const [currency, setCurrency] = useState<Currency>('PEN');
  const [taxId, setTaxId] = useState('');
  const [branchName, setBranchName] = useState('Sede Principal Miraflores');
  const [branchAddress, setBranchAddress] = useState('Av. Larco 1200, Miraflores');
  const [selectedPlan, setSelectedPlan] = useState<'BOUTIQUE_STUDIO' | 'GYM_PRO' | 'ENTERPRISE_CHAIN'>('GYM_PRO');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('GymPass2026!');
  
  // Feedback state after creation
  const [createdTenantResult, setCreatedTenantResult] = useState<{
    tenant: Tenant;
    loginUrl: string;
    whatsappText: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // ROI Calculator State
  const [clientCount, setClientCount] = useState(15);
  const [avgPrice, setAvgPrice] = useState(149);

  // SaaS Pricing Options
  const plans = {
    BOUTIQUE_STUDIO: {
      name: 'Boutique Studio',
      price: 99,
      branches: 1,
      members: 1000,
      description: 'Ideal para estudios de Spinning, Pilates Reformer, Yoga y CrossFit Box.',
      features: ['Reserva visual de cupos/bicicletas', 'App móvil de socios (PWA)', 'Lista de espera automática', 'Cobros con Yape y Culqi']
    },
    GYM_PRO: {
      name: 'Gym Pro',
      price: 149,
      branches: 3,
      members: 3000,
      description: 'Para gimnasios tradicionales con control de acceso por torniquetes.',
      features: ['Torniquetes IoT con QR dinámico', 'Facturación electrónica SUNAT', 'Bot de cobranza WhatsApp', 'Caja POS & Venta de Suplementos']
    },
    ENTERPRISE_CHAIN: {
      name: 'Enterprise Chain',
      price: 299,
      branches: 10,
      members: 10000,
      description: 'Para cadenas de gimnasios multisede con reportería corporativa.',
      features: ['Acceso multisede cruzado', 'Integración con InBody', 'Base de datos aislada con RLS', 'Soporte prioritario 24/7']
    }
  };

  const handleCreateGym = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gymName || !ownerEmail) return;

    const slug = gymName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const tenantId = `t-${slug}-${Date.now().toString().slice(-4)}`;
    const branchId = `b-${slug}-01`;

    const planConfig = plans[selectedPlan];

    const newTenant: Tenant = {
      id: tenantId,
      name: gymName,
      slug,
      country,
      currency,
      taxId: taxId || '20999888777',
      fiscalEngine: country === 'Perú' ? 'SUNAT_PERU' : country === 'Chile' ? 'SII_CHILE' : country === 'México' ? 'SAT_MEXICO' : 'STRIPE_GLOBAL',
      activeBranches: 1,
      totalMembers: 120,
      logo: '🏋️',
      phone: ownerPhone || '+51 987 654 321',
      adminName: ownerName || 'Administrador',
      adminEmail: ownerEmail,
      adminPassword: ownerPassword,
      primaryColor: '#059669',
      createdAt: new Date().toISOString().split('T')[0],
      saasSubscription: {
        plan: selectedPlan,
        planName: planConfig.name,
        monthlyPriceUsd: planConfig.price,
        status: 'ACTIVE',
        billingCycle: 'MONTHLY',
        nextBillingDate: '2026-09-24',
        maxBranches: planConfig.branches,
        maxMembers: planConfig.members,
        paymentMethod: 'Tarjeta de Crédito en suscripción'
      }
    };

    const newBranch: Branch = {
      id: branchId,
      tenantId: tenantId,
      name: branchName || 'Sede Principal',
      city: country === 'Perú' ? 'Lima' : country,
      address: branchAddress || 'Av. Principal 123',
      timezone: 'America/Lima',
      capacity: 250,
      activeCount: 45,
      status: 'OPEN'
    };

    onAddTenant(newTenant, newBranch);

    const loginUrl = `https://app.fitcore.com/login?tenant=${slug}`;
    const whatsappText = `¡Hola ${ownerName || 'amigo'}! 👋 Te damos la bienvenida a tu nueva plataforma FIT-CORE OS para *${gymName}*.\n\n🔑 *Tus credenciales de acceso:*\n🌐 URL: ${loginUrl}\n👤 Usuario: ${ownerEmail}\n🔒 Contraseña: ${ownerPassword}\n\nYa puedes empezar a registrar tus socios, horarios y configurar tus accesos. Cualquier duda estamos para ayudarte. 🚀`;

    setCreatedTenantResult({
      tenant: newTenant,
      loginUrl,
      whatsappText
    });

    // Reset form fields
    setGymName('');
    setTaxId('');
    setOwnerName('');
    setOwnerEmail('');
    setOwnerPhone('');
  };

  // Calculate SaaS Global Metrics
  const totalGyms = tenants.length;
  const totalMrr = tenants.reduce((acc, t) => acc + (t.saasSubscription?.monthlyPriceUsd || 149), 0);
  const totalManagedMembers = tenants.reduce((acc, t) => acc + t.totalMembers, 0);
  const totalBranches = tenants.reduce((acc, t) => acc + t.activeBranches, 0);

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Modelo de Negocio SaaS Multi-Tenant
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Cobro Mensual Recurrente (MRR)
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Portal SaaS: Cómo Desplegar y Vender a Gimnasios
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl mt-1">
              Aquí gestionas todos los gimnasios clientes que pagan tu mensualidad, das de alta nuevas cuentas con su código de acceso, y ves el plan de despliegue a GitHub y Vercel.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('NEW_ONBOARDING')}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              + Dar de Alta Nuevo Gimnasio
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => setActiveTab('HOW_TO_SELL')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'HOW_TO_SELL'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/60'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4 text-indigo-300" />
            1. Plan de Despliegue (GitHub ➔ Vercel ➔ Dominio)
          </button>

          <button
            onClick={() => setActiveTab('NEW_ONBOARDING')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'NEW_ONBOARDING'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            2. Dar de Alta Nuevo Gimnasio (Generar Accesos)
          </button>

          <button
            onClick={() => setActiveTab('CLIENTS_LIST')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'CLIENTS_LIST'
                ? 'bg-slate-700 text-white shadow-md shadow-slate-950/60'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 text-teal-300" />
            3. Mis Gimnasios Clientes ({tenants.length})
          </button>

          <button
            onClick={() => setActiveTab('ROI_CALCULATOR')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ROI_CALCULATOR'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950/60'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-300" />
            4. Calculadora de Ganancias SaaS
          </button>
        </div>
      </div>

      {/* TAB 1: HOW TO SELL & DEPLOY (STEP-BY-STEP EXPLANATION) */}
      {activeTab === 'HOW_TO_SELL' && (
        <div className="space-y-6">
          
          {/* Architecture Pipeline Visual */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-400" />
              ¿Cómo viaja tu aplicación desde aquí hasta las manos del dueño del gimnasio?
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Tu aplicación no necesita crearse una por una para cada cliente. Es un **sistema Multi-Tenant centralizado**: tú mantienes 1 solo servidor y cobras mensualidades recurrentes a cada gimnasio.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Step 1 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative group hover:border-indigo-500/50 transition-all">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-white">Exportar a GitHub</h3>
                  <p className="text-xs text-slate-400">
                    Sincronizas el código fuente en un repositorio privado de tu cuenta de GitHub.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center gap-1.5 text-[11px] text-indigo-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Listo en 1 clic
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative group hover:border-indigo-500/50 transition-all">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-white">Desplegar en Vercel</h3>
                  <p className="text-xs text-slate-400">
                    Conectas GitHub con Vercel o Cloud Run. Cada cambio que hagas se publica automáticamente en internet.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center gap-1.5 text-[11px] text-teal-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Hosting rápido y escalable
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative group hover:border-indigo-500/50 transition-all">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black text-sm">
                    3
                  </div>
                  <h3 className="text-sm font-bold text-white">Tu Dominio Propio</h3>
                  <p className="text-xs text-slate-400">
                    Le asignas tu marca: <code className="text-emerald-400 bg-emerald-950/50 px-1 rounded">app.tumarca.com</code>. Todos los gimnasios entran por esta misma URL.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  100% Tu Marca Blanca
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative group hover:border-indigo-500/50 transition-all">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-sm">
                    4
                  </div>
                  <h3 className="text-sm font-bold text-white">Dar Acceso al Gimnasio</h3>
                  <p className="text-xs text-slate-400">
                    Le creas su cuenta y contraseña. El gimnasio entra, ve solo sus socios y tú le cobras $99 a $299 USD cada mes.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Suscripción Recurrente
                </div>
              </div>

            </div>
          </div>

          {/* Three Key Questions Answered */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">
                ¿Cómo sabe el sistema qué gimnasio está entrando?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gracias al campo <strong className="text-slate-200">tenant_id</strong> y la seguridad RLS (Row-Level Security) en la base de datos PostgreSQL. Cuando el recepcionista o dueño inicia sesión con su correo, el sistema carga automáticamente únicamente los socios, cajas y clases de su gimnasio. Nadie puede ver la información de otro cliente.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">
                ¿A dónde va el dinero de las ventas del gimnasio?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                El dinero de las membresías que pagan los socios <strong className="text-slate-200">va directo a la cuenta bancaria del dueño del gimnasio</strong> mediante sus llaves de Culqi, Niubiz o Yape. Tú no tocas su dinero de cobros diarios; tú solo le cobras al dueño la tarifa fija mensual por el uso del software ($99 - $299 USD).
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">
                ¿Qué pasa si un gimnasio no me paga la mensualidad?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Desde la pestaña <strong className="text-slate-200">"Mis Gimnasios Clientes"</strong>, con un solo clic puedes cambiar el estado del gimnasio a <span className="text-rose-400 font-bold">"Suspendido"</span>. Al intentar entrar, el sistema le mostrará un aviso de pago pendiente y bloqueará los accesos a torniquetes hasta que regularice su cuota mensual.
              </p>
            </div>

          </div>

          {/* Quick Action to Onboard */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white">¿Tienes un gimnasio interesado en contratarte?</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Pasa a la siguiente pestaña para registrarlo, generarle su usuario y entregarle su link de acceso de inmediato.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('NEW_ONBOARDING')}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer shrink-0"
            >
              Registrar Nuevo Gimnasio Ahora ➔
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: REGISTER NEW GYM / ONBOARDING WIZARD */}
      {activeTab === 'NEW_ONBOARDING' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Registration Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Dar de Alta a un Nuevo Gimnasio Cliente</h2>
                <p className="text-xs text-slate-400">
                  Completa los datos para crear su cuenta aislada en tu plataforma SaaS.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateGym} className="space-y-4">
              
              {/* Gym Name & Tax ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre del Gimnasio / Estudio *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sparta Fitness Center"
                    value={gymName}
                    onChange={(e) => setGymName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    RUC / RFC / Tax ID
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 20609876543"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Country & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    País
                  </label>
                  <select
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      if (e.target.value === 'Perú') setCurrency('PEN');
                      else if (e.target.value === 'Chile') setCurrency('CLP');
                      else if (e.target.value === 'México') setCurrency('MXN');
                      else setCurrency('USD');
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Perú">Perú (Facturación SUNAT / Yape)</option>
                    <option value="México">México (SAT / Conekta)</option>
                    <option value="Chile">Chile (SII / Webpay)</option>
                    <option value="Colombia">Colombia (DIAN / Wompi)</option>
                    <option value="USA">Estados Unidos / Global (Stripe)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Moneda de Cobro a Socios
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="PEN">PEN (Soles - S/.)</option>
                    <option value="USD">USD (Dólares - $)</option>
                    <option value="MXN">MXN (Pesos Mexicanos - $)</option>
                    <option value="CLP">CLP (Pesos Chilenos - $)</option>
                  </select>
                </div>
              </div>

              {/* Initial Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre de Sede Inicial
                  </label>
                  <input
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Dirección de la Sede
                  </label>
                  <input
                    type="text"
                    value={branchAddress}
                    onChange={(e) => setBranchAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* SaaS Plan Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Plan SaaS Contratado (Monto que te pagará cada mes):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Boutique */}
                  <div
                    onClick={() => setSelectedPlan('BOUTIQUE_STUDIO')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedPlan === 'BOUTIQUE_STUDIO'
                        ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-950'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-white">Boutique</span>
                      <span className="text-xs font-black text-indigo-400">$99/mes</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      1 Sede • Spinning/Pilates • Reservas visuales
                    </p>
                  </div>

                  {/* Gym Pro */}
                  <div
                    onClick={() => setSelectedPlan('GYM_PRO')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedPlan === 'GYM_PRO'
                        ? 'bg-emerald-950/60 border-emerald-500 shadow-md shadow-emerald-950'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-white">Gym Pro</span>
                      <span className="text-xs font-black text-emerald-400">$149/mes</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      Hasta 3 Sedes • Torniquetes IoT + SUNAT + WhatsApp
                    </p>
                  </div>

                  {/* Enterprise */}
                  <div
                    onClick={() => setSelectedPlan('ENTERPRISE_CHAIN')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedPlan === 'ENTERPRISE_CHAIN'
                        ? 'bg-amber-950/60 border-amber-500 shadow-md shadow-amber-950'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-white">Enterprise</span>
                      <span className="text-xs font-black text-amber-400">$299/mes</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      Multisede (10+) • InBody • Base de datos aislada
                    </p>
                  </div>

                </div>
              </div>

              {/* Owner Account Details */}
              <div className="pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Credenciales de Acceso para el Dueño / Administrador
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nombre del Dueño</label>
                    <input
                      type="text"
                      placeholder="Ej. Roberto Díaz"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Correo (Usuario de Login) *</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@spartafitness.com"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+51 987 111 222"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <label className="block text-[11px] text-slate-400 mb-1">Contraseña Inicial Temporal</label>
                  <input
                    type="text"
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer mt-4 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Crear Gimnasio & Generar Ficha de Acceso
              </button>

            </form>
          </div>

          {/* Right: Generated Result & Welcome WhatsApp Dispatcher */}
          <div className="lg:col-span-5 space-y-4">
            
            {createdTenantResult ? (
              <div className="bg-slate-900 border border-emerald-500/60 rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <h3 className="font-bold text-base text-white">¡Gimnasio Creado con Éxito!</h3>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gimnasio:</span>
                    <span className="font-bold text-white">{createdTenantResult.tenant.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ID de Inquilino (Tenant):</span>
                    <span className="font-mono text-emerald-400">{createdTenantResult.tenant.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Plan Asignado:</span>
                    <span className="font-bold text-white">{createdTenantResult.tenant.saasSubscription?.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cuota Mensual:</span>
                    <span className="font-extrabold text-emerald-400">${createdTenantResult.tenant.saasSubscription?.monthlyPriceUsd} USD/mes</span>
                  </div>
                </div>

                {/* Direct Switch to this Tenant */}
                <button
                  onClick={() => onSelectTenant(createdTenantResult.tenant)}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Entrar ahora al Panel de {createdTenantResult.tenant.name} ➔
                </button>

                {/* WhatsApp Welcome Message Box */}
                <div className="bg-emerald-950/30 border border-emerald-600/30 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5" />
                      Mensaje de Bienvenida para el Cliente:
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(createdTenantResult.whatsappText);
                        setCopiedMessage(true);
                        setTimeout(() => setCopiedMessage(false), 2000);
                      }}
                      className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedMessage ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedMessage ? 'Copiado!' : 'Copiar Texto'}
                    </button>
                  </div>
                  <pre className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                    {createdTenantResult.whatsappText}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Generador de Accesos Automático</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Al completar el formulario de la izquierda, el sistema generará de inmediato las credenciales de inicio de sesión y el mensaje de WhatsApp para tu cliente.
                  </p>
                </div>
                
                <div className="border-t border-slate-800 pt-4 text-left space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Aislamiento 100% independiente de datos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Conexión inmediata a torniquetes y SUNAT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Panel de recepción y app de alumnos activa</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Demo Credentials */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400">
              <span className="font-bold text-slate-300 block mb-1">Gimnasios Demo Ya Activos en tu Sistema:</span>
              <div className="space-y-1.5 mt-2">
                {tenants.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => onSelectTenant(t)}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition-all"
                  >
                    <div>
                      <span className="font-semibold text-white">{t.name}</span>
                      <span className="text-[10px] text-slate-500 block">{t.adminEmail || 'admin@' + t.slug + '.com'}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono">
                      {t.saasSubscription?.monthlyPriceUsd ? `$${t.saasSubscription.monthlyPriceUsd}/m` : '$149/m'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: CLIENTS LIST & MRR MANAGEMENT */}
      {activeTab === 'CLIENTS_LIST' && (
        <div className="space-y-6">
          
          {/* SaaS Business Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
                <span>Gimnasios Clientes</span>
                <Building2 className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">{totalGyms}</div>
              <span className="text-[11px] text-emerald-400 font-semibold">+100% retención</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
                <span>MRR Mensual Recurrente</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">${totalMrr.toLocaleString()} USD</div>
              <span className="text-[11px] text-slate-400 font-medium">ARR Proyectado: ${(totalMrr * 12).toLocaleString()} USD</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
                <span>Sedes Operativas Conectadas</span>
                <Store className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl font-black text-white">{totalBranches}</div>
              <span className="text-[11px] text-teal-400 font-semibold">Torniquetes online</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
                <span>Alumnos Gestionados</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">{totalManagedMembers.toLocaleString()}</div>
              <span className="text-[11px] text-slate-400 font-medium">QRs dinámicos activos</span>
            </div>

          </div>

          {/* Tenants Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white text-base">Directorio de Gimnasios Suscritos</h3>
                <p className="text-xs text-slate-400">
                  Control de licencias, facturación SaaS y acceso a la cuenta de cada cliente.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('NEW_ONBOARDING')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
              >
                + Nuevo Cliente
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Gimnasio & Administrador</th>
                    <th className="pb-3 font-semibold">País / Moneda</th>
                    <th className="pb-3 font-semibold">Plan Contratado</th>
                    <th className="pb-3 font-semibold">Cuota SaaS</th>
                    <th className="pb-3 font-semibold">Sedes / Socios</th>
                    <th className="pb-3 font-semibold">Estado Licencia</th>
                    <th className="pb-3 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {tenants.map((t) => {
                    const isSelected = currentTenant.id === t.id;
                    const subStatus = t.saasSubscription?.status || 'ACTIVE';
                    return (
                      <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 pr-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{t.logo || '🏋️'}</span>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                {t.name}
                                {isSelected && (
                                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    Viendo Ahora
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400">
                                👤 {t.adminName || 'Admin'} • {t.adminEmail || 'admin@' + t.slug + '.com'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 pr-3">
                          <span className="font-semibold text-white">{t.country}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{t.currency} • {t.taxId}</span>
                        </td>

                        <td className="py-3.5 pr-3">
                          <span className="font-bold text-slate-200">
                            {t.saasSubscription?.planName || 'Gym Pro ($149)'}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            Próx. Cobro: {t.saasSubscription?.nextBillingDate || '2026-09-01'}
                          </span>
                        </td>

                        <td className="py-3.5 pr-3 font-black text-emerald-400 text-sm">
                          ${t.saasSubscription?.monthlyPriceUsd || 149} <span className="text-[10px] text-slate-400 font-normal">/mes</span>
                        </td>

                        <td className="py-3.5 pr-3">
                          <span className="font-semibold text-white">{t.activeBranches} sedes</span>
                          <span className="text-[10px] text-slate-400 block">{t.totalMembers} socios</span>
                        </td>

                        <td className="py-3.5 pr-3">
                          {subStatus === 'ACTIVE' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Al Día (Activo)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              <AlertCircle className="w-3 h-3" />
                              Suspendido (Impago)
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 text-right space-x-2">
                          <button
                            onClick={() => onSelectTenant(t)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[11px] transition-all cursor-pointer"
                          >
                            Entrar a su Panel
                          </button>
                          
                          {subStatus === 'ACTIVE' ? (
                            <button
                              onClick={() => onUpdateTenantStatus(t.id, 'PAST_DUE')}
                              title="Simular bloqueo por falta de pago de suscripción"
                              className="px-2 py-1 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 rounded-lg text-[10px] transition-all cursor-pointer"
                            >
                              Suspender
                            </button>
                          ) : (
                            <button
                              onClick={() => onUpdateTenantStatus(t.id, 'ACTIVE')}
                              className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[10px] transition-all cursor-pointer"
                            >
                              Reactivar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* TAB 4: ROI CALCULATOR */}
      {activeTab === 'ROI_CALCULATOR' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Calculadora de Ganancias: ¿Cuánto dinero puedes generar vendiendo este software?
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Simula tus ingresos mensuales recurrentes (MRR) en función del número de gimnasios que consigas como clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            
            {/* Sliders */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-6">
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300">
                    Número de Gimnasios Clientes:
                  </label>
                  <span className="text-lg font-black text-amber-400">{clientCount} gimnasios</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={clientCount}
                  onChange={(e) => setClientCount(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>1 gym</span>
                  <span>50 gyms</span>
                  <span>100 gyms</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300">
                    Precio Promedio Cobrado por Gimnasio:
                  </label>
                  <span className="text-lg font-black text-emerald-400">${avgPrice} USD/mes</span>
                </div>
                <input
                  type="range"
                  min={49}
                  max={299}
                  step={10}
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>$49 (Básico)</span>
                  <span>$149 (Gym Pro)</span>
                  <span>$299 (Enterprise)</span>
                </div>
              </div>

            </div>

            {/* Results Card */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/40 rounded-xl p-6 text-center space-y-4 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Tu Facturación SaaS Proyectada
              </span>
              
              <div className="space-y-1">
                <div className="text-4xl font-black text-white tracking-tight">
                  ${(clientCount * avgPrice).toLocaleString()} <span className="text-sm font-semibold text-slate-400">USD / mes</span>
                </div>
                <div className="text-sm font-bold text-emerald-400">
                  ≈ ${(clientCount * avgPrice * 12).toLocaleString()} USD al año (ARR)
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 text-xs text-slate-400 space-y-2 text-left">
                <div className="flex justify-between">
                  <span>Costo de Servidor (Vercel + Neon DB):</span>
                  <span className="text-slate-200 font-mono">~$20 - $50 USD / mes</span>
                </div>
                <div className="flex justify-between">
                  <span>Margen de Ganancia Neto:</span>
                  <span className="text-emerald-400 font-bold font-mono">&gt; 95%</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('NEW_ONBOARDING')}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                Empezar Registrando tu Primer Gimnasio ➔
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
