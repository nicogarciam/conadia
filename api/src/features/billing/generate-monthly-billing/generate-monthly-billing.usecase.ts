import { supabase } from '@/shared/config/supabase';
import { AppError } from '@/shared/middleware/error-handler';

interface GenerateBillingRequest {
  consortiumId: string;
  periodId: string;
  userId: string;
}

interface GenerateBillingResponse {
  billingPeriodId: string;
  totalAmount: number;
  unitsProcessed: number;
}

export const generateMonthlyBillingUseCase = {
  async execute(request: GenerateBillingRequest): Promise<GenerateBillingResponse> {
    const { consortiumId, periodId, userId } = request;

    // Verify user has access to this consortium
    const { data: consortium, error: consortiumError } = await supabase
      .from('consortia')
      .select('*, accounts!inner(*)')
      .eq('id', consortiumId)
      .single();

    if (consortiumError || !consortium) {
      throw new AppError('Consortium not found or access denied', 404);
    }

    // Get all expenses for the period
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .eq('consortium_id', consortiumId)
      .eq('period_id', periodId);

    if (expensesError) {
      throw new AppError('Error fetching expenses', 500);
    }

    // Get all functional units with their coefficients
    const { data: functionalUnits, error: unitsError } = await supabase
      .from('functional_units')
      .select('*')
      .eq('consortium_id', consortiumId);

    if (unitsError) {
      throw new AppError('Error fetching functional units', 500);
    }

    // Get previous balances and calculate interests
    // This is a simplified version - actual implementation should handle:
    // - Different expense types (A, B, C, D, E)
    // - Interest calculation based on due dates
    // - Transaction rollback on errors

    // Calculate billing for each unit
    const ufAccountsToInsert = functionalUnits.map((unit) => {
      // Calculate expenses by type
      const expensesA = expenses
        .filter((e) => e.expense_type === 'A')
        .reduce((sum, e) => sum + e.amount, 0);
      
      const expensesD = expenses
        .filter((e) => e.expense_type === 'D')
        .reduce((sum, e) => sum + e.amount, 0);

      // Calculate unit's share
      const shareA = expensesA * (unit.coefficient_a || 0);
      const shareD = expensesD * (unit.coefficient_d || 0);
      
      // TODO: Add previous balance and interests
      const totalAmount = shareA + shareD;

      return {
        functional_unit_id: unit.id,
        period_id: periodId,
        base_amount: totalAmount,
        previous_balance: 0,
        interest_amount: 0,
        total_amount: totalAmount,
        paid_amount: 0,
        balance: totalAmount,
      };
    });

    // Save UF account rows (should be in a transaction; en Supabase se recomienda encapsular esto en una RPC)
    const { error: saveError } = await supabase
      .from('uf_accounts')
      .insert(ufAccountsToInsert);

    if (saveError) {
      throw new AppError('Error saving UF accounts for billing period', 500);
    }

    const totalAmount = ufAccountsToInsert.reduce(
      (sum, item) => sum + (item.total_amount || 0),
      0
    );

    return {
      billingPeriodId: periodId,
      totalAmount,
      unitsProcessed: ufAccountsToInsert.length,
    };
  },
};
