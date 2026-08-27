import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  Search, 
  Key, 
  Link2, 
  ShieldAlert, 
  FileCode, 
  Table as TableIcon,
  Layers,
  Info
} from 'lucide-react';
import { SCHEMA_TABLES, DBML_SPEC, POSTGRESQL_DDL_RLS, SchemaTable } from '../../data/schemaData';

export const ErdSchemaViewer: React.FC = () => {
  const [activeView, setActiveView] = useState<'TABLES' | 'DBML' | 'SQL_RLS'>('TABLES');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const categories = ['ALL', 'Core & Multi-Tenant', 'Memberships & Billing', 'Access & IoT', 'Bookings & Scheduling', 'Training & Workouts'];

  const filteredTables = SCHEMA_TABLES.filter((t) => {
    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.columns.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PostgreSQL 16 + RLS Multi-Tenancy
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                11 Tablas Críticas
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Diagrama de Entidad-Relación (ERD) & Modelo de Datos DBML
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Diseño relacional escalable de clase mundial optimizado para soportar desde 1 estudio boutique hasta franquicias de 100+ sedes con aislamiento de datos estricto por Tenant ID mediante PostgreSQL Row-Level Security (RLS).
            </p>
          </div>

          {/* VIEW TOGGLE */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 self-start">
            <button
              id="btn-view-tables"
              onClick={() => setActiveView('TABLES')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'TABLES'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Explorador de Tablas ({SCHEMA_TABLES.length})
            </button>
            <button
              id="btn-view-dbml"
              onClick={() => setActiveView('DBML')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'DBML'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Especificación DBML
            </button>
            <button
              id="btn-view-sql"
              onClick={() => setActiveView('SQL_RLS')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'SQL_RLS'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              SQL DDL & Políticas RLS
            </button>
          </div>
        </div>
      </div>

      {/* VIEW: TABLES EXPLORER */}
      {activeView === 'TABLES' && (
        <div className="space-y-4">
          {/* SEARCH & FILTERS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="erd-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tabla o columna..."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* GRID OF TABLES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTables.map((table) => (
              <div
                key={table.name}
                id={`table-card-${table.name}`}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-slate-700 transition-colors"
              >
                {/* TABLE HEADER */}
                <div className="bg-slate-800/70 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TableIcon className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono font-bold text-sm text-emerald-300">
                      {table.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700 text-slate-300">
                      {table.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {table.columns.length} columnas
                  </span>
                </div>

                {/* TABLE DESCRIPTION */}
                <div className="px-4 py-2 bg-slate-950/40 text-xs text-slate-300 border-b border-slate-800/60">
                  {table.description}
                </div>

                {/* COLUMNS LIST */}
                <div className="divide-y divide-slate-800/50 max-h-80 overflow-y-auto">
                  {table.columns.map((col) => (
                    <div
                      key={col.name}
                      className="px-4 py-2 flex items-center justify-between text-xs hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {col.isPrimary && (
                          <span className="flex items-center gap-0.5 text-amber-400 bg-amber-950/40 border border-amber-800/60 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold">
                            <Key className="w-2.5 h-2.5" /> PK
                          </span>
                        )}
                        {col.isForeign && (
                          <span className="flex items-center gap-0.5 text-sky-400 bg-sky-950/40 border border-sky-800/60 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold" title={`FK -> ${col.foreignRef}`}>
                            <Link2 className="w-2.5 h-2.5" /> FK
                          </span>
                        )}
                        <span className="font-mono font-semibold text-slate-200">
                          {col.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {col.type}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 text-right truncate max-w-[200px]" title={col.description}>
                        {col.description}
                      </span>
                    </div>
                  ))}
                </div>

                {/* INDEXES FOOTER */}
                {table.indexes.length > 0 && (
                  <div className="bg-slate-950/70 px-4 py-2 border-t border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                      Índices & Constraints:
                    </span>
                    <div className="space-y-0.5">
                      {table.indexes.map((idx, i) => (
                        <code key={i} className="text-[10px] font-mono text-emerald-400/90 block truncate">
                          {idx}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: DBML CODE */}
      {activeView === 'DBML' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Especificación DBML Completa (dbdocs.io / dbdiagram.io)
              </h3>
            </div>
            <button
              id="btn-copy-dbml"
              onClick={() => handleCopy(DBML_SPEC, 'dbml')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
            >
              {copiedText === 'dbml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedText === 'dbml' ? '¡Copiado al Portapapeles!' : 'Copiar DBML'}
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto max-h-[550px] leading-relaxed select-all">
            {DBML_SPEC}
          </pre>
        </div>
      )}

      {/* VIEW: SQL DDL + RLS POLICIES */}
      {activeView === 'SQL_RLS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                PostgreSQL 16 DDL Script + Row-Level Security (RLS) Multi-Tenant
              </h3>
            </div>
            <button
              id="btn-copy-sql"
              onClick={() => handleCopy(POSTGRESQL_DDL_RLS, 'sql')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
            >
              {copiedText === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedText === 'sql' ? '¡Copiado!' : 'Copiar SQL + RLS'}
            </button>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Garantía de Aislamiento de Datos:</strong> Cada consulta ejecutada por el backend NestJS define <code className="font-mono bg-emerald-900/60 px-1 py-0.5 rounded text-white">SET LOCAL app.current_tenant_id = 'UUID'</code>. Las políticas RLS impiden que cualquier consulta acceda a datos de otra franquicia incluso ante errores de programación en queries crudas.
            </p>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-teal-300 font-mono text-xs overflow-x-auto max-h-[550px] leading-relaxed select-all">
            {POSTGRESQL_DDL_RLS}
          </pre>
        </div>
      )}
    </div>
  );
};
