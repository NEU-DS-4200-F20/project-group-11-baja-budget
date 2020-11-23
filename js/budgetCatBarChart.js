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
        selectedSources = new Set();

    // Create the chart by adding an svg to the div with the id
    // specified by the selector using the given data
    function chart(selector, data, sources) {

        let svg = d3.select(selector)
            .append('svg')
            .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))

        selectedSources = new Set(sources)




        return chart;
    }

    // Given selected data from another visualization select the relevant elements here (linking)
    chart.updateSelection = function (selectedData) {
        if (!arguments.length) return;

        // todo review

        // todo how to update grouped data
        selectedSources = selectedData
    };

    return chart;
}
