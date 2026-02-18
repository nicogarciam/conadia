// This file SHOULD be generated from Supabase CLI:
// npx supabase gen types typescript --project-id <your-project-id> > src/shared/config/database.types.ts
//
// Mientras tanto, este placeholder permite compilar aunque falten tablas/relaciones.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      [table: string]: {
        Row: Record<string, any>;
        Insert: Record<string, any>;
        Update: Record<string, any>;
        Relationships?: any[];
      };
    };
    Views: {
      [view: string]: any;
    };
    Functions: {
      [fn: string]: any;
    };
    Enums: {
      [e: string]: any;
    };
    CompositeTypes?: {
      [t: string]: any;
    };
  };
}
