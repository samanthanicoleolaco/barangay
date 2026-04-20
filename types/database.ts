export type Medicine = {
  id: string;
  name: string;
  category: string | null;
  unit: string | null;
  quantity: number;
  reorder_level: number;
  expiry_date: string | null;
  created_at: string;
};

export type StockTransaction = {
  id: string;
  medicine_id: string;
  type: string;
  quantity: number;
  notes: string | null;
  created_at: string;
  medicine?: {
    name: string;
  };
};

export type HealthProgram = {
  id: string;
  name: string;
  date: string | null;
  status: 'upcoming' | 'ongoing' | 'completed';
  participants: number;
  created_at: string;
  medicines?: {
    medicine_id: string;
    quantity_needed: number;
    medicine: {
      name: string;
    };
  }[];
};
