<script lang="ts">
  import type { IngredientRow } from '$lib/types';
  export let items: IngredientRow[] = [];
  $: sorted = [...items].sort((a, b) => a.position - b.position);
  
  // Function to get ingredient category color
  function getCategoryColor(ingredient: string): string {
    const categories = {
      vegetable: ['#8ac926', '🥬'],
      fruit: ['#ffca3a', '🍎'],
      meat: ['#ff595e', '🥩'],
      dairy: ['#73d2de', '🥛'],
      grain: ['#ff9a76', '🌾'],
      spice: ['#b56576', '🌶️'],
      liquid: ['#1982c4', '💧'],
      other: ['#6a4c93', '🧂']
    };
    
    const lower = ingredient.toLowerCase();
    
    if (lower.includes('lettuce') || lower.includes('spinach') || lower.includes('kale')) return categories.vegetable;
    if (lower.includes('apple') || lower.includes('banana') || lower.includes('berry')) return categories.fruit;
    if (lower.includes('beef') || lower.includes('chicken') || lower.includes('pork')) return categories.meat;
    if (lower.includes('milk') || lower.includes('cheese') || lower.includes('butter')) return categories.dairy;
    if (lower.includes('rice') || lower.includes('pasta') || lower.includes('bread')) return categories.grain;
    if (lower.includes('salt') || lower.includes('pepper') || lower.includes('herb')) return categories.spice;
    if (lower.includes('water') || lower.includes('oil') || lower.includes('vinegar')) return categories.liquid;
    
    return categories.other;
  }
</script>

<div class="ingredients-container">
  <table class="ingredients-table">
    <thead>
      <tr>
        <th class="position-col">#</th>
        <th class="item-col">Ingredient</th>
        <th class="quantity-col">Quantity</th>
        <th class="unit-col">Unit</th>
        <th class="note-col">Notes</th>
      </tr>
    </thead>
    <tbody>
      {#if !sorted.length}
        <tr>
          <td colspan="5" class="empty-row">
            <div class="empty-state">
              <span class="empty-icon">📝</span>
              <span class="empty-text">No ingredients listed</span>
            </div>
          </td>
        </tr>
      {:else}
        {#each sorted as row (row.id)}
          <tr class="ingredient-row">
            <td class="position-cell">{row.position}</td>
            <td class="item-cell">
              <div class="ingredient-info">
                <span class="ingredient-icon" style="--color: {getCategoryColor(row.item_name)[0]}">
                  {getCategoryColor(row.item_name)[1]}
                </span>
                <span>{row.item_name}</span>
              </div>
            </td>
            <td class="quantity-cell">{row.qty_text ?? '—'}</td>
            <td class="unit-cell">{row.unit ?? '—'}</td>
            <td class="note-cell">{row.note ?? '—'}</td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<style>
  .ingredients-container {
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    margin-top: 1.5rem;
    overflow-x: auto;
  }

  .ingredients-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
    min-width: 600px;
  }

  thead {
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  }

  th {
    padding: 1.25rem 1rem;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #4a5568;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  .position-col {
    width: 50px;
    text-align: center;
  }

  .quantity-col {
    width: 100px;
  }

  .unit-col {
    width: 80px;
  }

  .item-col {
    min-width: 200px;
  }

  .note-col {
    width: 150px;
  }

  tbody tr {
    transition: background-color 0.2s ease;
  }

  tbody tr:nth-child(even) {
    background: #f9fafb;
  }

  tbody tr:hover {
    background: #e2e8f0;
  }

  td {
    padding: 1rem;
    color: #4a5568;
    vertical-align: middle;
    border-bottom: 1px solid #f1f5f9;
  }

  .position-cell {
    text-align: center;
    color: #718096;
    font-weight: 700;
    font-size: 1.1rem;
  }

  .quantity-cell {
    font-weight: 600;
    color: #1a202c;
    font-size: 1.05rem;
  }

  .unit-cell {
    color: #718096;
    font-style: italic;
  }

  .item-cell {
    font-weight: 500;
    color: #1a202c;
  }

  .note-cell {
    color: #718096;
    font-size: 0.9rem;
  }

  .ingredient-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .ingredient-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .empty-row {
    padding: 3rem 1rem;
    text-align: center;
    background: #f1f5f9;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .empty-icon {
    font-size: 2rem;
    opacity: 0.5;
  }

  .empty-text {
    color: #718096;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    .ingredients-container {
      border-radius: 16px;
    }
    
    th {
      padding: 1rem 0.75rem;
      font-size: 0.75rem;
    }
    
    td {
      padding: 0.75rem;
      font-size: 0.9rem;
    }
    
    .note-col {
      display: none;
    }
    
    .quantity-col {
      width: 80px;
    }
    
    .unit-col {
      width: 60px;
    }
  }
  
  @media (max-width: 480px) {
    .unit-col {
      display: none;
    }
    
    .position-col {
      width: 40px;
    }
    
    .ingredient-icon {
      width: 24px;
      height: 24px;
      font-size: 0.8rem;
    }
  }
</style>