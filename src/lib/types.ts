export type IngredientRow = {
  id: string;
  recipe_id: string;
  position: number;
  item_name: string;
  qty_text: string | null;
  unit: string | null;
  note: string | null;
  created_at: string;
};

export type Recipe = {
  id: string;
  user_id: string | null;
  slug: string;
  title: string;
  description: string | null;
  servings: number;
  prep_minutes: number;
  cook_minutes: number;
  image_cover_url: string | null;
  cuisine?: string | null;
  difficulty?: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  tags?: string[];
};

export type StepRow = {
  id: string;
  recipe_id: string;
  position: number;
  text: string;
  timer_seconds: number | null;
  created_at: string;
};
