import React from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Wifi, 
  Clock, 
  Layers, 
  Sparkles,
  ChevronDown,
  Lock,
  PlusCircle,
  Rocket
} from 'lucide-react';
import { Tenant, Branch, Role } from '../types';

interface NavbarProps {
  tenants: Tenant[];
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  branches: Branch[];
  currentBranch: Branch;
  onSelectBranch: (branch: Branch) => void;
  currentRole?: Role;
  onSelectRole?: (role: Role) => void;
  iotGatewayHealthy?: boolean;
  onOpenLoginModal?: () => void;
  onGoToOnboarding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  tenants,
  currentTenant,
  onSelectTenant,
  branches,
  currentBranch,
  onSelectBranch,
  currentRole = 'FranchiseOwner',
  onSelectRole = (_role: Role) => {},
  iotGatewayHealthy = true,
  onOpenLoginModal,
  onGoToOnboarding
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Architecture Subtitle */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onGoToOnboarding}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-xl font-black shadow-lg shadow-emerald-900/30">
            FC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                FIT-CORE <span className="text-emerald-400 font-black">OS</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                v2.6 SaaS Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Plataforma Multi-Tenant para Gimnasios
            </p>
          </div>
        </div>

        {/* Multi-Tenant Switcher + Branch Selector */}
        <div className="hidden md:flex items-center gap-3">
          {/* Tenant Selector */}
          <div className="relative flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-inner">
            <Building2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Gimnasio Cliente (Tenant)</span>
              <select
                id="tenant-switcher-select"
                value={currentTenant.id}
                onChange={(e) => {
                  const t = tenants.find((item) => item.id === e.target.value);
                  if (t) onSelectTenant(t);
                }}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-4"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                    {t.name} ({t.currency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Branch Selector */}
          <div className="relative flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-inner">
            <MapPin className="w-4 h-4 text-teal-400 mr-2 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Sede Operativa</span>
              <select
                id="branch-switcher-select"
                value={currentBranch.id}
                onChange={(e) => {
                  const b = branches.find((item) => item.id === e.target.value);
                  if (b) onSelectBranch(b);
                }}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-4"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Actions: Login Simulator & Persona Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Onboarding Button */}
          {onGoToOnboarding && (
            <button
              onClick={onGoToOnboarding}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 rounded-lg text-amber-300 text-xs font-bold transition-all cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Vender / + Gimnasio</span>
            </button>
          )}

          {/* Login Modal Opener */}
          {onOpenLoginModal && (
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Simular Login</span>
            </button>
          )}

          {/* RBAC Role Selector */}
          <div className="flex items-center bg-emerald-950/40 border border-emerald-600/40 rounded-lg px-2.5 py-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1.5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-emerald-400/80 font-bold">Rol RBAC</span>
              <select
                id="role-simulator-select"
                value={currentRole}
                onChange={(e) => onSelectRole(e.target.value as Role)}
                className="bg-transparent text-xs font-bold text-emerald-300 focus:outline-none cursor-pointer"
              >
                <option value="SuperAdmin" className="bg-slate-900 text-white">CTO / SuperAdmin</option>
                <option value="FranchiseOwner" className="bg-slate-900 text-white">Dueño de Franquicia</option>
                <option value="BranchManager" className="bg-slate-900 text-white">Admin de Sede</option>
                <option value="Receptionist" className="bg-slate-900 text-white">Recepcionista (POS)</option>
                <option value="Coach" className="bg-slate-900 text-white">Entrenador</option>
                <option value="Member" className="bg-slate-900 text-white">Socio (App)</option>
              </select>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
