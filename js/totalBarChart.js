function totalBarChart() {
    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
            top: 60,
            left: 50,
            right: 30,
            bottom: 30
        },
        width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,
        title = 'Total Remaining Budget (%)',
        padding = 1,
        barHeight = 100,
        halfBarHeight = barHeight / 2;

    // Create the chart by adding an svg to the div with the id
    // specified by the selector using the given data
    function chart(selector, data) {

        let svg = d3.select(selector)
            .append('svg')
            .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))

        let sources = data.map(d => d.source)
        let total = d3.sum(data, d => d.total_amount)
        let groupData = function (data, total) {
            // use scale to get percent values
            const percent = d3.scaleLinear()
                .domain([0, total])
                .range([0, 100])
            // filter out data that has zero values
            // also get mapping for next placement
            // (save having to format data for d3 stack)
            let cumulative = 0
            return data.map(d => {
                let val = (d.total_amount - d.amount_spent)/total * 100
                cumulative += val
                return {
                    value: val,
                    // want the cumulative to prior value (start of rect)
                    cumulative: cumulative - val,
                    label: d.source,
                    percent: percent(val)
                }
            })
        }

        // todo figure this out
        let xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([margin.left, width - margin.right])

        //Define scales
        let widthScale = d3.scaleLinear()
            .domain([margin.left, width - margin.right])
            .range([0, 100])

        // add title
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (margin.top / 2))
            .attr("text-anchor", "middle")
            .text(title);

        svg.append("text")
            .attr('x', margin.left - 20)
            .attr('y', height / 2)
            .text('E')

        svg.append("text")
            .attr('x', width - margin.right + 5)
            .attr('y', height / 2)
            .text('F')

        svg.append('rect')
            .attr('class', 'boarder')
            .attr('x', -1 + margin.left)
            .attr('y', -1 + height / 2 - halfBarHeight)
            .attr('height', 2+ barHeight)
            .attr('width', width - margin.left - margin.right)
            .attr('fill', 'none')
            .style('stroke', 'black')
            .style('stroke-width', '2')

        svg.selectAll(selector)
            .data(groupData(data, total)).enter()
            .append('rect')
            .attr('class', 'rect-stacked')
            .attr('x', d => margin.left + Math.floor(d.cumulative / 100 * 620))
            .attr('y', height / 2 - halfBarHeight)
            .attr('height', barHeight)
            .attr('width', d => padding + Math.ceil(d.value / 100 * 620))
            .attr('fill', 'steelblue')
            //.style('fill', (d, i) => colors[i])

        return chart;
    }

    return chart;
}