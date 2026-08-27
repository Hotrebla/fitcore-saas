import React, { useState } from 'react';
import { 
  Dumbbell, 
  Activity, 
  Flame, 
  Trophy, 
  Plus, 
  Search, 
  Filter, 
  TrendingDown, 
  TrendingUp, 
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import confetti from 'canvas-confetti';
import { ExerciseItem, WodItem, UserMember } from '../../types';
import { SAMPLE_EXERCISES, SAMPLE_TODAY_WOD } from '../../data/sampleData';

interface TrainingBiometricsProps {
  member: UserMember;
}

const INBODY_HISTORY_DATA = [
  { date: '15 May', weight: 82.5, fatPct: 18.2, muscleKg: 39.5, visceral: 6 },
  { date: '15 Jun', weight: 81.0, fatPct: 16.8, muscleKg: 40.2, visceral: 5 },
  { date: '15 Jul', weight: 79.5, fatPct: 15.4, muscleKg: 41.0, visceral: 4 },
  { date: '10 Ago', weight: 78.4, fatPct: 14.2, muscleKg: 41.8, visceral: 4 },
];

export const TrainingBiometricsModule: React.FC<TrainingBiometricsProps> = ({ member }) => {
  const [activeTab, setActiveTab] = useState<'EXERCISES' | 'WOD_BOARD' | 'INBODY_BIO'>('INBODY_BIO');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem>(SAMPLE_EXERCISES[0]);
  const [inbodySyncing, setInbodySyncing] = useState(false);
  const [inbodySuccessMessage, setInbodySuccessMessage] = useState<string | null>(null);

  const filteredExercises = SAMPLE_EXERCISES.filter((ex) => {
    const matchesCategory = selectedCategory === 'TODOS' || ex.category === selectedCategory;
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSyncInBody = () => {
    setInbodySyncing(true);
    setInbodySuccessMessage(null);

    setTimeout(() => {
      setInbodySyncing(false);
      setInbodySuccessMessage('¡Datos sincronizados exitosamente desde Báscula InBody 570 (Bluetooth Low Energy)!');
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Virtuagym Engine Integration
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                InBody 570 / Tanita Sync • WOD Engine
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Motor de Entrenamiento, WOD & Bioimpedancia Corporal
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Seguimiento biométrico de composición corporal (grasa vs. músculo), biblioteca 3D de ejercicios y tablón comunitario de WODs para CrossFit y entrenamiento funcional.
            </p>
          </div>

          {/* TAB TOGGLE */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 self-start">
            <button
              id="btn-tab-inbody"
              onClick={() => setActiveTab('INBODY_BIO')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'INBODY_BIO' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Bioimpedancia & Grasa/Músculo
            </button>
            <button
              id="btn-tab-wod"
              onClick={() => setActiveTab('WOD_BOARD')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'WOD_BOARD' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              WOD del Día & PRs
            </button>
            <button
              id="btn-tab-exercises"
              onClick={() => setActiveTab('EXERCISES')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'EXERCISES' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              Biblioteca de Ejercicios
            </button>
          </div>
        </div>
      </div>

      {/* TAB: INBODY BIOIMPEDANCE */}
      {activeTab === 'INBODY_BIO' && (
        <div className="space-y-6">
          
          {/* STATS CARDS OF SELECTED MEMBER */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">Peso Corporal</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-white">{member.bioMetrics?.weightKg || 78.4}</span>
                <span className="text-xs font-bold text-slate-400">kg</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-1">
                <TrendingDown className="w-3 h-3" /> -4.1 kg últimos 90 días
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">% Grasa Corporal</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-emerald-400">{member.bioMetrics?.fatPercentage || 14.2}</span>
                <span className="text-xs font-bold text-emerald-300">%</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-1">
                <TrendingDown className="w-3 h-3" /> -4.0% (Definición Óptima)
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">Masa Muscular</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-teal-400">{member.bioMetrics?.muscleKg || 41.8}</span>
                <span className="text-xs font-bold text-teal-300">kg</span>
              </div>
              <span className="text-[10px] text-teal-400 font-bold flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" /> +2.3 kg hipertrofia limpia
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">Grasa Visceral</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-white">Nivel {member.bioMetrics?.visceralFat || 4}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                Saludable (Rango 1-9)
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Sincronización</span>
                <p className="text-xs font-bold text-white mt-0.5">Báscula InBody 570</p>
              </div>
              <button
                id="btn-sync-inbody"
                onClick={handleSyncInBody}
                disabled={inbodySyncing}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 mt-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${inbodySyncing ? 'animate-spin' : ''}`} />
                {inbodySyncing ? 'Leyendo...' : 'Sincronizar InBody'}
              </button>
            </div>
          </div>

          {/* NUTRICION IA ACTIVATION BANNER */}
          <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Plan de Nutrición IA Sincronizado para {member.firstName} {member.lastName}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Ajusta calorías y macros automáticamente según sus datos de composición corporal InBody.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const studentName = `${member.firstName} ${member.lastName}`;
                const studentDni = member.docNumber || '45892134';
                const urlPlan = `https://www.bienestarsinexcusas.site/?socio=fitcore&partner=FITCORE_POWERSTUDIO&dni=${studentDni}&nombre=${encodeURIComponent(studentName)}`;
                const message = `¡Hola ${studentName}! 💪 Bienvenido a FitCore PowerStudio.\n\nTu membresía incluye tu App Oficial de Nutrición y Entrenamiento con Inteligencia Artificial.\n\n📲 Toca aquí para completar tu ficha y activar tu plan de 28 días:\n${urlPlan}\n\n¡Nos vemos en el entrenamiento! 🔥`;
                const cleanPhone = member.phone.replace(/[^0-9]/g, '');
                window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
              }}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer uppercase tracking-wider"
            >
              <MessageSquare className="w-4 h-4 text-slate-950" />
              <span>📲 Enviar App de Nutrición IA por WhatsApp</span>
            </button>
          </div>

          {inbodySuccessMessage && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{inbodySuccessMessage}</span>
            </div>
          )}

          {/* HISTORICAL CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* EVOLUTION: GRASA VS MUSCULO */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Evolución Antropométrica: Grasa (%) vs Músculo (kg)
                </h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={INBODY_HISTORY_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" textAnchor="end" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="fatPct" name="% Grasa Corporal" stroke="#f43f5e" strokeWidth={3} dot={{ r: 5 }} />
                    <Line type="monotone" dataKey="muscleKg" name="Masa Muscular (kg)" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* WEIGHT PROGRESSION */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Evolución de Peso Corporal Total (kg)
                </h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={INBODY_HISTORY_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" domain={[70, 85]} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="weight" name="Peso (kg)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB: WOD BOARD */}
      {activeTab === 'WOD_BOARD' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* WOD CARD (7 COLS) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-black text-white">{SAMPLE_TODAY_WOD.title}</h3>
                  <span className="text-xs text-slate-400">{SAMPLE_TODAY_WOD.date} • Tipo: <strong className="text-amber-400">{SAMPLE_TODAY_WOD.type}</strong></span>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
                {SAMPLE_TODAY_WOD.durationDesc}
              </span>
            </div>

            {/* WOD INSTRUCTIONS */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Estructura del Entrenamiento:
              </h4>
              <div className="space-y-2 text-sm text-slate-200 font-medium">
                {SAMPLE_TODAY_WOD.description.map((line, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-200">
              💡 <strong>Consejo del Coach:</strong> Regula el ritmo en la primera milla (RPE 7/10). El verdadero reto está en las 200 flexiones. Divide en series de 10-15 reps con descansos cortos.
            </div>
          </div>

          {/* LEADERBOARD & PRs (5 COLS) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Leaderboard de la Sede (Ranking de Tiempos)
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {SAMPLE_TODAY_WOD.records.map((rec) => (
                <div
                  key={rec.rank}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    rec.rank === 1
                      ? 'bg-amber-950/40 border-amber-500/50 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      rec.rank === 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      #{rec.rank}
                    </span>
                    <img
                      src={rec.avatar}
                      alt={rec.athleteName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <span className="font-bold text-white block">{rec.athleteName}</span>
                      <span className="text-[10px] text-slate-400">Atleta Verificado</span>
                    </div>
                  </div>

                  <span className="font-mono text-sm font-black text-amber-400">
                    ⏱️ {rec.score}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* TAB: EXERCISES LIBRARY */}
      {activeTab === 'EXERCISES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* EXERCISES LIST (7 COLS) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            
            {/* SEARCH & FILTER */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por ejercicio o músculo..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['TODOS', 'Pecho', 'Piernas', 'Espalda', 'Hombros'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                        : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* EXERCISES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredExercises.map((ex) => {
                const isSelected = selectedExercise.id === ex.id;
                return (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/50 border-emerald-500 text-white shadow'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        {ex.category} • {ex.equipment}
                      </span>
                      <h4 className="font-bold text-sm text-white mt-0.5 line-clamp-1">{ex.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{ex.targetMuscle}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">{ex.level}</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5">Ver Técnica <ChevronRight className="w-3 h-3" /></span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* EXERCISE DETAIL & BIOMECHANICS (5 COLS) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="relative h-48 rounded-xl overflow-hidden border border-slate-800">
              <img
                src={selectedExercise.thumbnail}
                alt={selectedExercise.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-4">
                <span className="px-2.5 py-1 bg-emerald-600/90 text-white font-bold text-xs rounded-lg shadow">
                  Nivel: {selectedExercise.level}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{selectedExercise.category}</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{selectedExercise.name}</h3>
              <p className="text-xs text-slate-300 mt-1">
                <strong>Músculos Principales:</strong> {selectedExercise.targetMuscle}
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Puntos Clave de Biomecánica & Técnica:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedExercise.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
