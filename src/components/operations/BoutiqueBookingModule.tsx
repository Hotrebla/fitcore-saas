import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Bike, 
  Sparkles, 
  Users, 
  Clock, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BoutiqueClass, SpotLayout } from '../../types';

interface BoutiqueBookingModuleProps {
  classes: BoutiqueClass[];
  onUpdateClass: (updated: BoutiqueClass) => void;
}

export const BoutiqueBookingModule: React.FC<BoutiqueBookingModuleProps> = ({
  classes,
  onUpdateClass
}) => {
  const [selectedClass, setSelectedClass] = useState<BoutiqueClass>(classes[0]);
  const [selectedSpot, setSelectedSpot] = useState<SpotLayout | null>(null);
  const [bookedFeedback, setBookedFeedback] = useState<string | null>(null);

  const handleSelectSpot = (spot: SpotLayout) => {
    setSelectedSpot(spot);
    setBookedFeedback(null);
  };

  const handleConfirmSpotReservation = () => {
    if (!selectedSpot || selectedSpot.status !== 'AVAILABLE') return;

    const updatedSpots = selectedClass.spots.map((s) => {
      if (s.spotNumber === selectedSpot.spotNumber) {
        return {
          ...s,
          status: 'OCCUPIED' as const,
          memberName: 'Carlos Mendoza (Tú)'
        };
      }
      return s;
    });

    const newBookedCount = selectedClass.bookedSpots + 1;

    const updatedClass: BoutiqueClass = {
      ...selectedClass,
      bookedSpots: newBookedCount,
      spots: updatedSpots
    };

    onUpdateClass(updatedClass);
    setSelectedClass(updatedClass);
    setBookedFeedback(`¡Excelente! Has reservado con éxito la ${selectedClass.category === 'SPINNING' ? 'Bicicleta' : 'Estación'} #${selectedSpot.spotNumber}.`);
    setSelectedSpot(null);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleJoinWaitlist = () => {
    const updatedClass: BoutiqueClass = {
      ...selectedClass,
      waitlist: [...selectedClass.waitlist, 'Carlos Mendoza (Tú)']
    };
    onUpdateClass(updatedClass);
    setSelectedClass(updatedClass);
    setBookedFeedback(`Has sido añadido a la lista de espera (Posición #${updatedClass.waitlist.length}). Te notificaremos por WhatsApp si se libera un cupo.`);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Glofox Boutique Experience
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Mapeo Visual de Sala
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Reserva Visual de Asientos Boutique (Spinning & Pilates)
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Experiencia inmersiva para estudios boutique donde los socios eligen exactamente su número de bicicleta, reformer o rack con actualización en tiempo real y gestión de lista de espera.
            </p>
          </div>

          {/* CLASS SELECTOR PILLS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 self-start">
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => {
                  setSelectedClass(cls);
                  setSelectedSpot(null);
                  setBookedFeedback(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedClass.id === cls.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {cls.title} ({cls.startTime})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* VISUAL ROOM LAYOUT (8 COLS) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* CLASS HEADER INFO */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={selectedClass.instructorAvatar}
                alt={selectedClass.instructor}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <h3 className="font-bold text-white text-sm">{selectedClass.title}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span>Coach: <strong className="text-emerald-400">{selectedClass.instructor}</strong></span>
                  <span>•</span>
                  <span>Hora: <strong className="text-white">{selectedClass.startTime} ({selectedClass.durationMin} min)</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Disponibilidad</span>
                <span className={`text-sm font-bold ${selectedClass.totalSpots - selectedClass.bookedSpots > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedClass.totalSpots - selectedClass.bookedSpots} cupos libres / {selectedClass.totalSpots}
                </span>
              </div>
            </div>
          </div>

          {/* INSTRUCTOR STAGE VISUAL (Front of the Studio) */}
          <div className="flex flex-col items-center">
            <div className="w-48 py-1.5 rounded-t-xl bg-gradient-to-r from-emerald-900/60 via-emerald-600/60 to-emerald-900/60 border-t border-x border-emerald-500/40 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                🎙️ TARIMA DEL INSTRUCTOR
              </span>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          </div>

          {/* SPOTS GRID MATRIX */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80">
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-w-xl mx-auto">
              {selectedClass.spots.map((spot) => {
                const isAvailable = spot.status === 'AVAILABLE';
                const isSelected = selectedSpot?.spotNumber === spot.spotNumber;

                return (
                  <button
                    key={spot.spotNumber}
                    id={`spot-btn-${spot.spotNumber}`}
                    onClick={() => isAvailable && handleSelectSpot(spot)}
                    disabled={!isAvailable}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all relative border ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-white shadow-lg shadow-emerald-500/30 scale-105 font-black'
                        : isAvailable
                        ? 'bg-slate-800/80 hover:bg-emerald-950/40 text-emerald-400 border-emerald-500/40 hover:border-emerald-400 cursor-pointer shadow-sm'
                        : 'bg-slate-900/50 text-slate-400 border-slate-800 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <Bike className={`w-5 h-5 mb-1 ${isSelected ? 'text-slate-950' : isAvailable ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="font-mono text-xs font-bold">#{spot.spotNumber}</span>
                    <span className="text-[9px] uppercase font-bold tracking-tighter mt-0.5">
                      {isSelected ? 'Elegido' : isAvailable ? 'Libre' : 'Ocupado'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* LEGEND */}
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-400 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-md bg-slate-800 border border-emerald-500/40" />
                <span>Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-md bg-emerald-500" />
                <span className="text-white font-bold">Tu Selección</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-md bg-slate-900 border border-slate-800 opacity-60" />
                <span>Ocupado</span>
              </div>
            </div>
          </div>

          {/* FEEDBACK BANNER */}
          {bookedFeedback && (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/60 text-xs text-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{bookedFeedback}</span>
              </div>
              <button 
                onClick={() => setBookedFeedback(null)}
                className="text-emerald-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* RESERVATION SIDE PANEL (4 COLS) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Detalle de la Reserva
          </h2>

          {selectedSpot ? (
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Asiento Seleccionado:</span>
                <span className="text-sm font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/60">
                  Spot #{selectedSpot.spotNumber}
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <p><strong>Clase:</strong> {selectedClass.title}</p>
                <p><strong>Horario:</strong> {selectedClass.startTime}</p>
                <p><strong>Instructor:</strong> {selectedClass.instructor}</p>
                <p><strong>Créditos requeridos:</strong> 1 Crédito Boutique (Incluido en tu membresía)</p>
              </div>

              <button
                id="btn-confirm-spot"
                onClick={handleConfirmSpotReservation}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer text-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirmar Reserva Inmediata
              </button>
            </div>
          ) : (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-center text-xs text-slate-400 space-y-2">
              <Bike className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="font-semibold text-slate-300">Selecciona una bicicleta en el plano</p>
              <p className="text-[11px] text-slate-400">
                Haz clic en cualquier recuadro verde para elegir tu lugar preferido en la sala.
              </p>
            </div>
          )}

          {/* WAITLIST STATUS CARD */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Lista de Espera Automatizada:
              </span>
              <span className="text-amber-400 font-mono font-bold">
                {selectedClass.waitlist.length} en espera
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Si la clase se llena o deseas reservar en caso de cancelación, puedes ingresar a la cola. El sistema promueve al primer usuario y le envía un WhatsApp con 15 minutos para confirmar.
            </p>
            <button
              id="btn-join-waitlist"
              onClick={handleJoinWaitlist}
              className="w-full py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors cursor-pointer"
            >
              Unirme a la Lista de Espera FIFO
            </button>
          </div>

          {/* PENALTY POLICY INFO */}
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 block">Política de Cancelación & No-Show:</span>
            <p>Puedes cancelar sin penalización hasta 2 horas antes de la clase. Cancelaciones tardías consumen 1 crédito de sesión.</p>
          </div>

        </div>

      </div>
    </div>
  );
};
