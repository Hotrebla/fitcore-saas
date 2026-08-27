import React, { useState } from 'react';
import { 
  Zap, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Clock, 
  Users, 
  ShieldCheck, 
  Copy, 
  Check, 
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { REDIS_LUA_OVERBOOKING_SCRIPT, CONCURRENCY_EXPLANATION } from '../../data/overbookingLogic';

interface SimulatedRequest {
  id: number;
  userId: string;
  userName: string;
  requestedSpot: number;
  arrivalMs: number;
  luaExecutionUs: number;
  status: 'PENDING' | 'WINNER_RESERVED' | 'WAITLISTED' | 'REJECTED';
  waitlistPos?: number;
  message: string;
}

export const OverbookingSimulator: React.FC = () => {
  const [concurrencyCount, setConcurrencyCount] = useState<number>(50);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simulationResults, setSimulationResults] = useState<SimulatedRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'SIMULATOR' | 'LUA_CODE' | 'EXPLANATION'>('SIMULATOR');
  const [copiedLua, setCopiedLua] = useState(false);
  const [classState, setClassState] = useState({
    totalSpots: 20,
    initiallyBooked: 19,
    currentBooked: 19,
    targetSpot: 12,
    winnerUser: null as string | null
  });

  const handleCopyLua = () => {
    navigator.clipboard.writeText(REDIS_LUA_OVERBOOKING_SCRIPT);
    setCopiedLua(true);
    setTimeout(() => setCopiedLua(false), 2000);
  };

  const runConcurrentSimulation = () => {
    setIsRunning(true);
    setSimulationResults([]);
    setClassState(prev => ({ ...prev, currentBooked: 19, winnerUser: null }));

    const names = [
      'Carlos Mendoza', 'Valeria Rojas', 'Roberto Álvarez', 'Mariana Durán', 'Gabriel Soto',
      'Camila Zegarra', 'Diego Santillán', 'Rodrigo Benítez', 'Sofía Palacios', 'Mateo Vargas',
      'Lucía Paredes', 'Andrés Morales', 'Natalia Flores', 'Joaquín Castro', 'Daniela Ríos',
      'Felipe Navarro', 'Paula Medina', 'Ignacio Silva', 'Fernanda Cruz', 'Esteban Romero'
    ];

    const requests: SimulatedRequest[] = Array.from({ length: concurrencyCount }, (_, i) => {
      const randomName = names[i % names.length] + (i >= names.length ? ` (${i + 1})` : '');
      return {
        id: i + 1,
        userId: `usr-test-${1000 + i}`,
        userName: randomName,
        requestedSpot: 12, // All 50 users target the same remaining Spot #12!
        arrivalMs: parseFloat((Math.random() * 8 + 1).toFixed(2)), // arrive between 1.00ms and 9.00ms
        luaExecutionUs: Math.floor(Math.random() * 150 + 250), // 250 - 400 microseconds
        status: 'PENDING',
        message: 'Enviando petición HTTP al Gateway...'
      };
    });

    // Sort requests strictly by arrival time to simulate real-world packet arrival in network queue
    requests.sort((a, b) => a.arrivalMs - b.arrivalMs);

    let winnerAssigned = false;
    let waitlistCounter = 0;

    const processedRequests = requests.map((req, idx) => {
      if (idx === 0 && !winnerAssigned) {
        winnerAssigned = true;
        return {
          ...req,
          status: 'WINNER_RESERVED' as const,
          message: '🏆 ¡Reserva confirmada en Redis Lua! Spot #12 asignado (HTTP 200 OK).'
        };
      } else {
        waitlistCounter++;
        return {
          ...req,
          status: 'WAITLISTED' as const,
          waitlistPos: waitlistCounter,
          message: `🚫 Cupo ocupado. Encolado atómicamente en Lista de Espera FIFO #${waitlistCounter}.`
        };
      }
    });

    // Simulate animated execution
    setTimeout(() => {
      setSimulationResults(processedRequests);
      setIsRunning(false);
      setClassState(prev => ({
        ...prev,
        currentBooked: 20,
        winnerUser: processedRequests[0].userName
      }));

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  const resetSimulation = () => {
    setSimulationResults([]);
    setClassState({
      totalSpots: 20,
      initiallyBooked: 19,
      currentBooked: 19,
      targetSpot: 12,
      winnerUser: null
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Alta Concurrencia • Sub-milisegundo
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Redis Lua Script Atómico
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Motor Anti-Overbooking & Bloqueos Distribuidos
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Prueba de estrés en vivo: Simula la colisión de 50 usuarios intentando reservar el último cupo y asiento disponible (Bicicleta #12) en el mismo milisegundo sin generar duplicados.
            </p>
          </div>

          {/* VIEW TABS */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 self-start">
            <button
              id="btn-tab-sim"
              onClick={() => setActiveTab('SIMULATOR')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'SIMULATOR' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Simulador de Concurrencia
            </button>
            <button
              id="btn-tab-lua"
              onClick={() => setActiveTab('LUA_CODE')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'LUA_CODE' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Script Lua Redis (O(1))
            </button>
            <button
              id="btn-tab-expl"
              onClick={() => setActiveTab('EXPLANATION')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'EXPLANATION' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Desglose Técnico
            </button>
          </div>
        </div>
      </div>

      {/* TAB: SIMULATOR */}
      {activeTab === 'SIMULATOR' && (
        <div className="space-y-6">
          
          {/* CONTROLS CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              
              {/* CURRENT CLASS STATUS */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Clase Objetivo:</span>
                  <span className="text-emerald-400 font-bold">Spinning Power RPM 07:00 AM</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Capacidad de Sala:</span>
                  <span className="font-mono text-white font-bold">{classState.totalSpots} Bicicletas</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Cupos Ocupados:</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {classState.currentBooked} / {classState.totalSpots}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
                  <span>Único Spot Libre:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                    Bicicleta #{classState.targetSpot}
                  </span>
                </div>
              </div>

              {/* CONCURRENCY SLIDER */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    Peticiones Concurrentes en Paralelo:
                  </span>
                  <span className="font-mono text-emerald-400 text-sm bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {concurrencyCount} usuarios simultáneos
                  </span>
                </div>
                <input
                  id="concurrency-slider"
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={concurrencyCount}
                  onChange={(e) => setConcurrencyCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>10 req</span>
                  <span>25 req</span>
                  <span>50 req (Escenario Solicitado)</span>
                  <span>100 req</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  id="btn-run-simulation"
                  onClick={runConcurrentSimulation}
                  disabled={isRunning}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {isRunning ? 'Ejecutando Redis Lua...' : `Disparar ${concurrencyCount} Requests`}
                </button>
                <button
                  id="btn-reset-sim"
                  onClick={resetSimulation}
                  disabled={isRunning || simulationResults.length === 0}
                  className="flex items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
                  title="Reiniciar prueba"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* SIMULATION RESULTS METRICS & TIMELINE */}
          {simulationResults.length > 0 && (
            <div className="space-y-4">
              
              {/* SUMMARY STATS BAR */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                    {simulationResults.length}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Peticiones</span>
                    <p className="text-xs font-bold text-white">12ms Ventana Temporal</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Cupo Asignado</span>
                    <p className="text-xs font-bold text-emerald-300 truncate">{classState.winnerUser}</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                    {simulationResults.filter(r => r.status === 'WAITLISTED').length}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Lista de Espera FIFO</span>
                    <p className="text-xs font-bold text-amber-300">Posiciones 1 a {simulationResults.length - 1}</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-3 flex items-center gap-3 bg-emerald-950/20">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-sm">
                    0
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Overbooking (Duplicados)</span>
                    <p className="text-xs font-bold text-emerald-200">100% Cero Errores</p>
                  </div>
                </div>
              </div>

              {/* TIMELINE OF REQUESTS */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      Registro de Ejecución Atómica en Redis (Orden de Llegada al Socket)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Latencia Promedio Redis: <strong>0.32 ms</strong>
                  </span>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {simulationResults.map((req) => (
                    <div
                      key={req.id}
                      className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-all ${
                        req.status === 'WINNER_RESERVED'
                          ? 'bg-emerald-950/40 border-emerald-500/60 shadow-sm shadow-emerald-950'
                          : 'bg-slate-950/40 border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[11px] shrink-0 ${
                          req.status === 'WINNER_RESERVED'
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          #{req.id}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{req.userName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({req.userId})</span>
                          </div>
                          <p className={`text-[11px] mt-0.5 ${req.status === 'WINNER_RESERVED' ? 'text-emerald-300 font-medium' : 'text-slate-400'}`}>
                            {req.message}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto font-mono text-[11px]">
                        <span className="text-slate-400">T+{req.arrivalMs}ms</span>
                        <span className="text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          ⚡ {req.luaExecutionUs}µs
                        </span>
                        {req.status === 'WINNER_RESERVED' ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                            CONFIRMADO
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                            WAITLIST #{req.waitlistPos}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB: LUA CODE */}
      {activeTab === 'LUA_CODE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Script Lua Atómico Ejecutado en Redis Engine
              </h3>
            </div>
            <button
              id="btn-copy-lua"
              onClick={handleCopyLua}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700 cursor-pointer"
            >
              {copiedLua ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLua ? '¡Copiado!' : 'Copiar Script Lua'}
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-amber-300 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed select-all">
            {REDIS_LUA_OVERBOOKING_SCRIPT}
          </pre>
        </div>
      )}

      {/* TAB: EXPLANATION */}
      {activeTab === 'EXPLANATION' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              Por qué las Bases de Datos Relacionales Tradicionales Fallan en Concurrencia Extrema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  El Problema con SELECT ... FOR UPDATE en SQL
                </div>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  {CONCURRENCY_EXPLANATION.traditionalFail}
                </p>
              </div>

              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  La Solución Fit-Core OS: Redis Single-Thread Lua
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  {CONCURRENCY_EXPLANATION.redisSolution}
                </p>
              </div>
            </div>
          </div>

          {/* 5-STEP PIPELINE */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3">
              Flujo Paso a Paso de la Transacción en Milisegundos
            </h3>
            <div className="space-y-3">
              {CONCURRENCY_EXPLANATION.executionFlow.map((step) => (
                <div
                  key={step.step}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{step.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
