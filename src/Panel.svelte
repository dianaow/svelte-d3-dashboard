<script>
  import { onMount } from 'svelte';
	import { csv } from "d3-fetch";
  import { sum, rollups } from "d3-array";
  import { timeParse } from "d3-time-format";
  import LineChart from "./LineChart.svelte";
  import BarChart from "./BarChart.svelte";

  $: selectedTab = 'Day'

  const YEAR = 2022
  const MONTH = 12
  const parseDate = timeParse('%Y-%m-%d');

  const fileUrls = [
    '../src/data/output/revenue_daily.csv',
    '../src/data/output/volume_daily.csv',
    '../src/data/output/transactions_daily.csv'
  ];

  const chartTitles = ['Revenue', 'Volume', 'Transactions']

  // Array to store the loaded CSV data
  let csvData = [];
  let chartData = []

  // Function to load CSV file
  function loadCSV(url) {
    return new Promise((resolve, reject) => {
      csv(url)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.error('Error loading CSV:', error);
          reject(error);
        });
    });
  }

  // Function to load multiple CSV files
  async function loadMultipleCSVFiles(fileUrls) {
    try {
      for (const url of fileUrls) {
        const data = await loadCSV(url);
        data.forEach(d => {
            d.date = parseDate(d.date)
            d['Year'] = new Date(d['date']).getFullYear()
            d['Month'] = new Date(d['date']).getMonth() + 1
            d['Day'] = new Date(d['date']).getDate()
          })
        csvData.push(data);
      }

      // Process the loaded CSV data here
      //console.log(csvData);

    } catch (error) {
      console.error('Error loading CSV files:', error);
    }
  }

  onMount(async () => {
    await loadMultipleCSVFiles(fileUrls);
    if (csvData.length > 0) {
      // Render the chart components with the loaded data
      chartData = [
        groupData(csvData[0], selectedTab, 'revenue_ww'),
        groupData(csvData[1], selectedTab, 'volume_ww'),
        groupData(csvData[2], selectedTab, 'num_of_transactions_ww')
      ];
    }
  });

  $: {
    if (csvData.length > 0) {
      // Render the chart components with the loaded data
      chartData = [
        groupData(csvData[0], selectedTab, 'revenue_ww'),
        groupData(csvData[1], selectedTab, 'volume_ww'),
        groupData(csvData[2], selectedTab, 'num_of_transactions_ww')
      ];
    }
  }

  // Group the line chart data and bar chart data based on selectedTab
  function groupData(data, interval, attribute) {
    let groupedData = []
    if(interval === 'Day'){
      groupedData = rollups(
        data.filter(d => d['Year'] == YEAR && d['Month'] === MONTH),
        v => sum(v, d => +d[attribute]),
        d => d[interval]
      ).slice(-14)
    } else if(interval === 'Month'){
      groupedData = rollups(
        data.filter(d => d['Year'] == YEAR),
        v => sum(v, d => +d[attribute]),
        d => d[interval]
      ).slice(-12)
    } else if(interval === 'Year'){
      groupedData = rollups(
        data,
        v => sum(v, d => +d[attribute]),
        d => d[interval]
      )
    } else if (interval === 'Lifetime'){
      groupedData = rollups(
        data,
        v => sum(v, d => +d[attribute]),
        d => d['date']
      ).slice(-90)
    }
    return groupedData
  }
  
  function handleTabClick(tab) {
    selectedTab = tab;
  }
</script>

<div class="header">
  <h1>Sales Dashboard</h1>
  <div class='buttons-wrapper'>
    <div class='label'>View By: </div>
    <div class="tabs">
      <div
        class={selectedTab === 'Day' ? 'active' : ''}
        on:click={() => handleTabClick('Day')}
      >
        Day
      </div>
      <div
        class={selectedTab === 'Month' ? 'active' : ''}
        on:click={() => handleTabClick('Month')}
      >
        Month
      </div>
      <div
        class={selectedTab === 'Year' ? 'active' : ''}
        on:click={() => handleTabClick('Year')}
      >
        Year
      </div>
      <div
        class={selectedTab === 'Lifetime' ? 'active' : ''}
        on:click={() => handleTabClick('Lifetime')}
      >
        Past 90 days
      </div>
    </div>
  </div>
</div>
<div class="cards">
  {#each chartData as data, i}
    <div class="card">
      <h3>{chartTitles[i]}</h3>
      {#if selectedTab === 'Day'}
        <p>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][MONTH-1] + ' ' + YEAR}</p>
      {/if}
      {#if selectedTab === 'Month'}
        <p>{YEAR}</p>
      {/if}
      {#if data}
        {#if i < 2}
          <BarChart data={data} interval={selectedTab} yFormat={"$.2s"} />
        {:else}
          <LineChart data={data} interval={selectedTab} />
        {/if}
      {/if}
    </div>
  {/each}
</div>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    margin-left: 20px;
  }
  
  h3 {
    color: black;
    text-align: center;
    margin-bottom: 5px;
  }

  p {
    text-align: center;
    margin: 0px;
  }

  .tabs {
    display: flex;
    margin: 20px 30px 20px 20px;
    width: auto;
  }
  
  .tabs div {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: none;
    background-color: #fff;
    color: #808080;
    transition: background-color 0.3s ease;
  }
  
  .tabs div:hover {
    background-color: #e0e0e0;
    border-radius: 10px;
  }
  
  .tabs div.active {
    background-color: black;
    color: #fff;
    border-radius: 10px;
  }

  .tabs div:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .tabs div:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .cards {
    display: flex;
    justify-content: space-between;
    margin: 10px;
  }

  .card {
    width: calc(33% - 40px); /* Adjust the width and margin values as needed */
    margin: 0 10px;
    border-radius: 10px;
    padding: 10px;
    background-color: #ffff;
  }

  .buttons-wrapper {
    display: flex;
  }

  .label {
    margin-top: 30px;
    font-size: 0.85em;
  }
</style>
