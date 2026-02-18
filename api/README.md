# Conadia API

API Backend para Sistema de Gestión de Consorcios construida con Node.js, Express, TypeScript y Supabase.

## Arquitectura

Este proyecto sigue la **Arquitectura Vertical (Vertical Slices)**, donde cada funcionalidad está organizada como una unidad independiente que atraviesa todas las capas.

### Estructura de Carpetas

```
src/
├── features/              # Vertical slices por funcionalidad
│   ├── subscriptions/     # Gestión de planes y suscripciones
│   ├── billing/          # Liquidación de expensas
│   ├── payments/         # Procesamiento de pagos
│   └── ...
├── shared/               # Código compartido entre features
│   ├── config/          # Configuración (Supabase, etc.)
│   ├── middleware/      # Middlewares de Express
│   └── utils/           # Utilidades generales
└── index.ts             # Punto de entrada
```

## Configuración

1. Copia `.env.example` a `.env` y completa las variables:
   ```bash
   cp .env.example .env
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Genera los tipos de TypeScript desde Supabase:
   ```bash
   npx supabase gen types typescript --project-id your-project-id > src/shared/config/database.types.ts
   ```

## Desarrollo

```bash
# Modo desarrollo con hot reload
npm run dev

# Compilar
npm run build

# Ejecutar producción
npm start
```

## Endpoints

### Health Check
- `GET /health` - Verifica el estado del servidor

### Subscriptions
- `GET /api/subscriptions/plan-limits?account_id={id}` - Obtiene límites del plan

### Billing
- `POST /api/billing/generate` - Genera liquidación mensual

### Payments
- `POST /api/payments/report-ai` - Reporta pago con validación IA

## Autenticación

Los endpoints protegidos requieren un token Bearer en el header:
```
Authorization: Bearer <supabase_jwt_token>
```

## Base de Datos

El proyecto utiliza Supabase (PostgreSQL) con Row Level Security (RLS) habilitado para multi-tenancy.
