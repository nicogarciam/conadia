import { supabase } from '@/shared/config/supabase';
import { AppError } from '@/shared/middleware/error-handler';

interface GetPlanLimitsRequest {
  accountId: string;
  userId: string;
}

interface PlanLimitsResponse {
  maxConsortia: number;
  currentConsortia: number;
  canCreateConsortium: boolean;
  planName: string;
  expiresAt: string | null;
}

export const getPlanLimitsUseCase = {
  async execute(request: GetPlanLimitsRequest): Promise<PlanLimitsResponse> {
    const { accountId, userId } = request;

    // Verify user has access to this account
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('*, subscription_plans(*)')
      .eq('id', accountId)
      .single();

    if (accountError || !account) {
      throw new AppError('Account not found', 404);
    }

    // Verify subscription is active
    const subscription = account.subscription_plans;
    if (!subscription) {
      throw new AppError('No active subscription plan', 403);
    }

    // Check if subscription is expired
    if (subscription.expires_at && new Date(subscription.expires_at) < new Date()) {
      throw new AppError('Subscription expired', 403);
    }

    // Count current consortia
    const { count, error: countError } = await supabase
      .from('consortia')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', accountId);

    if (countError) {
      throw new AppError('Error counting consortia', 500);
    }

    const currentConsortia = count || 0;
    const maxConsortia = subscription.max_consortia || 0;

    return {
      maxConsortia,
      currentConsortia,
      canCreateConsortium: currentConsortia < maxConsortia,
      planName: subscription.name || 'Unknown',
      expiresAt: subscription.expires_at,
    };
  },
};
