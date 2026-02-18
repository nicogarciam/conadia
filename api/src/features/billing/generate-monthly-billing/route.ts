import { Router } from 'express';
import { authenticate, AuthRequest } from '@/shared/middleware/auth';
import { generateMonthlyBillingUseCase } from './generate-monthly-billing.usecase';
import { z } from 'zod';
import { validateRequest } from '@/shared/utils/validation';

const router = Router();

const bodySchema = z.object({
  body: z.object({
    consortium_id: z.string().uuid(),
    period_id: z.string().uuid(),
  }),
});

router.post(
  '/generate',
  authenticate,
  validateRequest(bodySchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { consortium_id, period_id } = req.body;
      const result = await generateMonthlyBillingUseCase.execute({
        consortiumId: consortium_id,
        periodId: period_id,
        userId: req.user!.id,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
