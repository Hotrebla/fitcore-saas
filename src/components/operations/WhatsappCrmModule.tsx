import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCheck, 
  Smartphone, 
  Bot, 
  Sparkles, 
  Users, 
  CreditCard, 
  Clock, 
  UserPlus, 
  CheckCircle2, 
  QrCode,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WhatsAppMessage, UserMember } from '../../types';
import { SAMPLE_WHATSAPP_MESSAGES } from '../../data/sampleData';

interface WhatsappCrmProps {
  members: UserMember[];
}

interface LeadCard {
  id: string;
  name: string;
  phone: string;
  source: 'Instagram Ads' | 'TikTok' | 'Referido' | 'Pase Web';
  stage: 'NUEVO_LEAD' | 'CLASE_PRUEBA' | 'ASISTIO' | 'CONVERTIDO';
  assignedCoach: string;
  potentialValuePen: number;
}

const INITIAL_LEADS: LeadCard[] = [
  { id: 'lead-1', name: 'Alonso Gutierrez', phone: '+51 981 123 456', source: 'Instagram Ads', stage: 'NUEVO_LEAD', assignedCoach: 'Diego S.', potentialValuePen: 199.00 },
  { id: 'lead-2', name: 'Daniela Paredes', phone: '+51 977 445 667', source: 'TikTok', stage: 'CLASE_PRUEBA', assignedCoach: 'Camila Z.', potentialValuePen: 350.00 },
  { id: 'lead-3', name: 'Sebastian Ruiz', phone: '+51 966 889 001', source: 'Referido', stage: 'ASISTIO', assignedCoach: 'Rodrigo B.', potentialValuePen: 1800.00 },
  { id: 'lead-4', name: 'Carla Montes', phone: '+51 955 223 119', source: 'Pase Web', stage: 'CONVERTIDO', assignedCoach: 'Diego S.', potentialValuePen: 199.00 },
];

export const WhatsappCrmModule: React.FC<WhatsappCrmProps> = ({ members }) => {
  const [activeTab, setActiveTab] = useState<'WHATSAPP_BOT' | 'KANBAN_PIPELINE'>('WHATSAPP_BOT');
  const [messages, setMessages] = useState<WhatsAppMessage[]>(SAMPLE_WHATSAPP_MESSAGES);
  const [selectedMember, setSelectedMember] = useState<UserMember>(members[0]);
  const [templateType, setTemplateType] = useState<'WELCOME' | 'DEBT_REMINDER' | 'INACTIVE_14D' | 'QR_PASS'>('DEBT_REMINDER');
  const [leads, setLeads] = useState<LeadCard[]>(INITIAL_LEADS);
  const [isSending, setIsSending] = useState(false);

  const handleSendAutomatedMessage = () => {
    setIsSending(true);

    let content = '';
    let type: WhatsAppMessage['type'] = 'PAYMENT_REMINDER';
    let actions: string[] = [];

    if (templateType === 'WELCOME') {
      type = 'WELCOME_CREDENTIAL';
      content = `¡Hola ${selectedMember.firstName}! 🏋️‍♂️ Bienvenido a FIT-CORE. Tu credencial digital y código QR dinámico de acceso ya están activos en la App: https://app.fitcore.io/qr?u=${selectedMember.docNumber}. ¡Te esperamos en sala!`;
      actions = ['Abrir App QR', 'Ver Mi Rutina'];
    } else if (templateType === 'DEBT_REMINDER') {
      type = 'PAYMENT_REMINDER';
      content = `Hola ${selectedMember.firstName} 💳 Te recordamos que tu membresía mensual (${selectedMember.membershipPlan}) vence pronto o presenta saldo pendiente (S/. ${selectedMember.outstandingBalance || 199.00}). Paga con 1 clic aquí: https://pay.fitcore.io/link/cuota-${selectedMember.docNumber} o con Yape en caja.`;
      actions = ['Pagar con Tarjeta (Culqi)', 'Pagar con Yape'];
    } else if (templateType === 'INACTIVE_14D') {
      type = 'INACTIVITY_REACTIVATION';
      content = `¡${selectedMember.firstName}, te extrañamos en el box! 🔥 Han pasado 14 días desde tu último entrenamiento. Para ayudarte a retomar el ritmo, te regalamos un pase libre a Spinning mañana.`;
      actions = ['Reservar Cupo Gratis', 'Hablar con un Coach'];
    } else {
      type = 'WELCOME_CREDENTIAL';
      content = `Hola ${selectedMember.firstName}, aquí tienes tu pase temporal de invitado para tu amigo: https://pass.fitcore.io/guest-pass-${Date.now()}`;
      actions = ['Compartir Pase'];
    }

    setTimeout(() => {
      const newMsg: WhatsAppMessage = {
        id: `wa-${Date.now()}`,
        toPhone: selectedMember.phone,
        memberName: `${selectedMember.firstName} ${selectedMember.lastName}`,
        type,
        content,
        timestamp: 'Justo ahora',
        status: 'DELIVERED',
        actions
      };

      setMessages([newMsg, ...messages]);
      setIsSending(false);

      confetti({
        particleCount: 40,
        spread: 40,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  const handleAdvanceLead = (leadId: string) => {
    setLeads(leads.map(l => {
      if (l.id === leadId) {
        let nextStage: LeadCard['stage'] = l.stage;
        if (l.stage === 'NUEVO_LEAD') nextStage = 'CLASE_PRUEBA';
        else if (l.stage === 'CLASE_PRUEBA') nextStage = 'ASISTIO';
        else if (l.stage === 'ASISTIO') nextStage = 'CONVERTIDO';
        return { ...l, stage: nextStage };
      }
      return l;
    }));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                WhatsApp Cloud API Nativa (Meta)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Marketing Automation & CRM Kanban
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Automatización de WhatsApp & Pipeline de Ventas CRM
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Cobranza preventiva automatizada, reactivación de socios inactivos por más de 14 días (Churn Prevention) y seguimiento comercial de leads desde Facebook/Instagram Ads.
            </p>
          </div>

          {/* TAB TOGGLE */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 self-start">
            <button
              onClick={() => setActiveTab('WHATSAPP_BOT')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'WHATSAPP_BOT' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Bot & Disparadores WhatsApp
            </button>
            <button
              onClick={() => setActiveTab('KANBAN_PIPELINE')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'KANBAN_PIPELINE' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Pipeline Kanban de Leads
            </button>
          </div>
        </div>
      </div>

      {/* TAB: WHATSAPP BOT */}
      {activeTab === 'WHATSAPP_BOT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* DISPATCH CONTROLS (5 COLS) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              Disparador de Automatización (Triggers)
            </h2>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Destinatario (Socio / Lead):
              </label>
              <select
                value={selectedMember.id}
                onChange={(e) => {
                  const m = members.find((item) => item.id === e.target.value);
                  if (m) setSelectedMember(m);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} ({m.phone}) — {m.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Plantilla de Automatización Aprobada:
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setTemplateType('DEBT_REMINDER')}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                    templateType === 'DEBT_REMINDER'
                      ? 'bg-emerald-950/60 border-emerald-500 text-white'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-emerald-400 block">Recordatorio de Cobro & Link de Pago</span>
                  <span className="text-[11px] text-slate-400">Envío 3 días antes del vencimiento con botón Culqi/Yape</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTemplateType('INACTIVE_14D')}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                    templateType === 'INACTIVE_14D'
                      ? 'bg-amber-950/60 border-amber-500 text-white'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-amber-400 block">Reactivación por Inactividad (Anti-Churn)</span>
                  <span className="text-[11px] text-slate-400">Disparador automático si no asiste hace más de 14 días</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTemplateType('WELCOME')}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                    templateType === 'WELCOME'
                      ? 'bg-blue-950/60 border-blue-500 text-white'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-blue-400 block">Bienvenida & Credencial Digital (QR)</span>
                  <span className="text-[11px] text-slate-400">Al momento del registro con acceso al app</span>
                </button>
              </div>
            </div>

            <button
              id="btn-send-whatsapp"
              onClick={handleSendAutomatedMessage}
              disabled={isSending}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer text-xs"
            >
              <Send className="w-4 h-4" />
              {isSending ? 'Enviando por WhatsApp API...' : 'Disparar Mensaje por WhatsApp Cloud API'}
            </button>

          </div>

          {/* WHATSAPP MOCKUP CHAT (7 COLS) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Bandeja de Interacción de WhatsApp (Vista del Socio)
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Meta API Online
              </span>
            </div>

            {/* CHAT MESSAGES STREAM */}
            <div className="bg-[#0b141a] p-4 rounded-2xl border border-slate-800 space-y-3 max-h-[460px] overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col items-start max-w-md">
                  <div className="bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tl-none shadow-md space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-4 text-[10px] text-emerald-200 border-b border-emerald-600/40 pb-1">
                      <span className="font-bold">FIT-CORE OS Bot</span>
                      <span>Para: {msg.memberName}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-line text-xs font-sans">
                      {msg.content}
                    </p>

                    {/* INTERACTIVE BUTTONS */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="pt-2 border-t border-emerald-600/40 space-y-1">
                        {msg.actions.map((act, i) => (
                          <div
                            key={i}
                            className="bg-[#0b141a]/60 hover:bg-[#0b141a] text-emerald-300 font-bold text-[11px] py-1.5 px-3 rounded-lg text-center cursor-pointer transition-colors"
                          >
                            ⚡ {act}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200/80 pt-1">
                      <span>{msg.timestamp}</span>
                      <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* TAB: KANBAN PIPELINE */}
      {activeTab === 'KANBAN_PIPELINE' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* COLUMN: NUEVO LEAD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">1. Nuevos Leads (Ads)</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                {leads.filter(l => l.stage === 'NUEVO_LEAD').length}
              </span>
            </div>

            <div className="space-y-2">
              {leads.filter(l => l.stage === 'NUEVO_LEAD').map((lead) => (
                <div key={lead.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{lead.name}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">S/. {lead.potentialValuePen}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Origen: {lead.source}</div>
                  <button
                    onClick={() => handleAdvanceLead(lead.id)}
                    className="w-full py-1 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold transition-colors"
                  >
                    Agendar Clase Prueba →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN: CLASE PRUEBA */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">2. Clase Prueba Agendada</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                {leads.filter(l => l.stage === 'CLASE_PRUEBA').length}
              </span>
            </div>

            <div className="space-y-2">
              {leads.filter(l => l.stage === 'CLASE_PRUEBA').map((lead) => (
                <div key={lead.id} className="bg-slate-950 p-3 rounded-xl border border-amber-500/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{lead.name}</span>
                    <span className="text-[10px] text-amber-400 font-bold">S/. {lead.potentialValuePen}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Coach: {lead.assignedCoach}</div>
                  <button
                    onClick={() => handleAdvanceLead(lead.id)}
                    className="w-full py-1 bg-amber-600/80 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold transition-colors"
                  >
                    Marcar Asistencia →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN: ASISTIO */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400">3. Asistió (Negociación)</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                {leads.filter(l => l.stage === 'ASISTIO').length}
              </span>
            </div>

            <div className="space-y-2">
              {leads.filter(l => l.stage === 'ASISTIO').map((lead) => (
                <div key={lead.id} className="bg-slate-950 p-3 rounded-xl border border-blue-500/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{lead.name}</span>
                    <span className="text-[10px] text-blue-400 font-bold">S/. {lead.potentialValuePen}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Interesado en Plan Anual</div>
                  <button
                    onClick={() => handleAdvanceLead(lead.id)}
                    className="w-full py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold transition-colors"
                  >
                    Convertir a Socio Pagado 🚀
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN: CONVERTIDO */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">4. Socio Activo Ganado</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                {leads.filter(l => l.stage === 'CONVERTIDO').length}
              </span>
            </div>

            <div className="space-y-2">
              {leads.filter(l => l.stage === 'CONVERTIDO').map((lead) => (
                <div key={lead.id} className="bg-slate-950 p-3 rounded-xl border border-emerald-500/40 space-y-2 text-xs bg-emerald-950/20">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{lead.name}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-emerald-300 font-semibold">Membresía Pagada: S/. {lead.potentialValuePen}</div>
                  <span className="text-[10px] text-slate-400 block">Auto Boleta SUNAT generada</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
