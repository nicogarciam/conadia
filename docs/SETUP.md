# Guía de Configuración Inicial

Esta guía te ayudará a configurar el proyecto desde cero.

## Prerrequisitos

1. **Node.js y npm**: Instala Node.js 18 o superior desde [nodejs.org](https://nodejs.org/)
2. **Cuenta de Supabase**: Crea una cuenta en [supabase.com](https://supabase.com)
3. **Clave API de Google Gemini**: Obtén una clave desde [Google AI Studio](https://makersuite.google.com/app/apikey)

## Paso 1: Configurar Supabase

1. Crea un nuevo proyecto en Supabase
2. Ve al SQL Editor y ejecuta el script `database-schema.sql` que está en `docs/database-schema.sql`
3. Ve a Settings > API y copia:
   - Project URL
   - `anon` public key
   - `service_role` secret key (guárdala de forma segura)

## Paso 2: Configurar el Backend (API)

```bash
cd api
npm install
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=tu-gemini-api-key
```

Genera los tipos de TypeScript desde Supabase:

```bash
npx supabase gen types typescript --project-id tu-project-id > src/shared/config/database.types.ts
```

Inicia el servidor:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Paso 3: Configurar el Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Edita el archivo `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_API_URL=http://localhost:3000
```

Genera los tipos de TypeScript:

```bash
npx supabase gen types typescript --project-id tu-project-id > src/shared/config/database.types.ts
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Paso 4: Configurar Autenticación en Supabase

1. Ve a Authentication > Providers en Supabase
2. Habilita Email provider
3. Configura las opciones de autenticación según tus necesidades
4. Opcional: Configura otros proveedores (Google, GitHub, etc.)

## Paso 5: Crear Usuario de Prueba

Puedes crear un usuario desde el frontend usando el formulario de registro, o directamente desde Supabase:

1. Ve a Authentication > Users en Supabase
2. Haz clic en "Add user"
3. Ingresa email y contraseña
4. El usuario podrá iniciar sesión en el frontend

## Verificación

1. Inicia sesión en el frontend con el usuario creado
2. Verifica que puedas acceder al dashboard
3. Prueba crear un consorcio (si tienes permisos)
4. Verifica que la API responda correctamente en `http://localhost:3000/health`

## Solución de Problemas

### Error: "Missing Supabase environment variables"
- Verifica que los archivos `.env` existan y tengan las variables correctas
- Asegúrate de que los nombres de las variables coincidan exactamente

### Error: "Invalid or expired token"
- Verifica que la autenticación esté configurada correctamente en Supabase
- Revisa que el usuario tenga permisos adecuados

### Error: "Row Level Security policy violation"
- Revisa las políticas RLS en Supabase
- Asegúrate de que las políticas permitan las operaciones necesarias

## Próximos Pasos

1. Configurar políticas RLS más específicas según tus necesidades
2. Implementar las funcionalidades faltantes según las historias de usuario
3. Configurar CI/CD si es necesario
4. Configurar variables de entorno para producción
