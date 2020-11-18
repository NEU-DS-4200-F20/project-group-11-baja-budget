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

        let groupData = function (data) {
            // use scale to get percent values
            let percent = d3.scaleLinear()
                .domain([0, d3.sum(data, d => d.total_amount)])
                .range([0, 100])

            let cumulative = 0
            return data.map(d => {
                let val = percent(d.total_amount - d.amount_spent)
                cumulative += val
                return {
                    label: d.source,
                    value: val,
                    cumulative: cumulative - val,
                }
            })
        }

        // make data structure for the visualization
        let groupedData = groupData(data)

        // define x scale
        let xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([margin.left, width - margin.right])

        // add labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top / 2)
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

        // add outline
        svg.append('rect')
            .attr('class', 'outline')
            .attr('x', margin.left - 1)
            .attr('y', height / 2 - halfBarHeight - 1)
            .attr('height', barHeight + 2)
            .attr('width', width - margin.left - margin.right)

        // add stacked rectangles
        svg.selectAll(selector)
            .data(groupedData).enter()
            .append('rect')
            .attr('class', 'stacked')
            .attr('x', d => Math.floor(xScale(d.cumulative)))
            .attr('y', height / 2 - halfBarHeight)
            .attr('height', barHeight)
            .attr('width', d => padding + Math.ceil(xScale(d.value)))
            .attr('fill', 'steelblue')

        return chart;
    }

    return chart;
}