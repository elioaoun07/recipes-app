<script lang="ts">
  import TagPill from './TagPill.svelte';

  export let recipe: {
    id: string;
    slug?: string;
    title: string;
    description: string | null;
    image_cover_url: string | null;
    tags?: string[];
    servings?: number;
    prep_minutes?: number;
    cook_minutes?: number;
  };

  $: total = (recipe.prep_minutes ?? 0) + (recipe.cook_minutes ?? 0);
  
  // Placeholder image function
  function getPlaceholderImage() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iOTAiIGZpbGw9IiMxYTFhMWYiLz48dGV4dCB4PSI2MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2EwYWVjMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZvb2QgUGhvZ3JhcGh5PC90ZXh0Pjwvc3ZnPg==';
  }

  // Function to determine card intensity based on cooking time
  $: intensity = Math.min(100, Math.max(20, total));
  $: intensityColor = `hsl(${120 - (intensity * 0.6)}, 70%, 50%)`;
</script>

<a 
  class="recipe-card" 
  href={`/recipes/${recipe.slug ?? recipe.id}`} 
  style="--intensity-color: {intensityColor};"
>
  <div class="card-3d-wrapper">
    <div class="card-3d">
      <div class="card-image">
        {#if recipe.image_cover_url}
          <img 
            src={recipe.image_cover_url} 
            alt={recipe.title} 
            class="cover" 
            loading="lazy"
          />
        {:else}
          <img 
            src={getPlaceholderImage()} 
            alt="Recipe placeholder" 
            class="cover placeholder" 
          />
        {/if}
        <div class="time-badge" class:quick={total > 0 && total <= 30}>
          {#if total > 0}
            <span>⏱ {total}m</span>
          {/if}
        </div>
        <div class="card-overlay"></div>
      </div>
      
      <div class="card-content">
        <h3 class="recipe-title">{recipe.title}</h3>
        
        {#if recipe.description}
          <p class="recipe-description">{recipe.description}</p>
        {/if}
        
        <div class="recipe-meta">
          {#if recipe.servings}
            <div class="meta-item">
              <span class="meta-icon">🍽</span>
              <span class="meta-text">{recipe.servings} servings</span>
            </div>
          {/if}
          
          {#if total > 0}
            <div class="meta-item">
              <span class="meta-icon">⏱</span>
              <span class="meta-text">{total} min</span>
            </div>
          {/if}
        </div>
        
        {#if recipe.tags?.length}
          <div class="tags-container">
            {#each recipe.tags.slice(0, 3) as tag}
              <TagPill label={tag} />
            {/each}
            {#if recipe.tags.length > 3}
              <span class="tag-more">+{recipe.tags.length - 3}</span>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
</a>

<style>
  .recipe-card {
    display: block;
    text-decoration: none;
    color: inherit;
    perspective: 1000px;
    height: 100%;
    --intensity-color: #4ecdc4;
  }
  
  .card-3d-wrapper {
    position: relative;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.5s ease;
  }
  
  .card-3d {
    position: relative;
    height: 100%;
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transform-style: preserve-3d;
    transition: transform 0.5s ease, box-shadow 0.3s ease;
  }
  
  .recipe-card:hover .card-3d-wrapper {
    transform: translateZ(20px);
  }
  
  .recipe-card:hover .card-3d {
    transform: rotateY(5deg) rotateX(5deg);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
  
  .card-image {
    position: relative;
    height: 220px;
    overflow: hidden;
    transform: translateZ(30px);
  }
  
  .cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .recipe-card:hover .cover {
    transform: scale(1.05);
  }
  
  .card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%);
    pointer-events: none;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }
  
  .recipe-card:hover .card-overlay {
    opacity: 0.9;
  }
  
  .time-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--intensity-color);
    color: #fff;
    font-weight: 700;
    font-size: 0.9rem;
    z-index: 2;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  }
  
  .time-badge.quick {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  .card-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transform: translateZ(20px);
  }
  
  .recipe-title {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 800;
    color: #333;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
  
  .recipe-description {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .recipe-meta {
    display: flex;
    gap: 1rem;
    margin-top: 0.25rem;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: #666;
  }
  
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }
  
  .tag-more {
    background: #f1f5f9;
    color: #666;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    .card-image {
      height: 200px;
    }
    .card-content {
      padding: 1.25rem;
    }
    .recipe-title {
      font-size: 1.2rem;
    }
    .recipe-meta {
      gap: 0.75rem;
    }
  }
</style>