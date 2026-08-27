import React, { useState } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  QrCode,
  Users,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import confetti from 'canvas-confetti';
import { PosProduct, Tenant } from '../../types';
import { SAMPLE_POS_PRODUCTS } from '../../data/sampleData';

interface FinancialBiProps {
  tenant: Tenant;
}

const MRR_GROWTH_DATA = [
  { month: 'Mar', mrr: 145000, newMembers: 120, churnRate: 3.8 },
  { month: 'Abr', mrr: 158000, newMembers: 145, churnRate: 3.5 },
  { month: 'May', mrr: 172000, newMembers: 160, churnRate: 3.2 },
  { month: 'Jun', mrr: 189000, newMembers: 185, churnRate: 2.9 },
  { month: 'Jul', mrr: 210000, newMembers: 210, churnRate: 2.7 },
  { month: 'Ago', mrr: 235000, newMembers: 245, churnRate: 2.4 },
];

const HOURLY_HEATMAP_DATA = [
  { hour: '06:00 AM', attendance: 45 },
  { hour: '07:00 AM', attendance: 92 },
  { hour: '08:00 AM', attendance: 88 },
  { hour: '09:00 AM', attendance: 52 },
  { hour: '12:00 PM', attendance: 64 },
  { hour: '01:00 PM', attendance: 70 },
  { hour: '05:00 PM', attendance: 95 },
  { hour: '06:00 PM', attendance: 118 },
  { hour: '07:00 PM', attendance: 125 },
  { hour: '08:00 PM', attendance: 85 },
  { hour: '09:00 PM', attendance: 40 },
];

export const FinancialBiModule: React.FC<FinancialBiProps> = ({ tenant }) => {
  const [activeTab, setActiveTab] = useState<'BI_METRICS' | 'POS_REGISTER'>('BI_METRICS');
  const [cart, setCart] = useState<{ product: PosProduct; quantity: number }[]>([]);
  const [posSuccessMessage, setPosSuccessMessage] = useState<string | null>(null);

  const handleAddToCart = (product: PosProduct) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as { product: PosProduct; quantity: number }[]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartIgv = cartSubtotal * 0.18;
  const cartTotal = cartSubtotal;

  const handleCheckoutPos = (method: string) => {
    if (cart.length === 0) return;

    setPosSuccessMessage(`¡Venta de ${tenant.currency} ${cartTotal.toFixed(2)} registrada exitosamente con ${method}! Comprobante B001-${Math.floor(Math.random() * 9000 + 1000)} generado.`);
    setCart([]);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SaaS Financial BI & POS Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                MRR • Churn • Heatmap de Aforo
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Finanzas, BI Analytics & Punto de Venta (POS)
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Métricas financieras SaaS para dueños de franquicias (MRR, Churn, LTV, ARPU), mapa de calor de afluencia por hora y caja rápida para suplementos en recepción.
            </p>
          </div>

          {/* TAB TOGGLE */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 self-start">
            <button
              onClick={() => setActiveTab('BI_METRICS')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'BI_METRICS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Métricas SaaS & Aforo
            </button>
            <button
              onClick={() => setActiveTab('POS_REGISTER')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'POS_REGISTER' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Caja Rápida POS ({cart.length})
            </button>
          </div>
        </div>
      </div>

      {/* TAB: BI METRICS */}
      {activeTab === 'BI_METRICS' && (
        <div className="space-y-6">
          
          {/* TOP SAAS METRICS */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">MRR (Ingreso Mensual)</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xs text-emerald-400 font-bold">{tenant.currency}</span>
                <span className="text-2xl font-black text-white">235,000</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" /> +12.4% vs mes anterior
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">Churn Rate (Bajas)</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-emerald-400">2.4%</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-1">
                <TrendingDown className="w-3 h-3" /> -0.3% Churn saludable
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">LTV (Lifetime Value)</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xs text-blue-400 font-bold">{tenant.currency}</span>
                <span className="text-2xl font-black text-white">1,850</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Retención media: 9.3 meses</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">ARPU (Ticket Medio)</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xs text-teal-400 font-bold">{tenant.currency}</span>
                <span className="text-2xl font-black text-white">199.00</span>
              </div>
              <span className="text-[10px] text-teal-400 font-bold mt-1 block">+ Upselling Boutique</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">Socios Activos</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-white">{tenant.totalMembers}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 block">En {tenant.activeBranches} sedes</span>
            </div>
          </div>

          {/* CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* MRR GROWTH RECHARTS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Evolución MRR ({tenant.currency}) & Nuevos Socios
                </h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MRR_GROWTH_DATA} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="mrr" stroke="#10b981" fillOpacity={1} fill="url(#colorMrr)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* HOURLY ATTENDANCE HEATMAP */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Mapa de Afluencia por Hora (Staff & Limpieza)
                </h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={HOURLY_HEATMAP_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="attendance" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB: POS REGISTER */}
      {activeTab === 'POS_REGISTER' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* PRODUCTS CATALOG (7 COLS) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              Catálogo de Productos & Suplementos (Caja de Recepción)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_POS_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-14 h-14 rounded-lg object-cover border border-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase font-bold text-emerald-400">{prod.category}</span>
                      <h4 className="font-bold text-xs text-white leading-snug line-clamp-2">{prod.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">SKU: {prod.sku} • Stock: {prod.stock}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="font-mono font-bold text-sm text-emerald-400">
                      {tenant.currency} {prod.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(prod)}
                      className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* CART & FAST CHECKOUT (5 COLS) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Arqueo de Venta / Carrito</span>
              <span className="font-mono text-emerald-400 font-bold">{cart.length} productos</span>
            </h2>

            {cart.length > 0 ? (
              <div className="space-y-3">
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <span className="font-bold text-white block truncate">{item.product.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {tenant.currency} {item.product.price.toFixed(2)} c/u
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded bg-slate-800 text-slate-300 flex items-center justify-center font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-white w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded bg-slate-800 text-slate-300 flex items-center justify-center font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-emerald-400 ml-2 w-16 text-right">
                          {tenant.currency} {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* TOTALS */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Op. Gravada:</span>
                    <span>{tenant.currency} {(cartTotal / 1.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>I.G.V. (18%):</span>
                    <span>{tenant.currency} {(cartTotal - (cartTotal / 1.18)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                    <span>Total a Cobrar:</span>
                    <span className="text-emerald-400">{tenant.currency} {cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* PAYMENT METHOD FAST BUTTONS */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCheckoutPos('Efectivo')}
                    className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    💵 Efectivo
                  </button>
                  <button
                    onClick={() => handleCheckoutPos('Yape / Plin')}
                    className="py-2.5 bg-purple-900/60 hover:bg-purple-900 text-purple-200 border border-purple-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    📱 Yape / Plin
                  </button>
                  <button
                    onClick={() => handleCheckoutPos('Tarjeta Culqi POS')}
                    className="col-span-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg cursor-pointer"
                  >
                    💳 Cobrar con Tarjeta & Emitir Boleta SUNAT
                  </button>
                </div>

              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-4 bg-slate-950/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
                <ShoppingCart className="w-8 h-8 text-slate-600 mb-2" />
                <p className="font-semibold text-slate-300">El carrito de recepción está vacío</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Haz clic en "Agregar" en cualquier producto para registrar una venta rápida.
                </p>
              </div>
            )}

            {posSuccessMessage && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{posSuccessMessage}</span>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
