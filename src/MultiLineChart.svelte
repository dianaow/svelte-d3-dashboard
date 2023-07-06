<script>
  import { onMount, afterUpdate } from 'svelte';
  import { min, max } from "d3-array";
  import { scaleLinear, scaleTime } from "d3-scale";
  import { area, line, curveCardinal } from "d3-shape";
  import AxisX from "./lib/AxisX.svelte";
  import AxisY from "./lib/AxisY.svelte";
  import HoverEvents from "./lib/HoverEvents.svelte";
  import Tooltip from "./lib/Tooltip.svelte";
  
  export let data, interval, yFormat, showTooltip, selectedAttr

  const COLOR = "#40E0D0";
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  let div
  let height = 750;
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
      height = div.clientHeight;
      innerHeight = height - margin.top - margin.bottom;
    }
  }

  $: yScale = scaleLinear()
    //.domain([Math.floor(min(data[0], d => +d[selectedAttr])), Math.ceil(max(data[0], d => +d[selectedAttr]))])
    .domain([0, Math.ceil(max(data[0], d => +d[selectedAttr]))])
    .range([innerHeight, 0]);

  $: maxDate = data[0][data[0].length - 1]['date']
  $: minDate = interval === 'Hourly' ? new Date(maxDate.getTime() - (10 * 60 * 60 * 1000)) : data[0][0]['date']

  $: xScale = scaleTime()
    .domain([minDate, maxDate]) 
    .range([0, innerWidth])

  $: areaGenerator = area()
      .x((d) => xScale(d['date']))
      .y0(innerHeight)
      .y1((d) => yScale(+d[selectedAttr]))
      .curve(curveCardinal);

  let hoveredDate
  $: yValue = hoveredDate ? data[0].filter((d) => d.date.getTime() >= hoveredDate.getTime())[0] : data[0].filter((d) => d.date.getTime() >= maxDate.getTime())[0]
  $: tooltipContent = yValue ? {x: xScale(hoveredDate), y: yScale(yValue[selectedAttr]), value: yValue[selectedAttr]} : null
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
        ticks={xScale.ticks(10)}
      />
      <AxisY 
        width={innerWidth} 
        {yScale} 
        {yFormat}
      />
      {#if data[1]}
        <path
            d={areaGenerator(data[1])}
            stroke="#d3d3d3"
            fill="#d3d3d3"
            fill-opacity=0.7
            stroke-width="2"
        />
      {/if}
      <path
          d={areaGenerator(data[0])}
          stroke={COLOR}
          fill={COLOR}
          fill-opacity=0.7
          stroke-width="2"
      />
      {#if showTooltip}
        <HoverEvents
          width={innerWidth}
          height={innerHeight}
          {xScale}
          {margin}
          {maxDate}
          bind:hoveredDate
        />
        {#if tooltipContent}
          <Tooltip
            data={tooltipContent}
            color={COLOR}
          />
        {/if}
      {/if}
    </g>
  </svg>
</div>

<style>
  .chart-container {
    width: 100%;
    height: 80%;
  }
</style>