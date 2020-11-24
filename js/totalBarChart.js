function totalBarChart() {

    // Based on Mike Bostock's margin convention https://bl.ocks.org/mbostock/3019563
    let margin = {top: 60, left: 50, right: 30, bottom: 50},
        width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,
        title = 'Total Remaining Budget',
        left_label = "E",
        right_label = "F",
        barHeight = height - margin.top - margin.bottom,
        barWidth = width - margin.left - margin.right,
        selectedSources = new Set(),

        // x scale function
        xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]),

        // function that returns whether selected sources contains the given string
        isSelected = d => selectedSources.has(d),

        // function returns the sum of percents of selected sources
        percent_selected = function (data) {
            let percent = d3.scaleLinear()
                .domain([0, d3.sum(data, d => d.total_amount)])
                .range([0, 100])
            return d3.sum(data
                .filter(d => isSelected(d.source))
                .map(d => percent(d.total_amount - d.amount_spent)));
        },

        // function returns the width of the selected rectangle
        get_width = data => Math.ceil(xScale(percent_selected(data))),
        originalData = null;

    // Create the chart by adding an svg to the div with the id specified by the selector using the given data
    function chart(selector, data, sources) {

        // define view box and scg object
        let svg = d3.select(selector)
            .append('svg')
            .attr('viewBox', [0, 0, width + margin.left + margin.right, height].join(' '))

        // save data to global constant, set selected sources to include all sources
        originalData = data
        selectedSources = new Set(sources);

        // add labels
        svg.append("text")
            .classed('chart-title', true)
            .attr("x", width / 2)
            .attr("y", margin.top / 2)
            .text(title);

        svg.append("text")
            .classed('chart-title', true)
            .attr('x', margin.left - 20)
            .attr('y', margin.top + barHeight / 2 + 25 / 2)
            .attr('font-size', '25')
            .text(left_label);

        svg.append("text")
            .classed('chart-title', true)
            .attr('x', width - margin.right + 15)
            .attr('y', margin.top + barHeight / 2 + 25 / 2)
            .attr('font-size', '25')
            .text(right_label);

        // add the remaining bar
        svg.append('rect')
            .classed("bar", true)
            .attr('x', margin.left)
            .attr('y', margin.top)
            .attr('width', get_width(data))
            .attr('height', barHeight);

        // add the selected rectangle
        svg.append('rect')
            .classed("bar", true)
            .classed("total", true)
            .classed("selected", true)
            .attr('x', margin.left)
            .attr('y', margin.top)
            .attr('width', get_width(data))
            .attr('height', barHeight);

        // add outline rectangle
        svg.append('rect')
            .classed('outline', true)
            .attr('x', margin.left - 1)
            .attr('y', margin.top - 1)
            .attr('width', barWidth + 2)
            .attr('height', barHeight + 2);

        // add scale
        svg.append("g")
            .attr('transform', `translate(${margin.left},${margin.top + barHeight + 1})`)
            .call(d3.axisBottom(
                d3.scaleOrdinal()
                    .domain(["0", "1/4", "1/2", "3/4", "1"])
                    .range([0, barWidth / 4, barWidth / 2, barWidth * 3 / 4, barWidth])));

        return chart;
    }

    // Given selected data from another visualization select the relevant elements here (linking)
    chart.updateSelection = function (selectedData) {
        if (!arguments.length) return;
        selectedSources = selectedData
        d3.selectAll("rect.total")
            .attr('x', margin.left)
            .attr('width', get_width(originalData));
    };

    return chart;
}
