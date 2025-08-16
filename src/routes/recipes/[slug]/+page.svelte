<script lang="ts">
  import IngredientsTable from '$lib/components/IngredientsTable.svelte';
  import { onMount } from 'svelte';

  export let data: {
    recipe: {
      id: string;
      title: string;
      description: string | null;
      image_cover_url: string | null;
      servings: number;
      prep_minutes: number;
      cook_minutes: number;
    } | null;
    ingredients: import('$lib/types').IngredientRow[];
    steps: import('$lib/types').StepRow[];
  };

  if (!data.recipe) {
    throw new Error('Recipe not found');
  }

  $: total = data.recipe.prep_minutes + data.recipe.cook_minutes;
  
  // State for serving adjustment
  let currentServings = data.recipe.servings;
  let adjustedIngredients = [...data.ingredients];
  
  // Function to adjust ingredients based on servings
  function adjustServings(newServings: number) {
    const ratio = newServings / data.recipe.servings;
    currentServings = newServings;
    
    adjustedIngredients = data.ingredients.map(ingredient => {
      if (ingredient.qty_text) {
        // Try to parse quantity for scaling
        const qty = parseFloat(ingredient.qty_text);
        if (!isNaN(qty)) {
          return {
            ...ingredient,
            qty_text: (qty * ratio).toFixed(2).replace(/\.?0+$/, '')
          };
        }
      }
      return ingredient;
    });
  }
  
  // State for step tracking
  let currentStep = 0;
  let completedSteps = new Set<number>();
  
  function nextStep() {
    if (currentStep < data.steps.length - 1) {
      completedSteps.add(currentStep);
      currentStep++;
    }
  }
  
  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
      completedSteps.delete(currentStep);
    }
  }
  
  function completeStep() {
    completedSteps.add(currentStep);
    if (currentStep < data.steps.length - 1) {
      currentStep++;
    }
  }
  
  // Timer functionality
  let timers = {};
  let timerIntervals = {};
  
  function startTimer(stepId: string, seconds: number) {
    if (timerIntervals[stepId]) return;
    
    timers[stepId] = seconds;
    
    timerIntervals[stepId] = setInterval(() => {
      timers[stepId]--;
      if (timers[stepId] <= 0) {
        clearInterval(timerIntervals[stepId]);
        delete timerIntervals[stepId];
        // Optional: play sound or show notification
      }
    }, 1000);
  }
  
  onMount(() => {
    return () => {
      // Cleanup intervals
      Object.values(timerIntervals).forEach(clearInterval);
    };
  });
</script>

<article class="recipe-detail">
  <header class="recipe-header">
    <div class="header-content">
      <h1 class="recipe-title">{data.recipe.title}</h1>

      <div class="recipe-stats">
        <div class="stat-item">
          <span class="stat-icon">👥</span>
          <div class="stat-controls">
            <button class="stat-btn" on:click={() => adjustServings(Math.max(1, currentServings - 1))}>-</button>
            <span class="stat-value">{currentServings}</span>
            <button class="stat-btn" on:click={() => adjustServings(currentServings + 1)}>+</button>
          </div>
          <span class="stat-label">Servings</span>
        </div>

        <div class="stat-item">
          <span class="stat-icon">⏱</span>
          <span class="stat-value">{data.recipe.prep_minutes}m</span>
          <span class="stat-label">Prep</span>
        </div>

        <div class="stat-item">
          <span class="stat-icon">🔥</span>
          <span class="stat-value">{data.recipe.cook_minutes}m</span>
          <span class="stat-label">Cook</span>
        </div>

        <div class="stat-item highlight">
          <span class="stat-icon">⏱</span>
          <span class="stat-value">{total}m</span>
          <span class="stat-label">Total</span>
        </div>
      </div>
    </div>

    {#if data.recipe.image_cover_url}
      <div class="recipe-image-container">
        <img
          src={data.recipe.image_cover_url}
          alt={data.recipe.title}
          class="recipe-image"
          loading="lazy"
        />
      </div>
    {/if}
  </header>

  <div class="recipe-content">
    {#if data.recipe.description}
      <section class="recipe-section">
        <h2 class="section-title">About This Recipe</h2>
        <p class="recipe-description">{data.recipe.description}</p>
      </section>
    {/if}

    <section class="recipe-section">
      <div class="section-header">
        <h2 class="section-title">Ingredients</h2>
        <div class="servings-info">
          <span class="servings-label">Serves {currentServings}</span>
        </div>
      </div>
      <IngredientsTable items={adjustedIngredients} />
    </section>

    <section class="recipe-section">
      <div class="section-header">
        <h2 class="section-title">Steps</h2>
        <div class="step-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {(completedSteps.size / data.steps.length) * 100}%"></div>
          </div>
          <span class="progress-text">{completedSteps.size} of {data.steps.length} steps completed</span>
        </div>
      </div>

      <div class="steps-container">
        {#if !data.steps?.length}
          <p class="no-steps">No steps added yet.</p>
        {:else}
          <div class="steps-navigation">
            <button 
              class="nav-btn" 
              disabled={currentStep === 0}
              on:click={prevStep}
            >
              ← Previous
            </button>
            <button 
              class="nav-btn complete-btn" 
              on:click={completeStep}
              class:completed={completedSteps.has(currentStep)}
            >
              {completedSteps.has(currentStep) ? 'Completed!' : 'Complete Step'}
            </button>
            <button 
              class="nav-btn" 
              disabled={currentStep === data.steps.length - 1}
              on:click={nextStep}
            >
              Next →
            </button>
          </div>
          
          <div class="step-detail">
            {#if data.steps[currentStep]}
              <div class="step-header">
                <div class="step-number">{data.steps[currentStep].position}</div>
                <h3 class="step-title">Step {data.steps[currentStep].position}</h3>
              </div>
              <p class="step-text">{data.steps[currentStep].text}</p>
              
              {#if data.steps[currentStep].timer_seconds != null}
                <div class="timer-container">
                  <button 
                    class="timer-btn" 
                    on:click={() => startTimer(data.steps[currentStep].id, data.steps[currentStep].timer_seconds)}
                    disabled={!!timerIntervals[data.steps[currentStep].id]}
                  >
                    ⏱ Start {Math.round(data.steps[currentStep].timer_seconds / 60)}m Timer
                  </button>
                  {#if timers[data.steps[currentStep].id] !== undefined}
                    <div class="timer-display">
                      {Math.floor(timers[data.steps[currentStep].id] / 60)}:{(timers[data.steps[currentStep].id] % 60).toString().padStart(2, '0')}
                    </div>
                  {/if}
                </div>
              {/if}
            {/if}
          </div>
          
          <div class="steps-timeline">
            {#each data.steps as step, i}
              <div 
                class="timeline-step" 
                class:active={i === currentStep}
                class:completed={completedSteps.has(i)}
                on:click={() => currentStep = i}
              >
                <div class="timeline-dot"></div>
                <div class="timeline-label">Step {step.position}</div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </section>
  </div>
</article>

<style>
  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background: linear-gradient(135deg, #fff9f9 0%, #f0f4f8 100%);
    color: #333;
  }

  .recipe-detail {
    max-width: 1200px;
    margin: 2rem auto;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .recipe-header {
    position: relative;
    margin-bottom: 0;
    text-align: center;
    padding: 3rem 2rem;
    background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
    color: white;
    overflow: hidden;
  }
  
  .recipe-header::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjAuNSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=');
    opacity: 0.2;
  }

  .recipe-title {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    font-weight: 800;
    color: white;
    margin-bottom: 2rem;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .recipe-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    min-width: 120px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }

  .stat-item:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.3);
  }

  .stat-item.highlight {
    background: linear-gradient(135deg, #ff6b6b, #ffa502);
    border-color: rgba(255, 255, 255, 0.4);
    color: white;
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
  }

  .stat-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .stat-btn {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    color: white;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .stat-btn:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.9;
    margin-top: 0.25rem;
  }

  .recipe-image-container {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
    padding: 0 2rem;
  }

  .recipe-image {
    max-width: 100%;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    border: 5px solid white;
    max-height: 400px;
    object-fit: cover;
  }

  .recipe-content {
    padding: 2rem;
  }

  .recipe-section {
    margin-bottom: 3rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin: 0;
  }

  .recipe-description {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #555;
    margin: 0;
    max-width: 800px;
  }

  .servings-info {
    background: #f1f5f9;
    padding: 0.5rem 1.25rem;
    border-radius: 30px;
    border: 1px solid #e2e8f0;
    font-size: 0.95rem;
    font-weight: 500;
  }

  /* Steps */
  .no-steps {
    color: #6b7280;
    font-style: italic;
    text-align: center;
    padding: 2rem;
  }

  .steps-container {
    background: #fafafa;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
  }

  .steps-navigation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    gap: 1rem;
  }

  .nav-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    border: none;
    background: #e2e8f0;
    color: #4a5568;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
  }

  .nav-btn:hover:not(:disabled) {
    background: #cbd5e0;
    transform: translateY(-2px);
  }

  .nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .complete-btn {
    background: linear-gradient(135deg, #4ecdc4, #1a936f);
    color: white;
  }

  .complete-btn.completed {
    background: linear-gradient(135deg, #8ac926, #5cb85c);
  }

  .step-detail {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  }

  .step-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .step-number {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ff6b6b, #ffa502);
    color: white;
    font-weight: 700;
    font-size: 1.25rem;
  }

  .step-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem;
    margin: 0;
    color: #333;
  }

  .step-text {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #4a5568;
    margin: 0 0 1.5rem;
  }

  .timer-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .timer-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #4361ee, #3a0ca3);
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .timer-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
  }

  .timer-btn:disabled {
    background: #a3a3a3;
    cursor: not-allowed;
  }

  .timer-display {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ff6b6b;
    font-family: 'Courier New', monospace;
  }

  .steps-timeline {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-top: 2rem;
    padding: 1rem 0;
  }

  .steps-timeline::before {
    content: "";
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
    z-index: 1;
  }

  .timeline-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    z-index: 2;
    transition: all 0.3s ease;
  }

  .timeline-step:hover .timeline-dot {
    transform: scale(1.2);
    background: #4ecdc4;
  }

  .timeline-step.active .timeline-dot {
    transform: scale(1.3);
    background: #ff6b6b;
    box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.3);
  }

  .timeline-step.completed .timeline-dot {
    background: #8ac926;
  }

  .timeline-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #cbd5e0;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
  }

  .timeline-label {
    font-size: 0.85rem;
    color: #718096;
    font-weight: 500;
  }

  .timeline-step.active .timeline-label {
    color: #ff6b6b;
    font-weight: 600;
  }

  .timeline-step.completed .timeline-label {
    color: #8ac926;
  }

  .step-progress {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  .progress-bar {
    width: 100%;
    height: 10px;
    background: #e2e8f0;
    border-radius: 5px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4ecdc4, #1a936f);
    border-radius: 5px;
    transition: width 0.5s ease;
  }

  .progress-text {
    font-size: 0.9rem;
    color: #718096;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .recipe-detail {
      margin: 1rem;
      border-radius: 16px;
    }
    
    .recipe-header {
      padding: 2rem 1rem;
    }
    
    .recipe-title {
      font-size: 2.5rem;
    }
    
    .recipe-stats {
      gap: 1rem;
    }
    
    .stat-item {
      min-width: 90px;
      padding: 1rem;
    }
    
    .stat-value {
      font-size: 1.25rem;
    }
    
    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .recipe-content {
      padding: 1.5rem;
    }
    
    .steps-container {
      padding: 1.5rem;
    }
    
    .steps-navigation {
      flex-direction: column;
    }
    
    .steps-timeline {
      overflow-x: auto;
      padding-bottom: 1rem;
    }
    
    .steps-timeline::before {
      width: 1000px;
    }
  }
</style>