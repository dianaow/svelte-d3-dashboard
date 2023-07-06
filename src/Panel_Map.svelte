<script>
  import { onMount } from 'svelte';
  import { json } from 'd3-fetch';
	import { geoPath, geoNaturalEarth1 } from 'd3-geo';
  import { select } from 'd3-selection'

  onMount( async() => {

    // Select the container element
    const container = select('.map-container');
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;

    // Create an SVG element within the container
    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Load world data
    const worldData = await json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');

    // Projection function to convert coordinates to the SVG space
    const projection = geoNaturalEarth1().fitSize([width, height], worldData);

    // Path generator function
    const path = geoPath().projection(projection);

    // Append the world map
    svg
      .selectAll('path')
      .data(worldData.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', "#d3d3d3")
      //.attr('stroke', 'white')
      .attr('stroke-width', 0);

    // Add markers
    const markers = [
      { name: 'Asia', coordinates: [105.3188, 34.0479], value: 10 },
      { name: 'Africa', coordinates: [17.3734, -8.7832], value: 5 },
      { name: 'Europe', coordinates: [9.5559, 47.3769], value: 6 },
      { name: 'North America', coordinates: [-100.4459, 44.0682], value: 18 },
      { name: 'South America', coordinates: [-58.3816, -14.235], value: 10 },
      { name: 'Australia', coordinates: [133.7751, -25.2744], value: 2 },
    ];

    svg
      .selectAll('.marker')
      .data(markers)
      .enter()
      .append('circle')
      .attr('class', 'marker')
      .attr('cx', d => projection(d.coordinates)[0])
      .attr('cy', d => projection(d.coordinates)[1])
      .attr('r', d => d.value)
      .attr('fill-opacity', 1)
      .attr('fill', "#40E0D0")

  });
</script>

<div class="card">
  <div class="header">
    <h3>Total Regional Sales</h3>
  </div>
  <div class="map-container"></div>
</div>

<style>
  .map-container {
    width: 100%;
    height: 100%;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h3 {
    margin-left: 15px;
  }

  .card {
    width: 100%;
    height: calc(100% - 25px);
    margin: 0 10px;
    border-radius: 10px;
    padding: 10px;
    background-color: #ffff;
  }
</style>

