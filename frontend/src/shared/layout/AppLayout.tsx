import { Outlet, Link } from 'react-router-dom';
import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CImage,
  CNavItem,
  CNavLink,
  CButton,
} from '@coreui/react';
import { useAuth } from '../auth/AuthProvider';
import { useSidebar } from './useSidebar';

export function AppLayout() {
  const { user, signOut } = useAuth();
  const { sidebarShow, setSidebarShow } = useSidebar();

  return (
    <div className="wrapper">
      <CSidebar
        colorScheme="dark"
        visible={sidebarShow}
        onVisibleChange={setSidebarShow}
      >
        <CSidebarBrand>
          <CImage src="/logo.png" alt="Conadia" height={40} />
        </CSidebarBrand>
        <CSidebarNav>
          <CNavItem>
            <CNavLink component={Link} to="/dashboard">
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink component={Link} to="/consortium-setup">
              Configuración Consorcios
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink component={Link} to="/billing">
              Liquidación Expensas
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink component={Link} to="/owner">
              Portal Propietario
            </CNavLink>
          </CNavItem>
        </CSidebarNav>
        <CSidebarToggler />
      </CSidebar>
      <div className="body flex-grow-1 px-3">
        <CHeader>
          <CHeaderToggler
            onClick={() => setSidebarShow(!sidebarShow)}
            className="ps-1"
          />
          <CHeaderNav className="ms-auto">
            <CNavItem>
              <CNavLink>{user?.email}</CNavLink>
            </CNavItem>
            <CNavItem>
              <CButton color="secondary" variant="outline" onClick={signOut}>
                Cerrar Sesión
              </CButton>
            </CNavItem>
          </CHeaderNav>
        </CHeader>
        <CContainer fluid>
          <Outlet />
        </CContainer>
      </div>
    </div>
  );
}
