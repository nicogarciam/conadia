import { CCard, CCardBody, CCardHeader, CContainer, CRow, CCol } from '@coreui/react';

export function DashboardPage() {
  return (
    <CContainer fluid>
      <h1 className="mb-4">Dashboard</h1>
      <CRow>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="mb-3 border-top border-top-3 border-top-primary">
            <CCardHeader>Consorcios Activos</CCardHeader>
            <CCardBody className="fs-3 fw-semibold">0</CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="mb-3 border-top border-top-3 border-top-success">
            <CCardHeader>Expensas del Mes</CCardHeader>
            <CCardBody className="fs-3 fw-semibold">$0</CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="mb-3 border-top border-top-3 border-top-warning">
            <CCardHeader>Morosidad</CCardHeader>
            <CCardBody className="fs-3 fw-semibold">0%</CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="mb-3 border-top border-top-3 border-top-info">
            <CCardHeader>Propietarios</CCardHeader>
            <CCardBody className="fs-3 fw-semibold">0</CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}
