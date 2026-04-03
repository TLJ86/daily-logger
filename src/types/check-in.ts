export type CheckIn = {
  id: string;
  user_id: string;
  check_in_date: string;
  weight: number;
  training_done: boolean;
  protein_hit: boolean;
  creatine_hit: boolean;
  steps: number;
  mood: number;
  energy: number;
  notes: string | null;
  created_at: string;
};

export type CheckInInsert = Omit<CheckIn, "id" | "created_at">;
