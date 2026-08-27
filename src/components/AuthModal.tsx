import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  KeyRound,
  User
} from 'lucide-react';
import { Tenant, Role } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenants: Tenant[];
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  onSelectRole: (role: Role) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  tenants,
  currentTenant,
  onSelectTenant,
  onSelectRole
}) => {
  const [selectedTenantId, setSelectedTenantId] = useState(currentTenant.id);
  const [email, setEmail] = useState(currentTenant.adminEmail || 'admin@' + currentTenant.slug + '.com');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<Role>('FranchiseOwner');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const targetTenant = tenants.find(t => t.id === selectedTenantId) || currentTenant;
    onSelectTenant(targetTenant);
    onSelectRole(role);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  const handleQuickSelectTenant = (t: Tenant) => {
    setSelectedTenantId(t.id);
    setEmail(t.adminEmail || `admin@${t.slug}.com`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black shadow-lg">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Simulador de Login Multi-Tenant</h2>
            <p className="text-xs text-slate-400">
              Así es como entran los dueños y recepcionistas a su cuenta privada.
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">¡Sesión Iniciada con Éxito!</h3>
            <p className="text-xs text-slate-300">
              Cargando entorno seguro para <strong className="text-emerald-400">{tenants.find(t => t.id === selectedTenantId)?.name}</strong>...
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Tenant Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                Gimnasio Cliente (Tenant):
              </label>
              <select
                value={selectedTenantId}
                onChange={(e) => {
                  const t = tenants.find(item => item.id === e.target.value);
                  if (t) handleQuickSelectTenant(t);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {tenants.map(t => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                    {t.name} ({t.country} - {t.currency})
                  </option>
                ))}
              </select>
            </div>

            {/* Email & Password */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Correo de Usuario:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  Contraseña:
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Role Switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Rol a Simular:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('FranchiseOwner')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    role === 'FranchiseOwner'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  👑 Dueño de Gimnasio
                </button>

                <button
                  type="button"
                  onClick={() => setRole('Receptionist')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    role === 'Receptionist'
                      ? 'bg-teal-950 border-teal-500 text-teal-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  💳 Recepcionista / POS
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <span>Ingresar al Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
