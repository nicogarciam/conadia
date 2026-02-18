# Conadia Frontend

Frontend para Sistema de Gestión de Consorcios construido con React, TypeScript, CoreUI y Vite.

## Arquitectura

Este proyecto sigue la **Arquitectura Vertical (Vertical Slices)**, organizando el código por features en lugar de por capas técnicas.

### Estructura de Carpetas

```
src/
├── features/              # Vertical slices por funcionalidad
│   ├── auth/             # Autenticación
│   ├── dashboard/        # Dashboard principal
│   ├── consortium-setup/ # Configuración de consorcios y UF
│   ├── billing/          # Liquidación de expensas
│   └── owner-dashboard/  # Portal del propietario
├── shared/               # Código compartido
│   ├── auth/             # Providers y hooks de autenticación
│   ├── config/           # Configuración (Supabase, API)
│   └── layout/           # Componentes de layout
└── App.tsx               # Componente raíz
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
# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

## Tecnologías

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **CoreUI (Open Source)** - Framework de componentes UI gratuito
  - Usando `@coreui/react` y `@coreui/coreui` (versión gratuita)
  - Documentación: https://coreui.io/react/docs/getting-started/introduction/
- **React Query** - Gestión de estado del servidor
- **React Router** - Navegación
- **Vite** - Build tool
- **Supabase** - Autenticación y base de datos
- **Axios** - Cliente HTTP

## Features Implementadas

- ✅ Autenticación con Supabase
- ✅ Layout con CoreUI Sidebar
- ✅ Dashboard básico
- ✅ Gestión de Unidades Funcionales (estructura)
- ✅ Portal del Propietario con formulario de pago IA

## Próximos Pasos

- Implementar CRUD completo de UF
- Generación de liquidaciones
- Visualización de deudas y saldos
- Planes de pago
- Notificaciones
