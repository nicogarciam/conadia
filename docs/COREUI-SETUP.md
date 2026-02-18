# Configuración de CoreUI (Versión Gratuita)

Este proyecto utiliza **CoreUI Open Source** (versión gratuita) para los componentes de UI.

## Instalación

Las dependencias ya están configuradas en `package.json`:

```json
{
  "dependencies": {
    "@coreui/coreui": "^4.3.0",
    "@coreui/react": "^4.3.0",
    "@coreui/icons": "^3.0.1",
    "@coreui/icons-react": "^3.0.1"
  }
}
```

## Uso de Componentes

Todos los componentes se importan desde `@coreui/react`:

```typescript
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CSidebar,
  CForm,
  CFormInput,
  // ... otros componentes
} from '@coreui/react';
```

## Estilos

Los estilos de CoreUI se importan en `src/index.css`:

```css
@import '@coreui/coreui/dist/css/coreui.min.css';
```

## Componentes Disponibles

La versión gratuita de CoreUI incluye todos los componentes básicos necesarios:

- ✅ Layout: `CContainer`, `CRow`, `CCol`
- ✅ Navegación: `CSidebar`, `CNavItem`, `CNavLink`, `CHeader`
- ✅ Formularios: `CForm`, `CFormInput`, `CFormLabel`, `CButton`
- ✅ Componentes: `CCard`, `CCardBody`, `CCardHeader`, `CAlert`, `CModal`
- ✅ Tablas: `CTable`, `CTableHead`, `CTableBody`, `CTableRow`
- ✅ Utilidades: `CSpinner`, `CBadge`, `CDropdown`

## Componentes NO Disponibles (Solo en PRO)

Los siguientes componentes requieren CoreUI PRO (licencia comercial):
- `CWidgetStats` - Reemplazado por `CCard` con estilos personalizados
- `CSmartTable` - Usar `CTable` estándar
- `CAutocomplete` - Usar `CFormInput` con lógica personalizada
- Otros componentes marcados como PRO en la documentación

## Referencias

- Documentación oficial: https://coreui.io/react/docs/getting-started/introduction/
- Componentes disponibles: https://coreui.io/react/docs/components/accordion/
- Licencia: MIT (Open Source)

## Notas

- Este proyecto NO utiliza componentes PRO
- Todos los componentes usados están disponibles en la versión gratuita
- Si necesitas funcionalidades PRO, considera alternativas o implementaciones personalizadas
