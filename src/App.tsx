import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { SaasSuperAdminModule } from './components/architecture/SaasSuperAdminModule';
import { ErdSchemaViewer } from './components/architecture/ErdSchemaViewer';
import { NestjsArchitectureViewer } from './components/architecture/NestjsArchitectureViewer';
import { OverbookingSimulator } from './components/architecture/OverbookingSimulator';
import { SunatPaymentTester } from './components/architecture/SunatPaymentTester';
import { AccessControlModule } from './components/operations/AccessControlModule';
import { BoutiqueBookingModule } from './components/operations/BoutiqueBookingModule';
import { TrainingBiometricsModule } from './components/operations/TrainingBiometricsModule';
import { WhatsappCrmModule } from './components/operations/WhatsappCrmModule';
import { FinancialBiModule } from './components/operations/FinancialBiModule';

import { ActiveModule, Tenant, Branch, UserMember, AccessLog, BoutiqueClass, Role } from './types';
import { 
  SAMPLE_TENANTS, 
  SAMPLE_BRANCHES, 
  SAMPLE_MEMBERS, 
  SAMPLE_ACCESS_LOGS, 
  INITIAL_BOUTIQUE_CLASSES 
} from './data/sampleData';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('SAAS_SUPERADMIN');
  const [tenants, setTenants] = useState<Tenant[]>(SAMPLE_TENANTS);
  const [currentTenant, setCurrentTenant] = useState<Tenant>(SAMPLE_TENANTS[0]); // Peru by default
  const [branches, setBranches] = useState<Branch[]>(SAMPLE_BRANCHES);
  const [currentBranch, setCurrentBranch] = useState<Branch>(SAMPLE_BRANCHES[0]);
  const [currentRole, setCurrentRole] = useState<Role>('SuperAdmin');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // App Operational States
  const [members, setMembers] = useState<UserMember[]>(SAMPLE_MEMBERS);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(SAMPLE_ACCESS_LOGS);
  const [boutiqueClasses, setBoutiqueClasses] = useState<BoutiqueClass[]>(INITIAL_BOUTIQUE_CLASSES);

  // When tenant changes, update branch list
  const handleSelectTenant = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    // Find branches for tenant or fallback
    const tenantBranches = branches.filter(b => b.tenantId === tenant.id);
    const validBranches = tenantBranches.length > 0 ? tenantBranches : [
      {
        id: `b-${tenant.slug}-01`,
        tenantId: tenant.id,
        name: `Sede Central (${tenant.country})`,
        city: tenant.country,
        address: `Av. Principal 100, ${tenant.country}`,
        timezone: 'UTC',
        capacity: 200,
        activeCount: 65,
        status: 'OPEN' as const
      }
    ];
    setBranches(prev => {
      const exists = prev.some(b => b.tenantId === tenant.id);
      return exists ? prev : [...prev, ...validBranches];
    });
    setCurrentBranch(validBranches[0]);
  };

  const handleSelectBranch = (branch: Branch) => {
    setCurrentBranch(branch);
  };

  const handleAddTenant = (newTenant: Tenant, newBranch: Branch) => {
    setTenants(prev => [newTenant, ...prev]);
    setBranches(prev => [newBranch, ...prev]);
    setCurrentTenant(newTenant);
    setCurrentBranch(newBranch);
  };

  const handleUpdateTenantStatus = (tenantId: string, status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED') => {
    setTenants(prev => prev.map(t => {
      if (t.id === tenantId && t.saasSubscription) {
        return {
          ...t,
          saasSubscription: {
            ...t.saasSubscription,
            status
          }
        };
      }
      return t;
    }));
  };

  const handleAddAccessLog = (newLog: AccessLog) => {
    setAccessLogs(prev => [newLog, ...prev]);
  };

  const handleUpdateBoutiqueClass = (updatedClass: BoutiqueClass) => {
    setBoutiqueClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* GLOBAL NAVBAR */}
      <Navbar
        tenants={tenants}
        currentTenant={currentTenant}
        onSelectTenant={handleSelectTenant}
        branches={branches}
        currentBranch={currentBranch}
        onSelectBranch={handleSelectBranch}
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        onOpenLoginModal={() => setIsAuthModalOpen(true)}
        onGoToOnboarding={() => setActiveModule('SAAS_SUPERADMIN')}
      />

      {/* AUTHENTICATION / LOGIN MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        tenants={tenants}
        currentTenant={currentTenant}
        onSelectTenant={handleSelectTenant}
        onSelectRole={setCurrentRole}
      />

      <div className="flex-1 flex flex-col md:flex-row max-w-[1700px] w-full mx-auto p-4 md:p-6 gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          currency={currentTenant.currency}
        />

        {/* MAIN CONTENT WORKSPACE */}
        <main className="flex-1 min-w-0">
          
          {/* SAAS PORTAL & CLIENT ONBOARDING */}
          {activeModule === 'SAAS_SUPERADMIN' && (
            <SaasSuperAdminModule
              tenants={tenants}
              currentTenant={currentTenant}
              onSelectTenant={handleSelectTenant}
              onAddTenant={handleAddTenant}
              onUpdateTenantStatus={handleUpdateTenantStatus}
            />
          )}

          {/* ARCHITECTURAL CORE MODULES */}
          {activeModule === 'ERD_SCHEMA' && (
            <ErdSchemaViewer />
          )}

          {activeModule === 'NESTJS_MICROSERVICES' && (
            <NestjsArchitectureViewer />
          )}

          {activeModule === 'OVERBOOKING_CONCURRENCY' && (
            <OverbookingSimulator />
          )}

          {activeModule === 'SUNAT_PAYMENTS' && (
            <SunatPaymentTester />
          )}

          {/* OPERATIONAL SAAS MODULES */}
          {activeModule === 'ACCESS_CONTROL' && (
            <AccessControlModule
              members={members}
              accessLogs={accessLogs}
              onAddAccessLog={handleAddAccessLog}
              currentBranch={currentBranch}
            />
          )}

          {activeModule === 'BOUTIQUE_BOOKING' && (
            <BoutiqueBookingModule
              classes={boutiqueClasses}
              onUpdateClass={handleUpdateBoutiqueClass}
            />
          )}

          {activeModule === 'TRAINING_BIOMETRICS' && (
            <TrainingBiometricsModule
              member={members[0]}
            />
          )}

          {activeModule === 'WHATSAPP_CRM' && (
            <WhatsappCrmModule
              members={members}
            />
          )}

          {activeModule === 'FINANCIAL_BI' && (
            <FinancialBiModule
              tenant={currentTenant}
            />
          )}

        </main>
      </div>

      {/* FOOTER BAR */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-mono text-slate-400 font-semibold">FIT-CORE OS Multi-Tenant Platform v2.6</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500">PostgreSQL RLS • NestJS Clean Architecture • Redis Lua • SUNAT UBL 2.1</span>
        </div>
        <div className="text-[11px] text-slate-500">
          SaaS Engine Listo para Despliegue en Vercel & Cloud Run
        </div>
      </footer>

    </div>
  );
}
