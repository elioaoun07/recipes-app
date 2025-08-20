import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    console.log('Request received');
    const supabase = locals.supabase;
    if (!supabase) {
      console.error('Supabase client not available');
      return new Response(JSON.stringify({ message: 'Supabase client not available on server' }), { status: 500 });
    }

    const body = await request.json();
    console.log('Request body:', body);

    if (!body.text) {
      console.error('Missing text in request body');
      return new Response(JSON.stringify({ message: 'Missing text in request body' }), { status: 400 });
    }

    console.log('Processing request...');
    
    // Extract the SQL from the text
    const sqlText = body.text.trim();
    
    try {
      // Try to execute the SQL directly via Supabase's rpc function
      console.log('Executing SQL via Supabase...');
      const { error } = await supabase.rpc('execute_sql', { sql_string: sqlText });
      
      if (error) {
        console.error('SQL execution error:', error);
        // If RPC fails, try alternative approach
        return await parseAndInsertRecipe(sqlText, supabase);
      }
      
      console.log('SQL executed successfully');
      return new Response(JSON.stringify({ message: 'Recipe added successfully' }), { status: 200 });
    } catch (sqlError) {
      console.error('SQL execution failed, trying alternative approach:', sqlError);
      return await parseAndInsertRecipe(sqlText, supabase);
    }
  } catch (e: any) {
    console.error('Unexpected error:', e);
    return new Response(JSON.stringify({ message: e.message || 'Server error' }), { status: 500 });
  }
};

// Helper function for the alternative approach
async function parseAndInsertRecipe(sqlText: string, supabase: any) {
  try {
    console.log('Processing request using API calls...');
    
    // Extract recipe data from the SQL using regex
    const titleMatch = sqlText.match(/title[^']*'([^']+)'/);
    const slugMatch = sqlText.match(/slug[^']*'([^']+)'/);
    const descMatch = sqlText.match(/description[^']*'([^']+)'/);
    const servingsMatch = sqlText.match(/servings[^,]*,\s*(\d+)/);
    
    if (titleMatch && slugMatch) {
      // Insert the recipe first
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          title: titleMatch[1],
          slug: slugMatch[1],
          description: descMatch ? descMatch[1] : null,
          servings: servingsMatch ? parseInt(servingsMatch[1], 10) : 1,
          is_public: true
        })
        .select('id, title')
        .single();
        
      if (recipeError) {
        console.error('Recipe insert failed:', recipeError);
        throw new Error(`Recipe insert failed: ${recipeError.message}`);
      }
      
      console.log('Recipe inserted:', recipe);
      return new Response(JSON.stringify({ 
        message: 'Recipe added successfully', 
        id: recipe.id,
        title: recipe.title
      }), { status: 200 });
    } else {
      throw new Error('Could not parse recipe data from SQL');
    }
  } catch (err: any) {
    console.error('Error in alternative approach:', err);
    return new Response(JSON.stringify({ 
      message: 'Failed to process recipe', 
      error: err.message 
    }), { status: 400 });
  }
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}