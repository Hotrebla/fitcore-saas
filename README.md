# 🛡️ FitCore SaaS — Software Integral de Gestión & Control Operativo para Gimnasios

Plataforma Multi-Tenant moderna de gestión operativa, control de accesos IoT y reservas boutique para gimnasios, boxes de CrossFit, centros de spinning, pilates y clínicas de entrenamiento de alto rendimiento.

---

## 🚀 Arquitectura & Módulos Principales

### 👑 1. Portal SaaS SuperAdmin (Dueño de la Plataforma)
- **Onboarding de Nuevos Gimnasios:** Creación automatizada de inquilinos (Tenants) con base de datos aislada mediante Row-Level Security (RLS).
- **Gestión de Planes & Suscripciones:** Boutique Studio (\$99/mes), Gym Pro (\$149/mes) y Enterprise Chain (\$299/mes).
- **Entrega de Credenciales Instantáneas:** Generación de enlaces de acceso y mensajes directos para WhatsApp.
- **Calculadora de Retorno de Inversión (ROI SaaS):** Proyección de ingresos recurrentes mensuales (MRR) y anuales (ARR).

### 🚪 2. Control de Accesos & IoT Gateway
- **Código QR Dinámico (TOTP 15s):** Tokens criptográficos rotativos anti-capturas y anti-fraude.
- **Reconocimiento Facial & RFID:** Compatibilidad con terminales biométricas ZKTeco ProFaceX y pulseras RFID.
- **Validación Ultrarrápida (<150ms):** Verificación instantánea de estado de membresía y mora.
- **Edge Cache Offline:** Funcionamiento local ininterrumpido ante cortes de conexión a internet con sincronización automática posterior.

### 🧘‍♀️ 3. Reserva Visual de Asientos Boutique (Spinning & Pilates)
- **Mapeo Interactivo de Sala:** Selección visual de bicicleta o estación en tiempo real.
- **Prevención de Overbooking:** Bloqueos atómicos con Redis Lua para evitar colisiones de reserva simultáneas.
- **Lista de Espera Inteligente:** Asignación automática de cupos liberados con notificación push/WhatsApp.

### 📊 4. Finanzas, POS & Business Intelligence (BI)
- **Métricas SaaS en Tiempo Real:** Monitoreo de MRR, LTV, CAC y tasa de deserción (Churn Rate).
- **Heatmap de Afluencia por Horas:** Identificación de picos de asistencia para optimización de personal e instructores.
- **Punto de Venta (POS):** Venta rápida de suplementos, bebidas y merchandising con emisión de comprobante.

### 🧾 5. Facturación Electrónica SUNAT & Pasarelas de Pago
- **Emisión UBL 2.1:** Generación de Boletas, Facturas y Notas de Crédito con código hash y CDR.
- **Pagos Integrados:** Soporte para Culqi, Niubiz, Yape y Plin mediante QR dinámico.

### 🏋️‍♂️ 6. Biometría, Rendimiento & WOD (CrossFit)
- **Calculadora 1RM (Fórmula Epley/Brzycki):** Determinación de cargas máximas en sentadilla, peso muerto y press banca.
- **Composición Corporal InBody:** Seguimiento de grasa corporal, masa muscular y grasa visceral.
- **Leaderboard de WODs:** Clasificación diaria en modalidades AMRAP, EMOM y For Time.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **Iconografía & Animaciones:** Lucide React + Canvas Confetti + Motion
- **Visualización de Datos:** Recharts
- **Arquitectura Backend:** NestJS Clean Architecture / CQRS + PostgreSQL RLS + Redis Lua Scripts

---

## 💻 Instalación y Ejecución Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/fitcore-saas.git

# 2. Entrar al directorio
cd fitcore-saas

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

---

## 📦 Compilación para Producción

```bash
npm run build
```

---

## ☁️ Despliegue en Vercel

1. Sube este repositorio a tu cuenta de **GitHub**.
2. Ingresa a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
3. Haz clic en **"Add New..."** ➔ **"Project"**.
4. Selecciona el repositorio `fitcore-saas`.
5. Vercel detectará automáticamente **Vite**:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Haz clic en **"Deploy"** y en menos de 1 minuto tu aplicación estará disponible globalmente en una URL `.vercel.app`.

---

© 2026 FitCore SaaS Platform. Todos los derechos reservados.
