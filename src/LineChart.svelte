<script>
  import { onMount, afterUpdate } from 'svelte';
  import { min, max } from "d3-array";
  import { scaleLinear, scaleTime } from "d3-scale";
  import { line, curveCardinal } from "d3-shape";
  import AxisX from "./lib/AxisX.svelte";
  import AxisY from "./lib/AxisY.svelte";
  
  export let data, interval, yFormat

  const COLOR = "#40E0D0";
  const margin = { top: 20, right: 20, bottom: 20, left: 40 };
  let div
  let height = 300;
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
    //.domain([Math.floor(min(data, d => d[1])), Math.ceil(max(data, d => d[1]))])
    .domain([min(data, d => d[1]), max(data, d => d[1])])
    .range([innerHeight, 0]);

  //$: minDate = data[0][0]
  //$: maxDate = data[data.length - 1][0]
  //$: hoveredDate = maxDate
  $: hoveredDate = data.length - 1

  $: xScale = scaleLinear()
      //.domain([minDate, maxDate])
      .domain([0, data.length - 1])
      .range([0, innerWidth])

  $: lineGenerator = line()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d[1]))
      //.curve(curveCardinal);

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
      />
      <AxisY 
        width={innerWidth} 
        {yScale} 
        {yFormat}
      />
      <path
          d={lineGenerator(data)}
          stroke={COLOR}
          fill="transparent"
          stroke-width="3"
      />
      <circle
        cx={xScale(hoveredDate)}
        cy={yScale(data[data.length - 1][1])}
        r={5}
        fill={COLOR}
        border="white"
      />
    </g>
  </svg>
</div>
