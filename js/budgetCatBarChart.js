function budgetCatBarChart() {

    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
            top: 60,
            left: 50,
            right: 30,
            bottom: 30
        },
        // todo review sizes
        width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,
        // xValue = d => d[0],
        // yValue = d => d[1],
        title = 'Percent Remaining by Funding Source (%)',
        xLabelText = 'Funding Source',
        yLabelText = 'Percent Remaining',
        padding = 1,
        yLabelOffset = 40,
        selectableElements = null,
        selectedSources = new Set(),
        dispatcher;

    // Create the chart by adding an svg to the div with the id
    // specified by the selector using the given data
    function chart(selector, data) {

        let svg = d3.select(selector)
            .append('svg')
            .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))






        return chart;
    }

    // Given selected data from another visualization select the relevant elements here (linking)
    chart.updateSelection = function (selectedData) {
        if (!arguments.length) return;

        // todo review

        // todo how to update grouped data
        selectedSources = selectedData
        // let groupedData = groupData(originalData);
        //
        // d3.selectAll("rect.total")
        //     .attr('x', margin.left + Math.floor(620 * groupedData[0].cumulative / 100))
        //     .attr('width', padding + Math.ceil(620 * groupedData[0].value / 100))
        //
        // // todo review floor / ceil and padding
        // d3.selectAll("rect.not-selected")
        //     .attr('x', margin.left + Math.floor(620 * groupedData[1].cumulative / 100))
        //     .attr('width', Math.ceil(620 * groupedData[1].value / 100))
    };

    return chart;
}