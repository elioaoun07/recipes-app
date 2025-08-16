import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase/client';
import type { Recipe } from '$lib/types';

export const load: PageServerLoad = async () => {
  const { data: recipes } = await supabase
    .from('recipes')
    .select('id,slug,title,description,image_cover_url,servings,prep_minutes,cook_minutes,is_public')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  return { recipes: (recipes ?? []) as Recipe[] };
};
