import React from 'react';
import {
  Database,
  Server,
  Zap,
  Receipt,
  ScanLine,
  CalendarCheck,
  Dumbbell,
  MessageSquare,
  BarChart3,
  Code2,
  Lock,
  Cpu,
  Layers,
  Sparkles,
  Rocket
} from 'lucide-react';
import { ActiveModule, Currency } from '../types';

export type ActiveTab = ActiveModule;

interface SidebarProps {
  activeModule?: ActiveModule;
  onSelectModule?: (module: ActiveModule) => void;
  activeTab?: ActiveModule;
  onSelectTab?: (tab: ActiveModule) => void;
  currency?: Currency;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  activeTab,
  onSelectTab,
  currency
}) => {
  const currentActive = activeModule || activeTab || 'SAAS_SUPERADMIN';

  const handleSelect = (mod: ActiveModule) => {
    if (onSelectModule) onSelectModule(mod);
    if (onSelectTab) onSelectTab(mod);
  };

  const saasAdminNav = [
    {
      id: 'SAAS_SUPERADMIN' as ActiveModule,
      label: 'Portal SaaS: Vender & Desplegar',
      badge: 'GitHub ➔ Vercel',
      icon: Rocket,
      desc: 'Alta de clientes, accesos y cobro MRR'
    }
  ];

  const architectureNav = [
    {
      id: 'ERD_SCHEMA' as ActiveModule,
      label: '1. Modelo ERD & DBML Schema',
      badge: 'SQL / RLS',
      icon: Database,
      desc: 'Tablas core, índices, DBML y RLS'
    },
    {
      id: 'NESTJS_MICROSERVICES' as ActiveModule,
      label: '2. Arquitectura NestJS & Microservicios',
      badge: 'Clean Arch',
      icon: Server,
      desc: 'Controladores, DTOs y Kafka'
    },
    {
      id: 'OVERBOOKING_CONCURRENCY' as ActiveModule,
      label: '3. Motor Anti-Overbooking (50 Req)',
      badge: 'Redis Lua',
      icon: Zap,
      desc: 'Bloqueos atómicos y colas FIFO'
    },
    {
      id: 'SUNAT_PAYMENTS' as ActiveModule,
      label: '4. Facturación SUNAT & Culqi/Niubiz',
      badge: 'UBL 2.1 / Yape',
      icon: Receipt,
      desc: 'XML UBL, CDR, QR dinámico'
    }
  ];

  const operationsNav = [
    {
      id: 'ACCESS_CONTROL' as ActiveModule,
      label: '5. Control de Accesos & IoT Gate',
      badge: '<150ms',
      icon: ScanLine,
      desc: 'QR Dinámico 15s, ZKTeco Face & RFID'
    },
    {
      id: 'BOUTIQUE_BOOKING' as ActiveModule,
      label: '6. Reserva Visual Boutique (Spots)',
      badge: 'Bikes / Pilates',
      icon: CalendarCheck,
      desc: 'Mapeo de sala y waitlist auto'
    },
    {
      id: 'TRAINING_BIOMETRICS' as ActiveModule,
      label: '7. WOD, Rutinas & InBody Bio',
      badge: 'Virtuagym Engine',
      icon: Dumbbell,
      desc: '3D Exercises, Leaderboard, Grasa/Músculo'
    },
    {
      id: 'WHATSAPP_CRM' as ActiveModule,
      label: '8. WhatsApp Bot & CRM Leads',
      badge: 'Cloud API',
      icon: MessageSquare,
      desc: 'Cobranza preventiva, QR y Churn bot'
    },
    {
      id: 'FINANCIAL_BI' as ActiveModule,
      label: '9. Finanzas, POS & Heatmap BI',
      badge: 'MRR / Churn',
      icon: BarChart3,
      desc: 'Métricas SaaS y caja rápida'
    }
  ];

  return (
    <aside className="w-full md:w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-full rounded-2xl md:min-h-[calc(100vh-6rem)] p-3 select-none">
      
      {/* SECTION 0: SAAS OWNER & CLIENT ONBOARDING */}
      <div className="mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 mb-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-400">
            Tu Negocio SaaS (Dueño)
          </span>
        </div>

        <div className="space-y-1">
          {saasAdminNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentActive === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id.toLowerCase()}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-950/90 via-slate-800 to-slate-800 text-white border border-amber-500/50 shadow-md shadow-amber-950/60'
                    : 'bg-slate-950/60 border border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isActive ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold truncate ${isActive ? 'text-amber-300' : 'text-slate-100'}`}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                    <span className="ml-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-700/50 shrink-0">
                      {item.badge}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: TECHNICAL ARCHITECTURE & CTO SPECS */}
      <div className="mb-5">
        <div className="flex items-center gap-2 px-3 py-1.5 mb-1.5">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-400">
            Arquitectura Técnica (CTO)
          </span>
        </div>

        <div className="space-y-1">
          {architectureNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentActive === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id.toLowerCase()}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-950/80 to-slate-800 text-white border border-emerald-500/40 shadow-sm shadow-emerald-950/50'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold truncate ${isActive ? 'text-emerald-300 font-bold' : 'text-slate-200'}`}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                    <span className="ml-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 border border-emerald-900/50 shrink-0">
                      {item.badge}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: OPERATIONAL SAAS MODULES */}
      <div>
        <div className="flex items-center gap-2 px-3 py-1.5 mb-1.5">
          <Layers className="w-4 h-4 text-teal-400" />
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-teal-400">
            Módulos Operativos SaaS
          </span>
        </div>

        <div className="space-y-1">
          {operationsNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentActive === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id.toLowerCase()}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-950/80 to-slate-800 text-white border border-teal-500/40 shadow-sm shadow-teal-950/50'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isActive ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold truncate ${isActive ? 'text-teal-300 font-bold' : 'text-slate-200'}`}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                    <span className="ml-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-teal-400 border border-teal-900/50 shrink-0">
                      {item.badge}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="mt-auto pt-4 border-t border-slate-800/80 px-2">
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold mb-1">
            <span>Stack de Alto Rendimiento</span>
            <span className="text-emerald-400">AWS + RDS</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            NestJS CQRS • Redis Lua • PostgreSQL RLS • SUNAT UBL 2.1 • Kafka Event Bus
          </p>
        </div>
      </div>

    </aside>
  );
};
