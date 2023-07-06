<script>
    import { format } from "d3-format";
    export let width;
    export let yScale;
    export let yFormat
</script>

{#each yScale.ticks(8) as tick}
    <text
        x="0"
        dx="-6"
        y={yScale(tick)}
        text-anchor="end"
        dominant-baseline="middle"
        fill="#999"
    >
        {yFormat ? format(yFormat)(tick) : tick}
    </text>
    <line x1="0" x2={width} y1={yScale(tick)} y2={yScale(tick)} stroke="#dcdcdc" />
{/each}
<!-- <line x1="0" x2={width} y1={yScale(0)} y2={yScale(0)} stroke="#000" /> -->

<style>
    text {
        font-size: 0.7rem;
        fill: #000
    }
</style>
