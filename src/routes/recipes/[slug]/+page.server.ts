import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase/client';
import type { Recipe, IngredientRow, StepRow } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  const { data: recipe, error: rErr } = await supabase
    .from('recipes')
    .select('id,slug,title,description,image_cover_url,servings,prep_minutes,cook_minutes,is_public')
    .eq('slug', slug)
    .single<Recipe>();

  if (rErr || !recipe) {
    return { recipe: null, ingredients: [] };
  }

  const { data: ingredients } = await supabase
    .from('recipe_ingredients')
    .select('*')
    .eq('recipe_id', recipe.id)
    .order('position');

  const { data: steps } = await supabase
    .from('recipe_steps')
    .select('*')
    .eq('recipe_id', recipe.id)
    .order('position');

  return {
    recipe,
    ingredients: (ingredients ?? []) as IngredientRow[],
    steps: (steps ?? []) as StepRow[]
  };
};
