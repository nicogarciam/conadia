import { CContainer, CCard, CCardHeader, CCardBody, CButton } from '@coreui/react';

export function BillingPage() {
  return (
    <CContainer fluid>
      <h1 className="mb-4">Liquidación de Expensas</h1>
      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <span>Generar Liquidación Mensual</span>
            <CButton color="primary">Nueva Liquidación</CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <p>Funcionalidad de liquidación en desarrollo...</p>
        </CCardBody>
      </CCard>
    </CContainer>
  );
}
