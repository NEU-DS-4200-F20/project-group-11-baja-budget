function totalBarChart() {

    // Based on Mike Bostock's margin convention https://bl.ocks.org/mbostock/3019563
    let margin = {top: 60, left: 50, right: 30, bottom: 30},
        width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,
        title = 'Total Remaining Budget (%)',
        barHeight = 100,
        halfBarHeight = barHeight / 2,
        selectedSources = new Set(),
        originalData,
        xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);

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
            .attr("x", width / 2)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .text(title);
        svg.append("text")
            .attr('x', margin.left - 15)
            .attr('y', height / 2)
            .attr("text-anchor", "middle")
            .text('E')
        svg.append("text")
            .attr('x', width - margin.right + 10)
            .attr('y', height / 2)
            .attr("text-anchor", "middle")
            .text('F')

        // add outline rectangle
        svg.append('rect')
            .attr('class', 'outline')
            .attr('x', margin.left - 1)
            .attr('y', height / 2 - halfBarHeight - 1)
            .attr('height', barHeight + 2)
            .attr('width', width - margin.left - margin.right)

        // add the remaining bar
        svg.append('rect')
            .attr('x', margin.left)
            .attr('width', get_width(data))
            .attr('y', height / 2 - halfBarHeight)
            .attr('height', barHeight)
            .classed("bar", true)

        // add the selected rectangle
        svg.append('rect')
            .attr('x', margin.left)
            .attr('width', get_width(data))
            .attr('y', height / 2 - halfBarHeight)
            .attr('height', barHeight)
            .classed("selected", true)
            .classed("total", true)
            .classed("bar", true)

        return chart;
    }

    // function that returns whether selected sources contains the given string
    let isSelected = d => selectedSources.has(d);

    // function returns the width of the selected rectangle
    let get_width = data => Math.ceil(xScale(percent_selected(data)))

    // function returns the sum of percents of selected sources
    let percent_selected = function (data) {
        let percent = d3.scaleLinear()
            .domain([0, d3.sum(data, d => d.total_amount)])
            .range([0, 100])
        return d3.sum(data
            .filter(d => isSelected(d.source))
            .map(d => percent(d.total_amount - d.amount_spent)));
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
