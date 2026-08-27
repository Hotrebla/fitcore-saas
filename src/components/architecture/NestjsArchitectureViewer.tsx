import React, { useState } from 'react';
import { 
  Server, 
  Layers, 
  Radio, 
  Cpu, 
  Code2, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { MICROSERVICES_SPEC, NESTJS_CODE_SAMPLES, MicroserviceSpec } from '../../data/nestjsArchitecture';

export const NestjsArchitectureViewer: React.FC = () => {
  const [selectedService, setSelectedService] = useState<MicroserviceSpec>(MICROSERVICES_SPEC[1]); // Booking service
  const [activeCodeTab, setActiveCodeTab] = useState<'CONTROLLER' | 'USE_CASE'>('CONTROLLER');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                NestJS 10 + Clean Architecture / DDD
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Kafka Event Bus + gRPC
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Estructura de Microservicios & Módulos NestJS
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Arquitectura hexagonal limpia orientada al dominio (Domain-Driven Design). Cada módulo encapsula sus entidades, casos de uso (CQRS Commands/Queries), repositorios e interfaces de infraestructura.
            </p>
          </div>
        </div>
      </div>

      {/* CLEAN ARCHITECTURE LAYERS DIAGRAM */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            1. Presentation Layer
          </div>
          <p className="text-xs text-slate-300 font-medium mb-2">
            Controladores REST (Fastify/Express), Resolvers GraphQL, Handlers gRPC y decoradores Swagger.
          </p>
          <div className="text-[10px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
            @Controller('api/v1/...')
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            2. Application Layer
          </div>
          <p className="text-xs text-slate-300 font-medium mb-2">
            Casos de uso (CQRS UseCases), orquestación de transacciones, validación de DTOs con class-validator.
          </p>
          <div className="text-[10px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
            ReserveSpotUseCase.execute()
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            3. Domain Layer
          </div>
          <p className="text-xs text-slate-300 font-medium mb-2">
            Entidades de negocio puras, Value Objects, interfaces de repositorios y Eventos de Dominio.
          </p>
          <div className="text-[10px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
            BookingEntity, ClassRepository
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            4. Infrastructure Layer
          </div>
          <p className="text-xs text-slate-300 font-medium mb-2">
            TypeORM/Prisma RLS, Redis Cluster, Kafka Event Bus, SOAP SUNAT y WhatsApp Cloud API.
          </p>
          <div className="text-[10px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
            RedisConcurrency, SunatSoapClient
          </div>
        </div>
      </div>

      {/* MICROSERVICES SELECTOR & DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LIST OF MICROSERVICES */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-3">
            Microservicios del Ecosistema Fit-Core ({MICROSERVICES_SPEC.length})
          </h2>

          <div className="space-y-1.5">
            {MICROSERVICES_SPEC.map((svc) => {
              const isSelected = selectedService.name === svc.name;
              return (
                <button
                  key={svc.name}
                  id={`btn-svc-${svc.domain.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedService(svc)}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    isSelected
                      ? 'bg-emerald-950/50 border-emerald-500/50 text-white shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                      {svc.name}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {svc.domain}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {svc.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* SELECTED MICROSERVICE DETAILS */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">
                  {selectedService.name}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Protocolo Primario: <span className="font-mono text-emerald-300 font-bold">{selectedService.protocol}</span>
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold self-start">
              Dominio: {selectedService.domain}
            </span>
          </div>

          {/* RESPONSIBILITIES */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Responsabilidades Clave:
            </h4>
            <ul className="space-y-1.5">
              {selectedService.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* KAFKA EVENTS */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Eventos Emitidos al Kafka / RabbitMQ Event Bus:
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedService.kafkaEventsEmitted.map((ev, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-purple-950/50 border border-purple-800/60 text-purple-200 font-mono text-xs font-semibold"
                >
                  ⚡ {ev}
                </span>
              ))}
            </div>
          </div>

          {/* KEY ENDPOINTS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Endpoints & Contratos de API:
            </h4>
            <div className="space-y-2">
              {selectedService.keyEndpoints.map((ep, i) => (
                <div
                  key={i}
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ep.method === 'POST' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      ep.method === 'GET' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="text-slate-200 font-bold">{ep.path}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 hidden sm:inline font-sans">{ep.description}</span>
                    <span className="text-[10px] text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/60">
                      DTO: {ep.dto}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* CODE VIEWER: NESTJS CONTROLLER & USE CASE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Implementación de Producción: Módulo de Reservas NestJS
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveCodeTab('CONTROLLER')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeCodeTab === 'CONTROLLER'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Controller
              </button>
              <button
                onClick={() => setActiveCodeTab('USE_CASE')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeCodeTab === 'USE_CASE'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Use-Case (Clean Architecture)
              </button>
            </div>

            <button
              onClick={() => handleCopy(activeCodeTab === 'CONTROLLER' ? NESTJS_CODE_SAMPLES.controller : NESTJS_CODE_SAMPLES.useCase)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? '¡Copiado!' : 'Copiar Código'}
            </button>
          </div>
        </div>

        <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto max-h-[450px] leading-relaxed select-all">
          {activeCodeTab === 'CONTROLLER' ? NESTJS_CODE_SAMPLES.controller : NESTJS_CODE_SAMPLES.useCase}
        </pre>
      </div>

    </div>
  );
};
