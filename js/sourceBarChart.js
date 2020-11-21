function sourceBarChart() {
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

        // define useful functions
        let percent_spent = d => d.amount_spent / d.total_amount * 100;
        let percent_remaining = d => 100 - percent_spent(d);

        // sort data in descending order of the percent remaining todo decide if want to keep
        // data.sort((a, b) => d3.descending(percent_remaining(a), percent_remaining(b)))

        //Define scales
        let xScale = d3.scaleBand()
            .domain(data.map(d => d.source))
            .range([margin.left, width - margin.right])
            .padding(0.5);
        let yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([height - margin.bottom, margin.top]);

        // add title
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (margin.top / 2))
            .attr("text-anchor", "middle")
            //.classed("viz-title", true)
            .text(title);

        //Draw Axes
        svg.append('g') // X Axis
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom().scale(xScale))
            //Add label
            .append('text')
            .attr('x', width - margin.left)
            .attr('y', margin.bottom)
            //.classed('viz-axis-label', true)
            .classed('axes', true)
            //.style('stroke', 'black') // todo try to move to css
            .text(xLabelText);

        svg.append('g') // Y Axis
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft().scale(yScale))
            //Add label
            .append('text')
            .attr('y', margin.top * (3 / 4))
            .attr('x', yLabelOffset)
            //.classed('viz-axis-label', true)
            .classed('axes', true) // todo try to move to css
            .text(yLabelText);


        //Draw bars
        svg.selectAll(selector)
            .data(data).enter()
            .append('rect')
            //.attr('fill', 'grey')
            .attr('x', d => xScale(d.source) - 1)
            .attr('y', margin.top - 1)
            .attr('width', xScale.bandwidth() + 2)
            //.attr('height', d => padding + Math.ceil(height - margin.bottom - yScale(percent_spent(d))));
            .classed('outline', true)
            .attr('height', height - margin.top - margin.bottom + 2);


        // todo make sure to add removing selection when click on nothing
        selectedSources = new Set(data.map(d => d.source));

        //Draw bars
        let bars = svg.selectAll(selector)
            .data(data).enter()
            .append('rect')

        bars.attr('y', d => height + margin.bottom - Math.ceil(yScale(percent_spent(d))))
            .attr('height', d => height - margin.bottom - Math.floor(yScale(percent_remaining(d))))
            .attr('x', d => xScale(d.source))
            .attr('width', xScale.bandwidth())
            .classed('selected', d => isSelected(d))
            .attr('fill', 'steelblue')

            .on('click', (event, d) => {
                selectedSources = new Set([d.source])
                console.log(selectedSources)

                // Get the name of our dispatcher's event
                let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
                // Let other charts know
                dispatcher.call(dispatchString, this, selectedSources);

                bars.classed("selected", d => isSelected(d))
            });





        selectableElements = bars
        return chart;
    }

    let isSelected = d => selectedSources.has(d.source);

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

        selectedSources = selectedData

        selectableElements.classed("selected", d => isSelected(d))


        // // Select an element if its datum was selected
        // selectableElements.classed('selected', d =>
        //     selectedData.includes(d)
        // );
    };

    return chart;
}