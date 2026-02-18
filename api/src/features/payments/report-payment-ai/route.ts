import { Router } from 'express';
import { authenticate, AuthRequest } from '@/shared/middleware/auth';
import { reportPaymentAIUseCase } from './report-payment-ai.usecase';
import { z } from 'zod';
import { validateRequest } from '@/shared/utils/validation';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const bodySchema = z.object({
  body: z.object({
    functional_unit_id: z.string().uuid(),
    amount: z.number().optional(),
    transaction_id: z.string().optional(),
    execution_date: z.string().optional(),
  }),
});

router.post(
  '/report-ai',
  authenticate,
  upload.single('receipt'),
  validateRequest(bodySchema),
  async (req: AuthRequest, res, next) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { functional_unit_id, amount, transaction_id, execution_date } = req.body;
      
      const result = await reportPaymentAIUseCase.execute({
        userId: req.user!.id,
        functionalUnitId: functional_unit_id,
        file: {
          buffer: file.buffer,
          mimetype: file.mimetype,
          originalname: file.originalname,
        },
        manualData: {
          amount,
          transaction_id,
          execution_date,
        },
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
