<script lang="ts">
</script>

<svelte:head>
  <title>My Recipes</title>
  <meta name="description" content="Save and share your favorite dishes." />
</svelte:head>

<section class="card" style="text-align:center; padding: 28px 22px; margin-top: 10px;">
  <h1 class="page-title" style="margin-top:0;">🍳 My Recipes</h1>
  <p class="subtle" style="margin:0 0 16px;">Save and share your favorite dishes.</p>
  <div style="display:inline-flex; gap:10px; flex-wrap:wrap;">
    <a class="btn primary" href="/recipes">Browse</a>
    <a class="btn" href="/recipes/new">Add</a>
  </div>
</section>
