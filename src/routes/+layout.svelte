<svelte:head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#ff6b6b" />
</svelte:head>

<script>
  export let data;
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
</script>


<main>
  <slot />
</main>

<style>
  html, body, main {
    height: 100%;
  }

  body {
    margin: 0;
    background: #000;      /* keep if you like the dark bg */
    color: #eee;
    font-family: system-ui, sans-serif;
  }

  main {
    width: 100%;
    /* remove max-width and center */
    padding: 20px;         /* optional */
    /* no border radius here */
  }
</style>
