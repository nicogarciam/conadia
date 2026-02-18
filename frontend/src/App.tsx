import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './shared/layout/AppLayout';
import { AuthProvider } from './shared/auth/AuthProvider';
import { ProtectedRoute } from './shared/auth/ProtectedRoute';
import { LoginPage } from './features/auth/pages/LoginPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { ConsortiumSetupPage } from './features/consortium-setup/pages/ConsortiumSetupPage';
import { BillingPage } from './features/billing/pages/BillingPage';
import { OwnerDashboardPage } from './features/owner-dashboard/pages/OwnerDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="consortium-setup" element={<ConsortiumSetupPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="owner" element={<OwnerDashboardPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
