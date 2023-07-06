<script>
  export let legendData;
</script>

<style>
  .legend-container {
    display: flex;
    margin-top: 10px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    margin-left: 20px;
    font-size: 0.9em;
  }

  .color-circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }
</style>

<div class='legend-container'>
  {#each legendData as { color, text }}
    <div class="legend-item">
      <div class="color-circle" style="background-color: {color}"></div>
      <span>{text}</span>
    </div>
  {/each}
</div>
