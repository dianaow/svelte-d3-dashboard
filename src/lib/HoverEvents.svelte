<script>
    export let xScale;
    export let margin;
    export let width;
    export let height;
    export let hoveredDate;
    export let maxDate;
    export let interval;

    function roundToFirstDayOfMonth(date) {
        const roundedDate = new Date(date);
        roundedDate.setDate(1);  // Set to the first day of the month
        
        if (date.getDate() > 15) {
            roundedDate.setMonth(roundedDate.getMonth() + 1);  // Add 1 month
        } else {
            roundedDate.setMonth(roundedDate.getMonth() - 1);  // Subtract 1 month
        }
        
        // Set time components to 0
        roundedDate.setHours(0);
        roundedDate.setMinutes(0);
        roundedDate.setSeconds(0);
        roundedDate.setMilliseconds(0);
        
        return roundedDate;
    }

    const handleMousemove = function (e) {
        hoveredDate = xScale.invert(e.offsetX - margin.left);
        if(interval === 'Hourly' || interval === 'Monthly') hoveredDate = roundToFirstDayOfMonth(hoveredDate);
    };

    const handleMouseleave = function () {
        hoveredDate = maxDate;
    };
</script>

<rect
    class="hover-listener"
    fill="transparent"
    {width}
    {height}
    on:mousemove={handleMousemove}
    on:mouseleave={handleMouseleave}
/>

<line
    x1={xScale(hoveredDate)}
    x2={xScale(hoveredDate)}
    y1={0}
    y2={height}
    stroke="darkgrey"
    stroke-dasharray="2, 2"
    pointer-events="none"
/>

<style>
    rect {
        cursor: crosshair;
    }
</style>
