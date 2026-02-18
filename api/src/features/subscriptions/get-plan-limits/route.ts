import { Router } from 'express';
import { authenticate, AuthRequest } from '@/shared/middleware/auth';
import { getPlanLimitsUseCase } from './get-plan-limits.usecase';
import { z } from 'zod';
import { validateRequest } from '@/shared/utils/validation';

const router = Router();

const querySchema = z.object({
  query: z.object({
    account_id: z.string().uuid(),
  }),
});

router.get(
  '/plan-limits',
  authenticate,
  validateRequest(querySchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { account_id } = req.query as { account_id: string };
      const result = await getPlanLimitsUseCase.execute({
        accountId: account_id,
        userId: req.user!.id,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
