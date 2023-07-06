<script>
    import { timeFormat } from "d3-time-format";
    export let height;
    export let xScale;
    export let interval;
    export let ticks;
    export let type;

    const TICK_LENGTH = 0;

    function getDateFormat(interval, tick) {
        if(interval === 'Month'){
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][tick-1]
        } else if(interval === 'Lifetime'){
            return timeFormat("%b %y")(tick);
        } else if(interval === 'Hourly'){
            return timeFormat("%-I.%M%p")(tick);
        } else if(interval === 'Daily'){
            return timeFormat("%d %b")(tick);
        } else if(interval === 'Monthly'){
            return timeFormat("%b %y")(tick);
        } else {
            return tick
        }
    }

    function getX(xScale, tick, i){
        if(interval === 'Lifetime'){
            return xScale.range()[i]
        } else if(type === 'band'){
            return xScale(i) + xScale.bandwidth()/2
        } else if(interval === 'Hourly'){
            return xScale(tick)
        } else if(interval === 'Daily'){
            return xScale(tick)
        } else if(interval === 'Monthly'){
            return xScale(tick)
        } else {
            return xScale(i)
        }
    }
</script>

{#each ticks as tick, i}
    <line
        x1={getX(xScale, tick, i)}
        x2={getX(xScale, tick, i)}
        y1={height}
        y2={height + TICK_LENGTH}
        stroke="#808080"
    />
    <text
        x={getX(xScale, tick, i)}
        y={height + TICK_LENGTH}
        dy="6"
        dominant-baseline="hanging"
        text-anchor="middle"
        fill="#999"
    >
        {getDateFormat(interval, tick)}
    </text>
{/each}

<style>
    text {
        font-size: 0.7rem;
        fill: #808080;
    }
</style>
