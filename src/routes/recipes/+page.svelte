<script lang="ts">
  import RecipeCard from '$lib/components/recipes/RecipeCard.svelte';

  export let data: { recipes: any[] };
  
  // Filter and search functionality
  let searchTerm = '';
  $: filteredRecipes = data.recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (recipe.description && recipe.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );
</script>

<section class="recipes-page">
  <div class="header-section">
    <h1 class="page-title">👩‍🍳Our Culinary Collection👨‍🍳</h1>
    <p class="page-subtitle">Discover recipes crafted with passion and precision</p>
    
    <div class="search-container">
      <input 
        type="text" 
        placeholder="Search recipes..." 
        bind:value={searchTerm}
        class="search-input"
      />
      <span class="search-icon">🍳</span>
    </div>
  </div>

  {#if !filteredRecipes.length}
    <div class="empty-state">
      <div class="empty-icon">🍳</div>
      <h3>No recipes found</h3>
      <!--p>{#if searchTerm}Try a different search term{else}Time to start creating culinary masterpieces{/if}</p-->
    </div>
  {:else}
    <div class="recipes-grid">
      {#each filteredRecipes as r}
        <RecipeCard recipe={r} />
      {/each}
    </div>
  {/if}
  
  <div class="pagination">
    <button class="pagination-btn">← Previous</button>
    <span class="pagination-info">Page 1 of 5</span>
    <button class="pagination-btn">Next →</button>
  </div>
</section>

<style>
  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background: linear-gradient(135deg, #fff9f9 0%, #f0f4f8 100%);
    color: #333;
    min-height: 100vh;
  }

  .recipes-page {
    max-width: 1400px;
    margin: 2rem auto;
    padding: 2rem;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .header-section {
    text-align: center;
    margin-bottom: 3rem;
    padding: 3rem 2rem;
    background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
    color: white;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
  }
  
  .header-section::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjAuNSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=');
    opacity: 0.2;
  }

  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    font-weight: 800;
    color: white;
    margin-bottom: 0.5rem;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .page-subtitle {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.9);
    max-width: 600px;
    margin: 0 auto 2rem;
    line-height: 1.6;
  }

  .search-container {
    position: relative;
    max-width: 500px;
    margin: 0 auto;
  }

  .search-input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border-radius: 50px;
    border: none;
    font-size: 1rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .search-input:focus {
    outline: none;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .search-icon {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.25rem;
    color: #718096;
  }

  .recipes-grid {
    display: grid;
    gap: 2.5rem;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    padding: 2rem;
  }

  .empty-state {
    text-align: center;
    padding: 5rem 2rem;
    background: #f1f5f9;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
    margin: 2rem;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    opacity: 0.7;
  }

  .empty-state h3 {
    font-size: 2rem;
    color: #4a5568;
    margin-bottom: 0.75rem;
  }

  .empty-state p {
    color: #718096;
    font-size: 1.1rem;
    max-width: 500px;
    margin: 0 auto;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
  }

  .pagination-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    border: none;
    background: #e2e8f0;
    color: #4a5568;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .pagination-btn:hover {
    background: #cbd5e0;
    transform: translateY(-2px);
  }

  .pagination-info {
    font-weight: 500;
    color: #718096;
  }

  @media (max-width: 768px) {
    .recipes-page {
      padding: 1rem;
      margin: 1rem;
      border-radius: 16px;
    }
    
    .header-section {
      padding: 2rem 1rem;
    }
    
    .page-title {
      font-size: 2.5rem;
    }
    
    .page-subtitle {
      font-size: 1.1rem;
    }
    
    .recipes-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      padding: 1.5rem;
    }
    
    .search-input {
      padding: 0.8rem 0.8rem 0.8rem 2.5rem;
      font-size: 0.9rem;
    }
    
    .search-icon {
      left: 1rem;
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .recipes-grid {
      grid-template-columns: 1fr;
    }
    
    .pagination {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>