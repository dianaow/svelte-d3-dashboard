<script>
  import { onMount, afterUpdate } from 'svelte';
  import { scaleLinear, scaleBand } from "d3-scale";
  import { min, max, extent, range } from "d3-array";
  import { format } from "d3-format";
  import AxisX from "./lib/AxisX.svelte";
  import AxisY from "./lib/AxisY.svelte";

  export let data, interval, yFormat

  const COLOR = "#40E0D0";
  const margin = { top: 20, right: 20, bottom: 20, left: 40 };
  let div
  let height = 200;
  let width = 300;
  let innerHeight = height - margin.top - margin.bottom;
  let innerWidth = width - margin.left - margin.right;

  onMount(() => {
    updateChartSize();
  });

  afterUpdate(() => {
    updateChartSize();
  });

  function updateChartSize() {
    if (div) {
      width = div.clientWidth;
      innerWidth = width - margin.left - margin.right;
      height = div.clientHeight - 70;
      innerHeight = height - margin.top - margin.bottom;
    }
  }

  $: yScale = scaleLinear()
    //.domain(extent(data, d => d[1]))
    //.domain([Math.floor(min(data, d => d[1])), Math.ceil(max(data, d => d[1]))])
    .domain([0, max(data, d => d[1]) + 100])
    .range([innerHeight, 0]);

  //$: minDate = data[0][0]
  //$: maxDate = data[data.length - 1][0]
  $: minDate = 0
  $: maxDate = data.length

  $: xScale = scaleBand()
    .domain(range(minDate, maxDate, 1))
    .rangeRound([0, innerWidth])
    .padding(0.4);

</script>

<div class="chart-container" bind:this={div}>
  <svg
    {width}
    {height}
  >
    <g transform="translate({margin.left} {margin.top})">
      <AxisX
        height={innerHeight}
        {xScale}
        {interval}
        ticks={interval === 'Lifetime' ? [data[0][0], data[data.length-1][0]] : data.map(d => d[0])}
        type='band'
      />
      <AxisY 
        width={innerWidth} 
        {yScale} 
        {yFormat}
      />
      {#each data as d, i}
        <rect
          x={xScale(i)}
          y={yScale(d[1])}
          width={xScale.bandwidth()}
          height={innerHeight - yScale(d[1])}
          fill={COLOR}
        />
        {#if interval !== 'Lifetime'}
          <text
            x={xScale(i) + xScale.bandwidth()/2}
            y={yScale(d[1]) - 9}
            text-anchor="middle" 
            dominant-baseline="middle"
          >
            {format(yFormat)(d[1])}
          </text>
        {/if}
      {/each}
    </g>
  </svg>
</div>

<style>
  text {
      font-size: 0.6rem;
      fill: #000;
  }
  .chart-container {
    width: 100%;
    height: 100%;
  }
</style>
