import React, { useState, useEffect } from 'react';
import { 
  ScanLine, 
  QrCode, 
  UserCheck, 
  Radio, 
  Wifi, 
  WifiOff, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw,
  Cpu,
  Smartphone,
  MessageSquare,
  Apple
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserMember, AccessLog, Branch } from '../../types';

interface AccessControlModuleProps {
  members: UserMember[];
  accessLogs: AccessLog[];
  onAddAccessLog: (log: AccessLog) => void;
  currentBranch: Branch;
}

export const AccessControlModule: React.FC<AccessControlModuleProps> = ({
  members,
  accessLogs,
  onAddAccessLog,
  currentBranch
}) => {
  const [selectedMember, setSelectedMember] = useState<UserMember>(members[0]);
  const [selectedMethod, setSelectedMethod] = useState<'QR_DYNAMIC' | 'FACIAL_RECOG' | 'RFID_BAND'>('QR_DYNAMIC');
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [totpSecondsRemaining, setTotpSecondsRemaining] = useState<number>(15);
  const [totpToken, setTotpToken] = useState<string>('948-120');
  const [latestResult, setLatestResult] = useState<{
    decision: 'GRANTED' | 'DENIED';
    reason?: string;
    latencyMs: number;
  } | null>(null);

  // 15-second dynamic QR code rotation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTotpSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Generate new simulated TOTP 6-digit code
          const newCode = Math.floor(100000 + Math.random() * 900000).toString();
          setTotpToken(`${newCode.slice(0, 3)}-${newCode.slice(3)}`);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSimulateAccessAttempt = () => {
    const start = performance.now();
    let decision: 'GRANTED' | 'DENIED' = 'GRANTED';
    let reason: string | undefined = undefined;

    // Business Logic Rules:
    if (selectedMember.status === 'EXPIRED') {
      decision = 'DENIED';
      reason = 'MEMBRESÍA VENCIDA - REQUIERE RENOVACIÓN';
    } else if (selectedMember.status === 'DEBTOR' || selectedMember.outstandingBalance > 0) {
      decision = 'DENIED';
      reason = `DEUDA PENDIENTE (S/. ${selectedMember.outstandingBalance.toFixed(2)} EN MORA)`;
    } else if (selectedMember.status === 'FROZEN') {
      decision = 'DENIED';
      reason = 'MEMBRESÍA CONGELADA TEMPORALMENTE';
    }

    const latency = isOfflineMode 
      ? Math.floor(Math.random() * 20 + 15) // Offline edge cache ~25ms
      : Math.floor(Math.random() * 45 + 75); // Cloud REST/MQTT ~95ms

    const newLog: AccessLog = {
      id: `acc-${Date.now()}`,
      timestamp: 'Justo ahora',
      memberId: selectedMember.id,
      memberName: `${selectedMember.firstName} ${selectedMember.lastName}`,
      branchId: currentBranch.id,
      branchName: currentBranch.name,
      method: selectedMethod,
      device: selectedMethod === 'QR_DYNAMIC' ? 'Torniquete A - ZKTeco ProFaceX' : selectedMethod === 'FACIAL_RECOG' ? 'Terminal Facial ZK-500' : 'Lector Pulsera RFID #2',
      decision,
      reason,
      latencyMs: latency,
      isOfflineSync: isOfflineMode
    };

    onAddAccessLog(newLog);
    setLatestResult({ decision, reason, latencyMs: latency });

    if (decision === 'GRANTED') {
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.7 }
      });
    }
  };

  const handleSendNutritionWhatsApp = (member: UserMember) => {
    const studentName = `${member.firstName} ${member.lastName}`;
    const studentDni = member.docNumber || '45892134';
    const urlPlan = `https://www.bienestarsinexcusas.site/?socio=fitcore&partner=FITCORE_POWERSTUDIO&dni=${studentDni}&nombre=${encodeURIComponent(studentName)}`;
    const message = `¡Hola ${studentName}! 💪 Bienvenido a FitCore PowerStudio.\n\nTu membresía incluye tu App Oficial de Nutrición y Entrenamiento con Inteligencia Artificial.\n\n📲 Toca aquí para completar tu ficha y activar tu plan de 28 días:\n${urlPlan}\n\n¡Nos vemos en el entrenamiento! 🔥`;
    const cleanPhone = member.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                IoT Edge Controller • Latencia &lt;150ms
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                QR TOTP 15s • ZKTeco Face • RFID
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Control de Accesos Físicos & IoT Hardware Gateway
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Simulador de torniquetes y molinetes en vivo con verificación criptográfica anti-fraude (QR dinámico cada 15 seg), detección de deudas y respaldo offline.
            </p>
          </div>

          {/* OFFLINE MODE TOGGLE */}
          <div className="flex items-center gap-3 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 self-start">
            <div className="flex items-center gap-2">
              {isOfflineMode ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
              <div>
                <span className="text-xs font-bold text-white block">
                  {isOfflineMode ? 'Modo Offline (Caché Edge)' : 'Conectado a la Nube'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isOfflineMode ? 'Base de datos en memoria local' : 'API Cloud AWS en tiempo real'}
                </span>
              </div>
            </div>
            <button
              id="btn-toggle-offline"
              onClick={() => setIsOfflineMode(!isOfflineMode)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isOfflineMode
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {isOfflineMode ? 'Desactivar' : 'Simular Caída Internet'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GATE SIMULATOR (5 COLS) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Torniquete & Terminal de Paso ({currentBranch.name})
          </h2>

          {/* SELECT MEMBER */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Seleccionar Socio que Intenta Acceder:
            </label>
            <select
              id="select-member-access"
              value={selectedMember.id}
              onChange={(e) => {
                const m = members.find((item) => item.id === e.target.value);
                if (m) setSelectedMember(m);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName} — {m.status} {m.outstandingBalance > 0 ? `(Debe S/. ${m.outstandingBalance})` : ''}
                </option>
              ))}
            </select>

            <div className="mt-2">
              <button
                type="button"
                onClick={() => handleSendNutritionWhatsApp(selectedMember)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/40 rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>📲 Enviar App de Nutrición IA por WhatsApp</span>
              </button>
            </div>
          </div>

          {/* AUTHENTICATION METHOD SELECTOR */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Método de Validación Física:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('QR_DYNAMIC')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  selectedMethod === 'QR_DYNAMIC'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-400 mb-1" />
                <span>QR Dinámico</span>
                <span className="block text-[10px] text-slate-400 font-normal">TOTP 15s</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('FACIAL_RECOG')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  selectedMethod === 'FACIAL_RECOG'
                    ? 'bg-teal-950/60 border-teal-500 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <UserCheck className="w-4 h-4 text-teal-400 mb-1" />
                <span>Facial ZK</span>
                <span className="block text-[10px] text-slate-400 font-normal">Biometría 3D</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('RFID_BAND')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  selectedMethod === 'RFID_BAND'
                    ? 'bg-blue-950/60 border-blue-500 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Radio className="w-4 h-4 text-blue-400 mb-1" />
                <span>Pulsera NFC</span>
                <span className="block text-[10px] text-slate-400 font-normal">RFID 13.56MHz</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC TOTP QR CARD (IF QR SELECTED) */}
          {selectedMethod === 'QR_DYNAMIC' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center space-y-2">
              <div className="flex items-center justify-between w-full text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  App Móvil del Socio
                </span>
                <span className="text-emerald-400 font-bold font-mono">
                  Rotación en {totpSecondsRemaining}s
                </span>
              </div>

              {/* QR VISUAL BOX */}
              <div className="w-36 h-36 bg-white p-2.5 rounded-xl flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                <QrCode className="w-28 h-28 text-slate-950" />
                <div className="absolute bottom-1 bg-slate-900/90 text-emerald-300 font-mono text-[9px] px-2 py-0.5 rounded font-bold">
                  {totpToken}
                </div>
              </div>

              {/* ROTATION PROGRESS BAR */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(totpSecondsRemaining / 15) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                Anti-Screenshot: El código hash expira cada 15 segundos y no puede ser reenviado por WhatsApp.
              </p>
            </div>
          )}

          {/* FACIAL CAMERA MOCKUP */}
          {selectedMethod === 'FACIAL_RECOG' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center space-y-2">
              <div className="relative w-full h-40 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.firstName}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-4 border-2 border-dashed border-emerald-400 rounded-lg flex items-center justify-center animate-pulse">
                  <span className="bg-emerald-950/80 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                    Face Match: 98.4%
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                Terminal ZKTeco ProFaceX con algoritmo de detección de vida (Anti-Spoofing).
              </p>
            </div>
          )}

          {/* ACTION BUTTON */}
          <button
            id="btn-simulate-pass"
            onClick={handleSimulateAccessAttempt}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer text-xs"
          >
            <ScanLine className="w-4 h-4" />
            Escanear en Torniquete Físico
          </button>

          {/* REAL-TIME RESULT PILL */}
          {latestResult && (
            <div className={`p-4 rounded-xl border flex items-center justify-between text-xs transition-all ${
              latestResult.decision === 'GRANTED'
                ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200 shadow-sm shadow-emerald-950'
                : 'bg-rose-950/50 border-rose-500 text-rose-200 shadow-sm shadow-rose-950'
            }`}>
              <div className="flex items-center gap-3">
                {latestResult.decision === 'GRANTED' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {latestResult.decision === 'GRANTED' ? 'ACCESO PERMITIDO - BIENVENIDO' : 'ACCESO DENEGADO (BLOQUEADO)'}
                  </div>
                  {latestResult.reason && (
                    <p className="text-[11px] mt-0.5 text-rose-300 font-semibold">{latestResult.reason}</p>
                  )}
                </div>
              </div>

              <div className="text-right font-mono text-[11px] shrink-0">
                <span className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700">
                  ⚡ {latestResult.latencyMs}ms
                </span>
              </div>
            </div>
          )}

        </div>

        {/* REAL-TIME ACCESS LOGS STREAM (7 COLS) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Bitácora de Accesos en Vivo (Telemetría de Molinetes)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Total Registros: {accessLogs.length}
            </span>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {accessLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    log.decision === 'GRANTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {log.decision === 'GRANTED' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{log.memberName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({log.timestamp})</span>
                      {log.isOfflineSync && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                          OFFLINE SYNC
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Dispositivo: <span className="text-slate-300">{log.device}</span>
                    </div>
                    {log.reason && (
                      <div className="text-[10px] text-rose-400 font-semibold mt-0.5">
                        Motivo: {log.reason}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                  <span className="text-slate-400">{log.method}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                    {log.latencyMs}ms
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
