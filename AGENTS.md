# AGENTS.md — Gastro SaaS
# Leé este archivo COMPLETO antes de hacer cualquier cosa.

## Qué es este proyecto
SaaS de gestión para negocios gastronómicos (restaurantes, bares, cafeterías).
Stack: Next.js 14 + TypeScript + Tailwind + shadcn/ui + tRPC + Supabase + Vercel.

## Estado actual del proyecto
<!-- ACTUALIZAR MANUALMENTE AL TERMINAR CADA PASO -->
- [x] Paso 0: Setup repo y entorno
- [x] Paso 1: Configuración base (Next.js + Supabase + Sentry)
- [ ] Paso 2: Auth completo
- [ ] Paso 3: Onboarding (crear organización)
- [ ] Paso 4: Layout dashboard (sidebar, header, modo oscuro)
- [ ] Paso 5: CRUD Proveedores
- [ ] Paso 6: CRUD Categorías + Productos
- [ ] Paso 7: Roles y permisos
- [ ] Paso 8: Compras manuales
- [ ] Paso 9: OCR de facturas
- [ ] Paso 10: Import Excel/CSV
- [ ] Paso 11: Dashboard y métricas
- [ ] Paso 12: Alertas WhatsApp
- [ ] Paso 13: Billing con MercadoPago
- [ ] Paso 14: Pulido UX + tests E2E
- [ ] Paso 15: Launch prep

**Paso actual:** leer el checklist arriba y pedirme confirmación sobre cuál es el paso activo.

---

## Estructura de branches

```
main         → producción (NUNCA tocar directamente)
staging      → pre-producción
develop      → integración (base para crear features)
feature/*    → una branch por feature
fix/*        → una branch por bugfix
```

**Para cada tarea nueva, la branch sigue esta convención:**
```
feature/paso-05-crud-proveedores
feature/paso-09-ocr-facturas
fix/validacion-cuit-proveedor
```

**Flujo de trabajo:**
```bash
# Antes de empezar cualquier tarea
git checkout develop
git pull origin develop
git checkout -b feature/nombre-descriptivo

# Al terminar (después de que los tests pasen)
git add .
git commit -m "feat(scope): descripción"
git push origin feature/nombre-descriptivo
# → Crear PR hacia develop (NO hacia main)
```

---

## Comandos del proyecto

```bash
# Desarrollo
npm run dev              # Servidor local en :3000

# Calidad — ejecutar SIEMPRE en este orden antes de commitear
npm run build            # Compilación TypeScript + Next.js
npm test                 # Tests unitarios e integración (Jest)
npm run lint             # ESLint
npm run type-check       # tsc --noEmit

# Tests E2E (solo cuando el paso lo requiera)
npm run test:e2e         # Playwright

# Base de datos
npm run db:migrate       # Aplica migraciones pendientes en Supabase
npm run db:generate      # Genera tipos desde el schema de Supabase
```

**Regla crítica:** si `npm run build` falla, NO hagas commit. Arreglá primero.

---

## Multi-tenant — regla de oro

**TODA query a la base de datos DEBE filtrar por `organization_id`.**

```typescript
// ✅ CORRECTO
const suppliers = await supabase
  .from('suppliers')
  .select('*')
  .eq('organization_id', organizationId)  // ← SIEMPRE

// ❌ INCORRECTO — expone datos de otros tenants
const suppliers = await supabase
  .from('suppliers')
  .select('*')
```

Si escribís una query sin `organization_id`, es un bug de seguridad crítico. Avisame antes de avanzar.

---

## Seguridad — reglas no negociables

- Nunca expongas URLs directas de Supabase Storage. Usá siempre signed URLs con expiración de 15 minutos.
- Nunca loguees datos sensibles (CUIT, emails, montos) en `console.log`.
- Toda acción destructiva (delete, import masivo) debe registrarse en la tabla `audit_logs`.
- Variables de entorno: si agregás una nueva, actualizá `.env.example` con descripción.

---

## Variables de entorno necesarias

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # Solo server-side, nunca al cliente

# Google Cloud Vision (OCR)
GOOGLE_CLOUD_API_KEY=

# 360dialog (WhatsApp)
WABA_API_KEY=
WABA_PHONE_NUMBER_ID=

# Resend (Email)
RESEND_API_KEY=

# MercadoPago
MP_ACCESS_TOKEN=
MP_WEBHOOK_SECRET=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Sentry
NEXT_PUBLIC_SENTRY_DSN=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

---

## Modelo de datos — entidades principales

```
Organization    → el negocio/tenant (1 por cliente)
User            → persona con acceso
OrganizationMember → relación User ↔ Organization con rol (owner|operator|viewer)
Supplier        → proveedor del negocio
Category        → categoría de productos (árbol, máx 2 niveles)
Product         → insumo o producto del catálogo
Purchase        → factura/compra a un proveedor
PurchaseItem    → línea de una compra (producto + cantidad + precio)
StockMovement   → entrada/salida/ajuste de stock
ImportJob       → registro de importaciones CSV/Excel
AuditLog        → historial de acciones críticas
```

Migraciones SQL en: `supabase/migrations/`
Tipos TypeScript generados en: `types/database.ts` (no editar manualmente)

---

## Diseño y UX — reglas de implementación

### Paleta de colores (usar estas variables CSS, no hardcodear hex)
```css
/* Disponibles en globals.css */
--color-accent: terracota (claro: #C4622D / oscuro: #E07A4F)
--color-accent-2: verde oliva (claro: #2D5A27 / oscuro: #4A8C43)
--color-bg: fondo principal
--color-surface: fondo de cards
--color-text: texto principal
--color-text-muted: texto secundario
--color-border: bordes
```

### Modo oscuro
- Implementado con `next-themes`. Toggle en el header, siempre visible.
- Nunca uses colores hardcodeados. Todo a través de variables CSS o clases de Tailwind con `dark:`.

### Tipografía (ya configurada en globals.css)
- Títulos/display: `font-display` → Fraunces
- Cuerpo/UI: `font-sans` → DM Sans
- Números/código: `font-mono` → JetBrains Mono

### Componentes — comportamiento esperado
- **Botones con acción async:** mostrar spinner y deshabilitar mientras se procesa. Nunca dejar al usuario sin feedback.
- **Formularios:** validación en tiempo real con Zod + react-hook-form. Errores debajo del campo, en rojo, en español.
- **Tablas con datos:** siempre mostrar skeleton mientras cargan. Nunca pantalla en blanco.
- **Acciones destructivas:** siempre modal de confirmación con descripción del impacto.
- **Toasts:** usar react-hot-toast desde esquina inferior derecha. Verde para éxito, rojo para error.

---

## Estructura de carpetas clave

```
app/
  (auth)/          → rutas públicas: login, register
  (dashboard)/     → rutas protegidas (requieren auth + organization)
    layout.tsx     → sidebar + header
    page.tsx       → dashboard principal
    proveedores/
    productos/
    compras/
    stock/
    configuracion/
  api/trpc/        → endpoint tRPC

components/
  ui/              → shadcn/ui (NO editar)
  layout/          → Sidebar, Header, MobileNav
  forms/           → formularios reutilizables
  charts/          → gráficos del dashboard

server/trpc/router/  → un archivo por entidad (proveedores.ts, etc.)
lib/ocr/             → pipeline de OCR
lib/import/          → parser Excel/CSV
inngest/             → jobs async (OCR, WhatsApp, billing check)
supabase/migrations/ → SQL versionado (nunca borrar, solo agregar)
__tests__/           → tests Jest
e2e/                 → tests Playwright
```

---

## Flujo de trabajo para CADA TAREA

Cuando yo te pida hacer algo, respondé SIEMPRE con esta estructura:

### 🎯 Qué voy a hacer
[2-3 líneas describiendo el cambio]

### 🌿 Branch
```bash
git checkout develop && git pull origin develop
git checkout -b feature/nombre
```

### 📦 Dependencias nuevas (si aplica)
```bash
npm install paquete
```

### 💻 Código
[archivos completos, en orden lógico]

### 🧪 Cómo verificar que funciona
[pasos exactos para probarlo manualmente + tests a correr]

### ✅ Checklist pre-commit
```
□ npm run build → sin errores
□ npm test → todos pasan
□ npm run lint → sin errores
□ Probado en el navegador
□ Sin console.log olvidados
□ .env.example actualizado si agregué variables
□ audit_logs registrado si la acción es destructiva
```

### 📤 Commit y push
```bash
git add .
git commit -m "tipo(scope): descripción en español"
git push origin feature/nombre
```

### 🔜 Próximo paso recomendado
[qué viene después]

---

## ⚠️ Lo que NUNCA debés hacer

1. Push directo a `main` o `staging`
2. Avanzar al paso N+1 si el paso N no está en `develop`
3. Escribir `any` en TypeScript sin comentario justificando por qué
4. Queries a Supabase sin filtrar por `organization_id`
5. Mostrar errores técnicos al usuario (no "Error 500", sino "No pudimos guardar. Intentá de nuevo.")
6. Hardcodear colores, fonts o strings de texto en componentes
7. Crear migraciones SQL que borren o modifiquen columnas existentes sin avisarme
8. Instalar dependencias de producción sin preguntarme primero