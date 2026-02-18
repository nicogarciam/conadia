import { CContainer, CCard, CCardHeader, CCardBody } from '@coreui/react';
import { UFManager } from '../components/UFManager';

export function ConsortiumSetupPage() {
  return (
    <CContainer fluid>
      <h1 className="mb-4">Configuración de Consorcios</h1>
      <CCard>
        <CCardHeader>Gestión de Unidades Funcionales</CCardHeader>
        <CCardBody>
          <UFManager />
        </CCardBody>
      </CCard>
    </CContainer>
  );
}
