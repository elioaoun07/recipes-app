<script lang="ts">
  export let label: string;
</script>

<span class="pill">{label}</span>

<style>
  .pill {
    background: #222;
    border: 1px solid #444;
    border-radius: 20px;
    padding: 2px 10px;
    font-size: 0.8rem;
    color: #ddd;
  }
</style>
