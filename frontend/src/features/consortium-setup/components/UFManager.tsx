import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
} from '@coreui/react';
import { useState } from 'react';
import { useFunctionalUnits } from '../hooks/useFunctionalUnits';
import { FunctionalUnit } from '../types';

export function UFManager() {
  const [showModal, setShowModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<FunctionalUnit | null>(null);
  const { data: units, isLoading } = useFunctionalUnits();

  const handleEdit = (unit: FunctionalUnit) => {
    setEditingUnit(unit);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingUnit(null);
  };

  return (
    <>
      <div className="mb-3">
        <CButton color="primary" onClick={() => setShowModal(true)}>
          Agregar Unidad Funcional
        </CButton>
      </div>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Piso</CTableHeaderCell>
            <CTableHeaderCell>Unidad</CTableHeaderCell>
            <CTableHeaderCell>M²</CTableHeaderCell>
            <CTableHeaderCell>Coef. A</CTableHeaderCell>
            <CTableHeaderCell>Coef. D</CTableHeaderCell>
            <CTableHeaderCell>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {isLoading ? (
            <CTableRow>
              <CTableDataCell colSpan={6}>Cargando...</CTableDataCell>
            </CTableRow>
          ) : units?.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={6}>No hay unidades funcionales</CTableDataCell>
            </CTableRow>
          ) : (
            units?.map((unit) => (
              <CTableRow key={unit.id}>
                <CTableDataCell>{unit.floor}</CTableDataCell>
                <CTableDataCell>{unit.unit}</CTableDataCell>
                <CTableDataCell>{unit.square_meters}</CTableDataCell>
                <CTableDataCell>{unit.coefficient_a}</CTableDataCell>
                <CTableDataCell>{unit.coefficient_d || '-'}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="primary" size="sm" onClick={() => handleEdit(unit)}>
                    Editar
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>

      <CModal visible={showModal} onClose={handleClose}>
        <CModalHeader>
          <CModalTitle>
            {editingUnit ? 'Editar' : 'Nueva'} Unidad Funcional
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Piso</CFormLabel>
            <CFormInput type="text" defaultValue={editingUnit?.floor || ''} />
            <CFormLabel>Unidad</CFormLabel>
            <CFormInput type="text" defaultValue={editingUnit?.unit || ''} />
            <CFormLabel>Metros Cuadrados</CFormLabel>
            <CFormInput type="number" defaultValue={editingUnit?.square_meters || ''} />
            <CFormLabel>Coeficiente A</CFormLabel>
            <CFormInput type="number" step="0.000001" defaultValue={editingUnit?.coefficient_a || ''} />
            <CFormLabel>Coeficiente D (Opcional)</CFormLabel>
            <CFormInput type="number" step="0.000001" defaultValue={editingUnit?.coefficient_d || ''} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleClose}>
            Cancelar
          </CButton>
          <CButton color="primary">Guardar</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}
