-- Esquema de Base de Datos para Sistema de Gestión de Consorcios
-- Este archivo es una referencia para crear las tablas en Supabase
-- Ejecutar en el SQL Editor de Supabase

-- Tabla de Planes de Suscripción
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE, -- 'Bronce', 'Plata', 'Oro'
  max_consortia INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Cuentas (Accounts)
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subscription_plan_id UUID REFERENCES subscription_plans(id),
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Consorcios
CREATE TABLE consortia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  cuit VARCHAR(20),
  bank_account_number VARCHAR(50),
  interest_rate DECIMAL(5, 2) DEFAULT 2.0, -- Tasa de interés punitorio mensual
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Unidades Funcionales (UF)
CREATE TABLE functional_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consortium_id UUID NOT NULL REFERENCES consortia(id) ON DELETE CASCADE,
  floor VARCHAR(10) NOT NULL,
  unit VARCHAR(10) NOT NULL,
  square_meters DECIMAL(10, 2) NOT NULL,
  coefficient_a DECIMAL(10, 6) NOT NULL, -- Coeficiente para gastos tipo A
  coefficient_d DECIMAL(10, 6), -- Coeficiente para gastos tipo D (cocheras)
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(consortium_id, floor, unit)
);

-- Tabla de Propietarios
CREATE TABLE owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  document_number VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Relación Propietario-Unidad Funcional (N:M con porcentaje de titularidad)
CREATE TABLE owner_functional_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  functional_unit_id UUID NOT NULL REFERENCES functional_units(id) ON DELETE CASCADE,
  ownership_percentage DECIMAL(5, 2) NOT NULL DEFAULT 100.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(owner_id, functional_unit_id),
  CHECK (ownership_percentage > 0 AND ownership_percentage <= 100)
);

-- Tabla de Períodos de Liquidación
CREATE TABLE billing_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consortium_id UUID NOT NULL REFERENCES consortia(id) ON DELETE CASCADE,
  period_month INTEGER NOT NULL CHECK (period_month >= 1 AND period_month <= 12),
  period_year INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'generated', 'closed'
  generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(consortium_id, period_month, period_year)
);

-- Tabla de Gastos
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consortium_id UUID NOT NULL REFERENCES consortia(id) ON DELETE CASCADE,
  period_id UUID REFERENCES billing_periods(id),
  expense_type VARCHAR(1) NOT NULL CHECK (expense_type IN ('A', 'B', 'C', 'D', 'E')),
  category VARCHAR(100) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  provider_name VARCHAR(255),
  invoice_number VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Cuentas de Unidades Funcionales (Saldos y Deudas)
CREATE TABLE uf_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  functional_unit_id UUID NOT NULL REFERENCES functional_units(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES billing_periods(id) ON DELETE CASCADE,
  base_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  previous_balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  interest_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  due_date DATE,
  first_due_date DATE,
  second_due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(functional_unit_id, period_id)
);

-- Tabla de Transacciones (Ingresos y Egresos)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consortium_id UUID NOT NULL REFERENCES consortia(id) ON DELETE CASCADE,
  functional_unit_id UUID REFERENCES functional_units(id),
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('income', 'expense')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL,
  transaction_id VARCHAR(100), -- UTR, número de operación bancaria
  bank_account VARCHAR(50),
  ai_validated BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Solicitudes de Plan de Pago
CREATE TABLE payment_plan_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  functional_unit_id UUID NOT NULL REFERENCES functional_units(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  number_of_installments INTEGER NOT NULL,
  interest_rate DECIMAL(5, 2),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Notificaciones
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consortium_id UUID REFERENCES consortia(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES owners(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'billing', 'payment', 'announcement', 'reminder'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Auditoría
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_consortia_account_id ON consortia(account_id);
CREATE INDEX idx_functional_units_consortium_id ON functional_units(consortium_id);
CREATE INDEX idx_uf_accounts_functional_unit_id ON uf_accounts(functional_unit_id);
CREATE INDEX idx_uf_accounts_period_id ON uf_accounts(period_id);
CREATE INDEX idx_expenses_consortium_id ON expenses(consortium_id);
CREATE INDEX idx_expenses_period_id ON expenses(period_id);
CREATE INDEX idx_transactions_consortium_id ON transactions(consortium_id);
CREATE INDEX idx_transactions_functional_unit_id ON transactions(functional_unit_id);
CREATE INDEX idx_transactions_transaction_id ON transactions(transaction_id);
CREATE INDEX idx_owner_functional_units_owner_id ON owner_functional_units(owner_id);
CREATE INDEX idx_owner_functional_units_functional_unit_id ON owner_functional_units(functional_unit_id);

-- Row Level Security (RLS) Policies
-- Habilitar RLS en todas las tablas
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE consortia ENABLE ROW LEVEL SECURITY;
ALTER TABLE functional_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_functional_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE uf_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_plan_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de ejemplo (ajustar según necesidades)
-- Los administradores pueden ver sus propias cuentas
CREATE POLICY "Users can view their own accounts"
  ON accounts FOR SELECT
  USING (auth.uid() = owner_id);

-- Los administradores pueden ver consorcios de sus cuentas
CREATE POLICY "Users can view consortia from their accounts"
  ON consortia FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = consortia.account_id
      AND accounts.owner_id = auth.uid()
    )
  );

-- Los propietarios pueden ver sus propias unidades funcionales
CREATE POLICY "Owners can view their functional units"
  ON functional_units FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM owner_functional_units
      JOIN owners ON owners.id = owner_functional_units.owner_id
      WHERE owner_functional_units.functional_unit_id = functional_units.id
      AND owners.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );
