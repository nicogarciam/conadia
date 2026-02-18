import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react';
import { PaymentReportForm } from '../components/PaymentReportForm';

export function OwnerDashboardPage() {
  return (
    <CContainer fluid>
      <h1 className="mb-4">Portal del Propietario</h1>
      <CRow className="mb-4">
        <CCol xs={12} md={6} lg={3}>
          <CCard className="mb-3 border-top border-top-3 border-top-danger">
            <CCardHeader>Saldo Total Adeudado</CCardHeader>
            <CCardBody className="fs-3 fw-semibold">$0</CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6} lg={3}>
          <CCard className="mb-3 border-top border-top-3 border-top-info">
            <CCardHeader>Mis Unidades</CCardHeader>
            <CCardBody className="fs-3 fw-semibold">0</CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12} lg={6}>
          <CCard>
            <CCardHeader>Informar Pago</CCardHeader>
            <CCardBody>
              <PaymentReportForm />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} lg={6}>
          <CCard>
            <CCardHeader>Historial de Liquidaciones</CCardHeader>
            <CCardBody>
              <p>Historial en desarrollo...</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}
