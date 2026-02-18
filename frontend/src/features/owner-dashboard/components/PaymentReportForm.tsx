import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CAlert,
  CSpinner,
} from '@coreui/react';
import { apiClient } from '@/shared/config/api';

const paymentSchema = z.object({
  functional_unit_id: z.string().uuid(),
  receipt: z.instanceof(FileList).refine((files) => files.length > 0, 'Debe seleccionar un archivo'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export function PaymentReportForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const onSubmit = async (data: PaymentFormData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('receipt', data.receipt[0]);
      formData.append('functional_unit_id', data.functional_unit_id);

      const response = await apiClient.post('/payments/report-ai', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CForm onSubmit={handleSubmit(onSubmit)}>
      {error && <CAlert color="danger">{error}</CAlert>}
      
      {result && (
        <CAlert color="info">
          <strong>Datos extraídos:</strong>
          <ul>
            <li>Monto: ${result.extracted?.amount}</li>
            <li>Fecha: {result.extracted?.date}</li>
            <li>Banco: {result.extracted?.bank_issuer}</li>
            <li>ID Transacción: {result.extracted?.transaction_id}</li>
          </ul>
          {result.requires_confirmation && (
            <CButton color="primary" className="mt-2">
              Confirmar Pago
            </CButton>
          )}
        </CAlert>
      )}

      <div className="mb-3">
        <CFormLabel>Unidad Funcional ID</CFormLabel>
        <CFormInput
          type="text"
          {...register('functional_unit_id')}
          invalid={!!errors.functional_unit_id}
        />
        {errors.functional_unit_id && (
          <div className="invalid-feedback">{errors.functional_unit_id.message}</div>
        )}
      </div>

      <div className="mb-3">
        <CFormLabel>Comprobante de Pago</CFormLabel>
        <CFormInput
          type="file"
          accept="image/*,.pdf"
          {...register('receipt')}
          invalid={!!errors.receipt}
        />
        {errors.receipt && (
          <div className="invalid-feedback">{errors.receipt.message}</div>
        )}
      </div>

      <CButton type="submit" color="primary" disabled={loading}>
        {loading ? <CSpinner size="sm" /> : 'Procesar con IA'}
      </CButton>
    </CForm>
  );
}
