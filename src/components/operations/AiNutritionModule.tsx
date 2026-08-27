import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  ExternalLink, 
  Copy, 
  Check, 
  Smartphone, 
  Monitor, 
  Tablet, 
  RefreshCw, 
  MessageSquare, 
  Users, 
  Target, 
  Zap,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserMember } from '../../types';

interface AiNutritionModuleProps {
  members: UserMember[];
}

export const AiNutritionModule: React.FC<AiNutritionModuleProps> = ({ members }) => {
  const [selectedMember, setSelectedMember] = useState<UserMember>(members[0] || {
    id: 'mem-01',
    tenantId: 't-peru',
    branchId: 'b-peru-01',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    docType: 'DNI',
    docNumber: '45892134',
    email: 'carlos.mendoza@email.com',
    phone: '+51 987 654 321',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'ACTIVE',
    membershipPlan: 'Plan Black Anual',
    membershipExpiresAt: '2026-12-31',
    outstandingBalance: 0,
    qrSeed: 'seed-carlos',
    emergencyContact: '+51 988 111 222'
  });

  const [deviceView, setDeviceView] = useState<'MOBILE' | 'TABLET' | 'FULL'>('MOBILE');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [lastSentMemberName, setLastSentMemberName] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(1);

  // Helper to build unique student activation URL
  const buildPlanUrl = (member: UserMember) => {
    const studentName = `${member.firstName} ${member.lastName}`.trim();
    const studentDni = member.docNumber || '45892134';
    return `https://www.bienestarsinexcusas.site/?socio=fitcore&partner=FITCORE_POWERSTUDIO&dni=${studentDni}&nombre=${encodeURIComponent(studentName)}`;
  };

  // Helper to build WhatsApp Message text
  const buildWhatsappMessage = (member: UserMember) => {
    const studentName = `${member.firstName} ${member.lastName}`.trim();
    const urlPlan = buildPlanUrl(member);
    return `¡Hola ${studentName}! 💪 Bienvenido a FitCore PowerStudio.\n\nTu membresía incluye tu App Oficial de Nutrición y Entrenamiento con Inteligencia Artificial.\n\n📲 Toca aquí para completar tu ficha y activar tu plan de 28 días:\n${urlPlan}\n\n¡Nos vemos en el entrenamiento! 🔥`;
  };

  const currentUrlPlan = buildPlanUrl(selectedMember);
  const currentWhatsappMessage = buildWhatsappMessage(selectedMember);

  const handleSendWhatsapp = (member: UserMember) => {
    const message = buildWhatsappMessage(member);
    const cleanPhone = member.phone.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    setLastSentMemberName(`${member.firstName} ${member.lastName}`);
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    window.open(waUrl, '_blank');
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrlPlan);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(currentWhatsappMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/70 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Alianza Oficial FitCore & Bienestar Sin Excusas
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                Plan de 28 Días con IA
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>🥗 Nutrición con IA & Entrenamiento Personalizado</span>
            </h1>
            
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Activa a tus alumnos en la plataforma de Nutrición IA de <strong>Bienestar Sin Excusas</strong>. Cada alumno recibe un plan de 28 días calculado a su medida según su composición corporal, meta física y hábitos diarios.
            </p>
          </div>

          {/* QUICK CTA BUTTON */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => handleSendWhatsapp(selectedMember)}
              className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg shadow-emerald-950/60 transition-all cursor-pointer text-sm"
            >
              <MessageSquare className="w-4 h-4 text-slate-950" />
              <span>📲 Enviar App de Nutrición IA por WhatsApp</span>
            </button>

            <a
              href={currentUrlPlan}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-3 rounded-xl border border-slate-700 transition-all text-xs"
            >
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              <span>Abrir App Externa</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4 BENEFIT PILLARS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-emerald-500/40 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Plan Hiper-Personalizado</h4>
          <p className="text-[11px] text-slate-400 leading-normal">
            Cálculo de macros exactos (proteínas, grasas, carbohidratos) según déficit, superávit o mantenimiento.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-teal-500/40 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Coach IA 24/7 en WhatsApp</h4>
          <p className="text-[11px] text-slate-400 leading-normal">
            Respuestas inmediatas a dudas sobre qué comer antes o después de entrenar y recetas saludables.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-blue-500/40 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">+42% Retención de Alumnos</h4>
          <p className="text-[11px] text-slate-400 leading-normal">
            Los alumnos que siguen una guía nutricional obtienen resultados 3x más rápido y no cancelan su membresía.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-amber-500/40 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Activación en 1 Clic</h4>
          <p className="text-[11px] text-slate-400 leading-normal">
            Enlace único pre-configurado con DNI y nombre del alumno sin registros tediosos ni contraseñas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: MEMBER SELECTOR & WHATSAPP DISPATCHER (5 COLS) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* DISPATCH CONTROLLER CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                Ficha del Alumno & Disparador WhatsApp
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                WhatsApp Ready
              </span>
            </div>

            {/* SELECT MEMBER */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Seleccionar Alumno de FitCore:
              </label>
              <select
                id="select-member-nutrition"
                value={selectedMember.id}
                onChange={(e) => {
                  const m = members.find((item) => item.id === e.target.value);
                  if (m) setSelectedMember(m);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} — DNI: {m.docNumber || '45892134'} ({m.membershipPlan})
                  </option>
                ))}
              </select>
            </div>

            {/* SELECTED MEMBER SUMMARY BOX */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMember.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={selectedMember.firstName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    DNI: <span className="font-mono text-slate-300">{selectedMember.docNumber || '45892134'}</span> • Tel: <span className="font-mono text-emerald-400">{selectedMember.phone}</span>
                  </p>
                  <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/40">
                    {selectedMember.membershipPlan}
                  </span>
                </div>
              </div>
            </div>

            {/* GENERATED UNIQUE ACTIVATION LINK */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Enlace Único de Activación:</span>
                <button
                  onClick={handleCopyUrl}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedUrl ? '¡Copiado!' : 'Copiar Enlace'}
                </button>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-[11px] font-mono text-emerald-300/90 break-all select-all">
                {currentUrlPlan}
              </div>
            </div>

            {/* WHATSAPP MESSAGE PREVIEW */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Mensaje de WhatsApp a Enviar:</span>
                <button
                  onClick={handleCopyMessage}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedMessage ? '¡Copiado!' : 'Copiar Texto'}
                </button>
              </div>
              <div className="bg-[#0b141a] border border-emerald-900/40 rounded-xl p-3 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans shadow-inner">
                <div className="text-[10px] text-emerald-400 font-mono mb-1 pb-1 border-b border-emerald-800/30 flex items-center justify-between">
                  <span>De: FitCore PowerStudio</span>
                  <span>A: {selectedMember.phone}</span>
                </div>
                {currentWhatsappMessage}
              </div>
            </div>

            {/* MAIN SEND BUTTON */}
            <button
              id="btn-send-nutrition-wa-main"
              onClick={() => handleSendWhatsapp(selectedMember)}
              className="w-full flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-950/60 transition-all cursor-pointer text-xs uppercase tracking-wider"
            >
              <Send className="w-4 h-4" />
              <span>📲 Enviar App de Nutrición IA por WhatsApp</span>
            </button>

            {lastSentMemberName && (
              <div className="bg-emerald-950/50 border border-emerald-600/40 rounded-xl p-2.5 text-center text-xs text-emerald-300 font-medium">
                ✅ WhatsApp abierto exitosamente para <strong>{lastSentMemberName}</strong>.
              </div>
            )}

          </div>

          {/* ALL STUDENTS TABLE WITH INSTANT SEND BUTTON */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Envío Rápido a Socios del Gimnasio
            </h3>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={member.firstName}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">
                        {member.firstName} {member.lastName}
                      </h5>
                      <p className="text-[10px] text-slate-400 truncate">
                        DNI: {member.docNumber || '45892134'} • {member.membershipPlan}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      handleSendWhatsapp(member);
                    }}
                    title="Enviar App de Nutrición IA por WhatsApp"
                    className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Enviar IA</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE EMBEDDED IFRAME VIEWER (7 COLS) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col">
          
          {/* VIEWER CONTROLS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Visor en Vivo: App de Nutrición IA (Bienestar Sin Excusas)
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Así es exactamente como tus alumnos interactúan con su plan de 28 días.
              </p>
            </div>

            {/* DEVICE CONTROLS & REFRESH */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setDeviceView('MOBILE')}
                  title="Vista Móvil (iPhone/Android)"
                  className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                    deviceView === 'MOBILE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceView('TABLET')}
                  title="Vista Tablet"
                  className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                    deviceView === 'TABLET' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceView('FULL')}
                  title="Vista Pantalla Completa"
                  className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                    deviceView === 'FULL' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setIframeKey(k => k + 1)}
                title="Recargar visor"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <a
                href={currentUrlPlan}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir en pestaña nueva"
                className="p-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg border border-emerald-500/30 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* IFRAME CONTAINER / SIMULATOR CONTAINER */}
          <div className="flex-1 min-h-[580px] bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
            <div
              className={`transition-all duration-300 h-full w-full flex flex-col items-center justify-center ${
                deviceView === 'MOBILE'
                  ? 'max-w-[400px] border-4 border-slate-800 rounded-[32px] overflow-hidden shadow-2xl bg-black p-1'
                  : deviceView === 'TABLET'
                  ? 'max-w-[650px] border-4 border-slate-800 rounded-2xl overflow-hidden shadow-2xl bg-black p-1'
                  : 'w-full rounded-lg overflow-hidden'
              }`}
            >
              {/* MOBILE TOP SPEAKER NOTCH */}
              {deviceView === 'MOBILE' && (
                <div className="w-full flex justify-center py-1 bg-black">
                  <div className="w-20 h-3.5 bg-slate-900 rounded-full" />
                </div>
              )}

              <iframe
                key={iframeKey}
                src={currentUrlPlan}
                title="Bienestar Sin Excusas - Nutrición IA"
                className="w-full h-[540px] sm:h-[580px] rounded-lg border-0 bg-white"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            </div>
          </div>

          {/* IFRAME FOOTER NOTICE */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 px-2 pt-1 gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Conectado en vivo a <strong>bienestarsinexcusas.site</strong></span>
            </div>
            <a
              href={currentUrlPlan}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>Abrir app en pantalla completa</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
