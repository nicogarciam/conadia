import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/shared/config/supabase';
import { AppError } from '@/shared/middleware/error-handler';

interface ReportPaymentAIRequest {
  userId: string;
  functionalUnitId: string;
  file: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
  };
  manualData?: {
    amount?: number;
    transaction_id?: string;
    execution_date?: string;
  };
}

interface PaymentExtraction {
  amount: number;
  date: string;
  bank_issuer: string;
  transaction_id: string;
  confidence_score: number;
}

interface ReportPaymentAIResponse {
  extracted: PaymentExtraction;
  validated: boolean;
  matches_debt: boolean;
  requires_confirmation: boolean;
}

export const reportPaymentAIUseCase = {
  async execute(request: ReportPaymentAIRequest): Promise<ReportPaymentAIResponse> {
    const { userId, functionalUnitId, file, manualData } = request;

    // Initialize Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new AppError('Gemini API key not configured', 500);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    // Convert file to base64
    const base64Data = file.buffer.toString('base64');
    const mimeType = file.mimetype;

    // Prepare prompt for AI extraction
    const prompt = `Actúa como un experto contable. Analiza este comprobante de transferencia bancaria y devuelve ÚNICAMENTE un JSON válido con la siguiente estructura:
{
  "amount": número (monto exacto),
  "date": "ISO 8601 string",
  "bank_issuer": "string",
  "transaction_id": "string (CBU, UTR, número de operación)",
  "confidence_score": número entre 0 y 1
}

Extrae la información con la mayor precisión posible.`;

    try {
      // Call Gemini Vision API
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
      ]);

      const response = result.response;
      const text = response.text();
      
      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new AppError('Could not extract payment data from receipt', 400);
      }

      const extracted: PaymentExtraction = JSON.parse(jsonMatch[0]);

      // Get current debt for the functional unit
      const { data: unitDebt, error: debtError } = await supabase
        .from('functional_units')
        .select('*, uf_accounts(*)')
        .eq('id', functionalUnitId)
        .single();

      if (debtError || !unitDebt) {
        throw new AppError('Functional unit not found', 404);
      }

      // Calculate total debt
      const totalDebt = unitDebt.uf_accounts?.reduce(
        (sum: number, account: any) => sum + (account.balance || 0),
        0
      ) || 0;

      // Validate amount matches debt (with tolerance)
      const tolerance = 0.01; // 1 cent tolerance
      const matchesDebt = Math.abs(extracted.amount - totalDebt) <= tolerance;

      // Check for duplicate transaction ID
      if (extracted.transaction_id) {
        const { data: existingPayment, error: checkError } = await supabase
          .from('transactions')
          .select('id')
          .eq('transaction_id', extracted.transaction_id)
          .single();

        if (existingPayment) {
          throw new AppError('Transaction ID already exists', 409);
        }
      }

      // Determine if manual confirmation is required
      const requiresConfirmation = extracted.confidence_score < 0.8 || !matchesDebt;

      return {
        extracted,
        validated: extracted.confidence_score >= 0.8,
        matches_debt: matchesDebt,
        requires_confirmation: requiresConfirmation,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error processing payment receipt with AI', 500);
    }
  },
};
