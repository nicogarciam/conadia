import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CContainer, CCard, CCardBody, CForm, CFormInput, CButton, CAlert } from '@coreui/react';
import { supabase } from '@/shared/config/supabase';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CContainer className="d-flex align-items-center justify-content-center min-vh-100">
      <CCard style={{ width: '400px' }}>
        <CCardBody>
          <h2 className="text-center mb-4">Conadia</h2>
          <CForm onSubmit={handleLogin}>
            {error && <CAlert color="danger">{error}</CAlert>}
            <CFormInput
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-3"
            />
            <CFormInput
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mb-3"
            />
            <CButton type="submit" color="primary" className="w-100" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  );
}
