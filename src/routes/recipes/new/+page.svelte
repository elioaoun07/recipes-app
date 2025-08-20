<script lang="ts">
  import { onMount } from 'svelte';
  let name = '';
  let servings: number | '' = '';
  let special = '';
  let copied = false;
  let status = '';
  let paste = ''; // ChatGPT output pasted here
  let busy = false;

  // Store the schema text locally so the prompt can be self-contained
  // You can replace this with your latest JSON schema if it changes.
  const schemaJson = `[
  {"table_name":"favorites","column_name":"user_id","data_type":"uuid","is_nullable":"NO","column_default":null},
  {"table_name":"favorites","column_name":"recipe_id","data_type":"uuid","is_nullable":"NO","column_default":null},
  {"table_name":"favorites","column_name":"created_at","data_type":"timestamp with time zone","is_nullable":"NO","column_default":"now()"},
  {"table_name":"ratings","column_name":"user_id","data_type":"uuid","is_nullable":"NO","column_default":null},
  {"table_name":"ratings","column_name":"recipe_id","data_type":"uuid","is_nullable":"NO","column_default":null},
  {"table_name":"ratings","column_name":"rating","data_type":"smallint","is_nullable":"NO","column_default":null},
  {"table_name":"ratings","column_name":"note","data_type":"text","is_nullable":"YES","column_default":null},
  {"table_name":"ratings","column_name":"created_at","data_type":"timestamp with time zone","is_nullable":"NO","column_default":"now()"},
  {"table_name":"ratings","column_name":"updated_at","data_type":"timestamp with time zone","is_nullable":"NO","column_default":"now()"},
  {"table_name":"recipe_images","column_name":"id","data_type":"uuid","is_nullable":"NO","column_default":"gen_random_uuid()"},
  {"table_name":"recipe_images","column_name":"recipe_id","data_type":"uuid","is_nullable":"NO","column_default":null},
  {"table_name":"recipe_images","column_name":"url","data_type":"text","is_nullable":"NO","column_default":null},
  {"table_name":"recipe_images","column_name":"position","data_type":"integer","is_nullable":"NO","column_default":"1"},
  {"table_name":"recipe_images","column_name":"alt","data_type":"text","is_nullable":"YES","column_default":null},
  {"table_name":"recipe_images","column_name":"created_at","data_type":"timestamp with time zone","is_nullable":"NO","column_default":"now()"},
  {"table_name":"recipe_ingredients","column_name":"id","data_type":"uuid","is_nullable":"NO","column_default":"gen_random_uuid()"},
  {"table_name":"recipe_ingredients","column_name":"recipe_id","data_type":"uuid","is_nullable":"NO","column_default":null},
  {"table_name":"recipe_ingredients","column_name":"position","data_type":"integer","is_nullable":"NO","column_default":null},
  {"table_name":"recipe_ingredients","column_name":"item_name","data_type":"text","is_nullable":"NO","column_default":null},
  {"table_name":"recipe_ingredients","column_name":"qty_text","data_type":"text","is_nullable":"YES","column_default":null},
  {"table_name":"recipe_ingredients","column_name":"unit","data_type":"text","is_nullable":"YES","column_default":null},
  {"table_name":"recipe_ingredients","column_name":"note","data_type":"text","is_nullable":"YES","column_default":null},
  {"table_name":"recipe_ingredients","column_name":"created_at","data_type":"timestamp with time zone","is_nullable":"NO","column_default":"now()"},
  {"table_name":"recipe_steps","column_name":"id","data_type":"uuid","is_nullable":"NO","column_default":"gen_random_uuid()"},
  {"table_name":"recipe_steps","column_name":"recipe_id","data_type":"uuid","is_nullable":"NO","column_default":null},
  {"table_name":"recipe_steps","column_name":"position","data_type":"integer","is_nullable":"NO","column_default":null},
  {"table_name":"recipe_steps","column_name":"text","data_type":"text","is_nullable":"NO","column_default":null},
  {"table_name":"recipe_steps","column_name":"timer_seconds","data_type":"integer","is_nullable":"YES","column_default":null},
  {"table_name":"recipe_steps","column_name":"created_at","data_type":"timestamp with time zone","is_nullable":"NO","column_default":"now()"},
  {"table_name":"recipe_tags","column_name":"recipe_id","data_type":"uuid","is_nullable":"NO","column_default":null},
  {"table_name":"recipe_tags","column_name":"tag_id","data_type":"uuid","is_nullable":"NO","column_default":null},
  {"table_name":"recipe_utensils","column_name":"recipe_id","data_type":"uuid","is_nullable":"NO","column_default":null},
  {"table_name":"recipe_utensils","column_name":"utensil_id","data_type":"uuid","is_nullable":"NO","column_default":null},
  {"table_name":"recipes","column_name":"id","data_type":"uuid","is_nullable":"NO","column_default":"gen_random_uuid()"},
  {"table_name":"recipes","column_name":"user_id","data_type":"uuid","is_nullable":"YES","column_default":null},
  {"table_name":"recipes","column_name":"title","data_type":"text","is_nullable":"NO","column_default":null},
  {"table_name":"recipes","column_name":"slug","data_type":"text","is_nullable":"YES","column_default":null},
  {"table_name":"recipes","column_name":"description","data_type":"text","is_nullable":"YES","column_default":null},
  {"table_name":"recipes","column_name":"servings","data_type":"integer","is_nullable":"NO","column_default":null},
  {"table_name":"recipes","column_name":"cuisine","data_type":"text","is_nullable":"YES","column_default":null},
  {"table_name":"recipes","column_name":"difficulty","data_type":"text","is_nullable":"YES","column_default":null},
  {"table_name":"recipes","column_name":"source_url","data_type":"text","is_nullable":"YES","column_default":null},
  {"table_name":"recipes","column_name":"language","data_type":"text","is_nullable":"YES","column_default":null},
  {"table_name":"recipes","column_name":"is_public","data_type":"boolean","is_nullable":"NO","column_default":"false"},
  {"table_name":"recipes","column_name":"created_at","data_type":"timestamp with time zone","is_nullable":"NO","column_default":"now()"},
  {"table_name":"recipes","column_name":"updated_at","data_type":"timestamp with time zone","is_nullable":"NO","column_default":"now()"},
  {"table_name":"recipes","column_name":"prep_minutes","data_type":"integer","is_nullable":"NO","column_default":"0"},
  {"table_name":"recipes","column_name":"cook_minutes","data_type":"integer","is_nullable":"NO","column_default":"0"},
  {"table_name":"recipes","column_name":"image_cover_url","data_type":"text","is_nullable":"YES","column_default":null},
  {"table_name":"tags","column_name":"id","data_type":"uuid","is_nullable":"NO","column_default":"gen_random_uuid()"},
  {"table_name":"tags","column_name":"name","data_type":"text","is_nullable":"NO","column_default":null},
  {"table_name":"tags","column_name":"kind","data_type":"text","is_nullable":"NO","column_default":"'tag'::text"},
  {"table_name":"utensils","column_name":"id","data_type":"uuid","is_nullable":"NO","column_default":"gen_random_uuid()"},
  {"table_name":"utensils","column_name":"name","data_type":"text","is_nullable":"NO","column_default":null},
  {"table_name":"utensils","column_name":"icon","data_type":"text","is_nullable":"YES","column_default":null}
]`;

  function makePrompt() {
    const nm = name.trim();
    const sv = typeof servings === 'number' ? servings : parseInt(String(servings || '0'), 10) || 0;
    const sp = special.trim();
    const guidance = `You are an expert Postgres/Supabase SQL author. Based on the database schema below, generate SQL that inserts a new recipe and its related rows (ingredients, steps, tags, utensils, images). Return also an APP_JSON payload I can parse.

Input:
- Recipe Name: ${nm}
- Servings: ${sv}
- Special Instructions (free-form, includes ingredients, steps, tags, cuisine, difficulty, language, timers etc): ${sp}

Requirements:
- Insert into public.recipes with: title, slug (kebab-case from title), description (short from instructions), servings, cuisine, difficulty, language, is_public=true, prep_minutes=0 if unknown, cook_minutes=0 if unknown, image_cover_url if obvious (else omit).
- Insert ingredients into public.recipe_ingredients (position starting at 1).
- Insert steps into public.recipe_steps (position 1..n, timer_seconds if present, else null).
- If tags are present, upsert into public.tags(kind='tag'), then public.recipe_tags.
- If utensils present, upsert into public.utensils(name, icon if provided), then public.recipe_utensils.
- If an image URL is given, insert into public.recipe_images (position=1).
- Provide a single SQL block that is valid in Supabase SQL Editor (you may use DO $$ with a rid uuid if you need cross-table inserts).
- ALSO provide an APP_JSON fenced block with exactly:
APP_JSON:
\`\`\`json
{
  "recipe": { "title": "...", "slug": "...", "description": "...", "servings": 4, "cuisine": "International", "difficulty": "Easy", "language": "en", "is_public": true, "prep_minutes": 0, "cook_minutes": 0, "image_cover_url": null },
  "ingredients": [ { "position": 1, "item_name": "...", "qty_text": "...", "unit": null, "note": null } ],
  "steps": [ { "position": 1, "text": "...", "timer_seconds": null } ],
  "tags": [ "Vegetarian" ],
  "utensils": [ { "name": "Baking dish", "icon": "🍲" } ]
}
\`\`\`

Schema (array of columns):
${schemaJson}
`;

    return guidance;
  }

  async function copyPrompt() {
    copied = false;
    const prompt = makePrompt();
    await navigator.clipboard.writeText(prompt);
    copied = true;
    status = "Prompt copied. Paste into ChatGPT.";
    setTimeout(() => (copied = false), 2000);
  }

  async function submitChatGPTResult() {
    try {
      busy = true;
      status = 'Parsing and inserting...';
      const res = await fetch('/api/recipes/ingest-sql', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: paste })
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.message || 'Insert failed');
      status = `Added recipe: ${out.title}`;
      paste = '';
    } catch (e: any) {
      status = `Error: ${e.message}`;
    } finally {
      busy = false;
    }
  }
</script>

<section class="new-recipe">
  <h1>Add a new recipe</h1>
  <form on:submit|preventDefault={copyPrompt} class="form">
    <label>
      Recipe Name
      <input required bind:value={name} placeholder="e.g., Creamy Veggie Bake" />
    </label>
    <label>
      Servings
      <input required type="number" min="1" bind:value={servings} placeholder="4" />
    </label>
    <label>
      Special Instructions
      <textarea rows="8" bind:value={special} placeholder="Ingredients, steps, tags, cuisine, difficulty, timers..."></textarea>
    </label>

    <button type="submit">Copy Prompt for ChatGPT</button>
    {#if copied}<span class="ok">Copied</span>{/if}
  </form>

  <div class="paste">
    <h2>Paste ChatGPT result</h2>
    <textarea rows="12" bind:value={paste} placeholder="Paste ChatGPT output here (includes APP_JSON)"></textarea>
    <button disabled={busy || !paste.trim()} on:click={submitChatGPTResult}>
      {busy ? 'Working...' : 'Add to Supabase'}
    </button>
  </div>

  {#if status}<div class="status">{status}</div>{/if}
</section>

<style>
  .new-recipe { max-width: 800px; margin: 1.5rem auto; padding: 1rem; }
  h1 { margin-bottom: .75rem; }
  .form { display: grid; gap: .75rem; }
  label { display: grid; gap: .35rem; }
  input, textarea { padding: .6rem .7rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1rem; }
  button { margin-top: .25rem; background: #111827; color: #fff; border: 1px solid #111827; border-radius: 8px; padding: .55rem .9rem; cursor: pointer; }
  button:disabled { opacity: .6; cursor: not-allowed; }
  .ok { margin-left: .5rem; color: #059669; font-weight: 600; }
  .paste { margin-top: 1rem; display: grid; gap: .5rem; }
  .status { margin-top: .75rem; font-size: .95rem; color: #374151; }
</style>