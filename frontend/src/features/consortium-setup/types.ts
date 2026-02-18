export interface FunctionalUnit {
  id: string;
  consortium_id: string;
  floor: string;
  unit: string;
  square_meters: number;
  coefficient_a: number;
  coefficient_d: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}
