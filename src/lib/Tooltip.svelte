<script>
    export let data;
    export let color;

</script>

<circle
    cx={data.x}
    cy={data.y}
    r="7.5"
    fill={color}
    stroke="#fff"
    pointer-events="none"
/>

<rect
    x={data.x - 25}
    y={data.y - 35}
    rx="5" 
    ry="5" 
    width="50"
    height="25"
    fill='black'
/>

<text
    x={data.x}
    y={data.y- 22}
    text-anchor="middle" 
    dominant-baseline="middle"
    pointer-events="none"
>
    {data.value}
</text>

<style>
    text {
        font-weight: 600;
        fill: white;
        font-size: 0.7em;
    }
</style>
