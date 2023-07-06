<script>
  import Panel from "./Panel.svelte"
  import Panel_CCU from "./Panel_CCU.svelte"
  import Panel_RU from "./Panel_RU.svelte"
  import Panel_Map from "./Panel_Map.svelte"
</script>

<div class="wrapper">
  <Panel />

  <div class="container">
    <div class="left">
      <Panel_CCU />
    </div>
    <div class="right">
      <div class="top">
        <Panel_Map />
      </div>
      <div class="bottom">
        <Panel_RU />
      </div>
    </div>
  </div>
</div>

<style>
  .wrapper {
    width: 100vw;
    height: 100vh;
  }

  h1 {
    margin-left: 20px;
  }

  .container {
    display: flex;
    width: calc(100% - 100px); /* Subtract the height of the h1 element */
    height: calc(100vh - 100px);
  }

  .left {
    width: 70%;
    height: 100%;
    margin: 10px;
  }

  .right {
    width: 30%;
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-left: 20px;
  }

  .top {
    flex: 1;
    width: 100%;
    height: calc(60% - 10px);
    margin: 10px;
  }

  .bottom {
    flex: 1;
    width: 100%;
    height: calc(40% - 10px);
    margin: 10px;
  }
</style>
