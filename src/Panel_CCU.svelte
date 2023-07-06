<script>
  import { onMount } from 'svelte';
	import { csv } from "d3-fetch";
  import { sum, group } from "d3-array";
  import { timeParse } from "d3-time-format";
  import MultiLineChart from "./MultiLineChart.svelte";
  import Legend from './lib/Legend.svelte';

  const parseDateTime = timeParse('%Y-%m-%d %H:%M:%S');
  const parseDate = timeParse('%Y-%m-%d');

  const options = [
    {'Worldwide':'ww'},
    {'North America':'na'},
    {'South America':'sa'},
    {'Europe':'eu'},
    {'Africa':'af'},
    {'Asia':'as'},
    {'Australia':'au'}
  ];

  $: interval = 'Hourly'
  $: selectedTab = 'ccu'
  $: selectedOption = options.map(obj => Object.values(obj)[0])[0] //ww
  $: selectedAttr = ((selectedTab === 'dau' || selectedTab === 'mau' ) ? 'au_' : 'ccu_') + selectedOption

  let lineData = []
  let groupedData = []
  let currentCCU, ytdCCU

  const fileUrls = [
    '../src/data/output/sales_hourly.csv',
    '../src/data/output/sales_daily.csv'
  ];

  // Array to store the loaded CSV data
  let csvData = [];

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
      for (const [index, url] of fileUrls.entries()) {
        const data = await loadCSV(url);
        data.forEach(d => {
          d.date = index === 0 ? parseDateTime(d.date) : parseDate(d.date)
          d['Year'] = new Date(d['date']).getFullYear()
          d['Month'] = new Date(d['date']).getMonth() + 1
          d['Day'] = new Date(d['date']).getDate()
          d['Hour'] = new Date(d['date']).getHours()
          d['yearMonth'] = d['Year'] + '-' + d['Month']
        })
        csvData.push(data);
      }

      // Process the loaded CSV data here
      //console.log(csvData);

    } catch (error) {
      console.error('Error loading CSV files:', error);
    }
  }

  // Call the function to load multiple CSV files
  onMount(async () => {
    await loadMultipleCSVFiles(fileUrls);
    const lastDate = new Date(csvData[0][csvData[0].length - 1].date);
    const tenHoursAgo = new Date(lastDate.getTime() - (10 * 60 * 60 * 1000)); // 10 hours ago
    currentCCU = csvData[0].filter(d => new Date(d.date) >= tenHoursAgo);

    const previousDay = new Date(lastDate.getTime() - (24 * 60 * 60 * 1000)); // Previous day from the last date
    const ytdTenHours = new Date(previousDay.getFullYear(), previousDay.getMonth(), previousDay.getDate(), lastDate.getHours() - 9); // retrieve the same 10 hours ago on the previous day
    ytdCCU = csvData[0].filter(d => d['date'] >= ytdTenHours.getTime() && d['date'] <= previousDay.getTime())
    ytdCCU.forEach((d) => {
        // synchronize date of lastDate and prevDay
        // purpose of doing this is to enable layering of previous and current CCU line graphs
        d.date = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate(), d.date.getHours(), d.date.getMinutes());
      })
    lineData = [currentCCU, ytdCCU]
    //console.log(currentCCU, ytdCCU)
    groupedData = groupData(csvData[1])
  });

  function handleTabClick(tab) {
    selectedTab = tab;
    if(selectedTab === 'ccu'){
      interval = 'Hourly'
      selectedAttr = 'ccu_' + selectedOption
      lineData = [currentCCU, ytdCCU]
    } else if(selectedTab === 'dau'){
      interval = 'Daily'
      selectedAttr = 'au_' + selectedOption
      lineData = [csvData[1].slice(-100)]
    } else if(selectedTab === 'mau'){
      interval = 'Monthly'
      selectedAttr = 'au_' + selectedOption
      lineData = [groupedData]
    }
  }

  function handleOptionChange(event) {
    selectedOption = event.target.value;
  }

  function groupData(data, attribute) {
    // aggregate daily data by year and month together
    const dataByMonth = group(data, d => d['yearMonth']);

    const groupedData = [];

    for (const [key, values] of dataByMonth) {
      groupedData.push({ 
        date: parseDate(key + '-01'), 
        'au_ww': sum(values, d => d['au_ww']),
        'au_na': sum(values, d => d['au_na']),
        'au_sa': sum(values, d => d['au_sa']),
        'au_af': sum(values, d => d['au_af']),
        'au_as': sum(values, d => d['au_as']),
        'au_au': sum(values, d => d['au_au']) ,
        'au_eu': sum(values, d => d['au_eu']) 
      });
    }
    return groupedData
  }

  const legendItems = [
    { color: '#d3d3d3', text: 'Sales Volume (Yesterday)' },
    { color: "#40E0D0", text: 'Sales Volume (Now)' }
  ];
</script>

<div class="card">
  <div class="header">
    <div class="buttons">
      <div
        class={selectedTab === 'ccu' ? 'active' : ''}
        on:click={() => handleTabClick('ccu')}
      >
      Live Sales
      </div>
      <div
        class={selectedTab === 'dau' ? 'active' : ''}
        on:click={() => handleTabClick('dau')}
      >
        Daily Sales
      </div>
      <div
        class={selectedTab === 'mau' ? 'active' : ''}
        on:click={() => handleTabClick('mau')}
      >
        Monthly Sales
      </div>
    </div>
    <div class='buttons-wrapper'>
      <div class='label'>Filter By: </div>
      <div class="buttons">
        <div class='dropdown'>
          <select value={selectedOption} on:change={handleOptionChange}>
            {#each options as option}
              <option value={Object.values(option)[0]}>{Object.keys(option)[0]}</option>
            {/each}
          </select>
          <span class="caret"></span>
        </div>
      </div>
    </div>
  </div>
  {#if lineData.length > 0}
    {#if selectedTab === 'ccu'}
      <p>{currentCCU[0]['date'].toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }) + " to " + currentCCU[currentCCU.length-1]['date'].toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      })}</p>
    {/if}
    <MultiLineChart data={lineData} {interval} {selectedAttr} yFormat={".2s"} showTooltip={true}/>
  {/if}
  <Legend legendData={legendItems} />
</div>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  p {
    text-align: center;
    margin: 0px;
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
    margin: 0 20px;
    width: auto;
  }
  
  .buttons div {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: none;
    background-color: #d3d3d3;
    color: #696969;
    transition: background-color 0.3s ease;
    border-radius: 10px;
    margin: 10px;
  }
  
  .buttons div:hover {
    background-color: #C0C0C0;
  }
  
  .buttons div.active {
    background-color: #40E0D0;
    color: #000;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  } 

  /* Apply custom styles to hide the default look */
  .dropdown select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: transparent;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    font-family: Avenir;
    /* Add additional styles as needed */
  }

  .caret {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 5px 0 5px;
    border-color: black transparent transparent transparent;
    pointer-events: none;
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
