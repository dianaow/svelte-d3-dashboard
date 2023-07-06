<script>
  import { onMount } from 'svelte';
	import { csv } from "d3-fetch";
  import { rollups, sum } from "d3-array";
  import { timeParse } from "d3-time-format";
  import BarChart from "./BarChart.svelte";

  $: selectedTab = 'Month'

  const parseDate = timeParse('%Y-%m-%d');

  let data = []

  onMount(
		async () => {
		  data = await csv('../src/data/output/sales_daily.csv')
        .then((raw) => {
          raw.forEach(d => {
            d.date = parseDate(d.date)
            d['Year'] = new Date(d['date']).getFullYear()
            d['Month'] = new Date(d['date']).getMonth() + 1
            d['Day'] = new Date(d['date']).getDate()
          })
          return raw
        });
    }
	)
  
  function handleTabClick(tab) {
    selectedTab = tab;
  }

  function groupData(data, interval, attribute) {
    let groupedData = []
    if(interval === 'Month'){
      groupedData = rollups(
        data.filter(d => d['Year'] == data[data.length-1]['Year']),
        v => sum(v, d => +d[attribute]),
        d => d[interval]
      ).slice(-6)
    } else if (interval === 'Lifetime'){
      groupedData = rollups(
        data,
        v => sum(v, d => +d[attribute]),
        d => d['date']
      ).slice(-90)
    }
    return groupedData
  }
</script>

<div class="card">
  <div class="header">
    <h3>Customers</h3>
    <div class='buttons-wrapper'>
      <div class='label'>View By: </div>
      <div class="buttons">
        <div
          class={selectedTab === 'Month' ? 'active' : ''}
          on:click={() => handleTabClick('Month')}
        >
          Monthly
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
  {#if data.length > 0}
    <BarChart data={groupData(data, selectedTab, 'au_ww')} interval={selectedTab} yFormat={".2s"}/>
  {/if}
</div>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h3 {
    margin-left: 15px;
  }

  .buttons-wrapper {
    display: flex;
  }

  .label {
    margin-top: 20px;
    font-size: 0.7em;
  }

  .buttons {
    display: flex;
    margin: 10px;
    width: auto;
  }
  
  .buttons div {
    padding: 4px 8px;
    cursor: pointer;
    border-bottom: none;
    background-color: #fff;
    color: black;
    transition: background-color 0.3s ease;
    border-radius: 10px;
    border: 1px solid #40E0D0;
    margin: 5px;
    font-size: 0.7em;
  }
  
  .buttons div:hover {
    background-color: #C0C0C0;
  }
  
  .buttons div.active {
    background-color: #000;
    color: #fff;
  }

  .card {
    width: 100%;
    height: calc(100% - 10px);
    margin: 0 10px;
    border-radius: 10px;
    padding: 10px;
    background-color: #ffff;
  }
</style>
