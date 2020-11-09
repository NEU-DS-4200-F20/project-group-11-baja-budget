/* global D3 */

// Initialize a line chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function horizontalbarchart() {


    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
            top: 60,
            left: 50,
            right: 30,
            bottom: 35
        },
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        xValue = d => d[0],
        yValue = d => d[1],
        xLabelText = '',
        yLabelText = '',
        yLabelOffsetPx = 0,
        xScale = d3.scalePoint(),
        yScale = d3.scaleLinear(),
        ourBrush = null,
        selectableElements = d3.select(null),
        dispatcher;


    // Create the chart by adding an svg to the div with the id
    // specified by the selector using the given data
    function chart(selector, data) {

        let svg = d3.select(selector)
            .append('svg')
            .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        return chart
    }


    // Gets or sets the dispatcher we use for selection events
    chart.selectionDispatcher = function (_) {
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return chart;
    };

    // Given selected data from another visualization
    // select the relevant elements here (linking)
    chart.updateSelection = function (selectedData) {
        if (!arguments.length) return;

        // Select an element if its datum was selected
        selectableElements.classed('selected', d =>
            selectedData.includes(d)
        );
    };

    chart.x = function (_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.y = function (_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };


    // The x-accessor from the datum
    function X(d) {
        return xScale(xValue(d));
    }

    // The y-accessor from the datum
    function Y(d) {
        return yScale(yValue(d));
    }


    return chart;
}