function sourceBarChart() {

    // Based on Mike Bostock's margin convention https://bl.ocks.org/mbostock/3019563
    let margin = {top: 60, left: 75, right: 30, bottom: 30},
        width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,
        title = 'Percent Remaining by Funding Source (%)',
        xLabelText = 'Funding Source',
        yLabelText = 'Percent Remaining',

        // empty variables
        bars = null,
        tooltip2 = null,
        dispatcher = null,
        all_sources = new Set(),
        selectedSources = new Set(),

        // percent spent
        percent_spent = d => d.amount_spent / d.total_amount * 100,

        // percent remaining
        percent_remaining = d => 100 - percent_spent(d),

        // function that returns whether selected sources contains the given string
        isSelected = d => selectedSources.has(d),

        // Updates the selected sources and calls dispatcher
        updateSelection = function (event, d) {
            // todo once i added this, an error started showing up
            if (d == null || !d.hasOwnProperty('source')) {
                selectedSources = new Set(all_sources)
            } else if (event.shiftKey) {
                if (selectedSources.size === all_sources.size) {
                    selectedSources = new Set([d.source])
                } else {
                    selectedSources.add(d.source)
                }
            } else {
                selectedSources = new Set([d.source])
            }
            bars.classed("selected", d => isSelected(d.source))
            // Get the name of our dispatcher's event, Let other charts know
            dispatcher.call(Object.getOwnPropertyNames(dispatcher._)[0], this, selectedSources);
        };

    // Create the chart by adding an svg to the div with the id specified by the selector using the given data
    function chart(selector, data, sources) {

        // todo make sure to add removing selection when click on nothing
        // set global variables
        selectedSources = new Set(sources);
        all_sources = new Set(sources);

        // todo decide if want to keep
        // sort data in descending order of the percent remaining
        // data.sort((a, b) => d3.descending(percent_remaining(a), percent_remaining(b)))

        // x scale
        let xScale = d3.scaleBand()
                .domain(data.map(d => d.source))
                .range([margin.left, width - margin.right])
                .padding(0.5),

            // y scale
            yScale = d3.scaleLinear()
                .domain([0, 100])
                .range([height - margin.bottom, margin.top]),

            // define svg
            svg = d3.select(selector)
                .append('svg')
                .attr('viewBox', [0, 0, width + margin.left + margin.right,
                    height + margin.bottom].join(' '));

        // append title
        svg.append("text")
            .classed('chart-title', true)
            .attr("x", width / 2)
            .attr("y", margin.top / 2)
            .text(title);

        // append x axis
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom().scale(xScale));

        // append x axis title
        svg.append('text')
            .classed('axes-label', true)
            .attr('x', width / 2)
            .attr('y', height + 10)
            .text(xLabelText);

        // append y axis
        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft().scale(yScale));

        // append y axis label
        svg.append('text')
            .classed('axes-label', true)
            .attr('y', margin.left / 2)
            .attr('x', - (height + margin.bottom) / 2)
            .attr("transform", "rotate(-90)")
            .text(yLabelText);

        // define tooltips
        tooltip2 = d3.select("#source-bar-chart")
            .data(data).enter()
            .append("div")
            .style("position", "absolute") // todo move to css
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px");

        // append and save filled bars
        bars = svg.selectAll(selector)
            .data(data).enter()
            .append('rect')
            .attr('y', d => height + margin.bottom - Math.ceil(yScale(percent_spent(d))))
            .attr('height', d => height - margin.bottom - Math.floor(yScale(percent_remaining(d))))
            .attr('x', d => xScale(d.source))
            .attr('width', xScale.bandwidth())
            .classed('bar', true)
            .classed('selected', true);

        // Append outline rectangles
        svg.selectAll(selector)
            .data(data).enter()
            .append('rect')
            .classed('outline', true)
            .attr('x', d => xScale(d.source) - 1)
            .attr('y', margin.top - 1)
            .attr('width', xScale.bandwidth() + 2)
            .attr('height', height - margin.top - margin.bottom + 2)
            .on('click', (event, d) => updateSelection(event, d))
            .on("mouseout", () => tooltip2.style("visibility", "hidden"))
            .on("mouseover", () => tooltip2.style("visibility", "visible"))
            // function that change the tooltip when user hover / move / leave a cell
            .on("mousemove", (event, d) => tooltip2
                .html(""
                    + "<p><b>Funding Source: "
                    + d.source
                    + "</b><br>Amount Spent: "
                    + d.amount_spent
                    + "<br>Amount Remaining: "
                    + Math.round((d.total_amount - d.amount_spent) * 100) / 100
                    + "</p>")
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 150) + "px"));

        // d3.select(selector).call(
        //     d3.brush()
        //         .extent([[0, 0],
        //             [width, height]])
        // )

        // todo add brushing
        // Highlight points when brushed
        // function brush(g) {
        //     const brush = d3.brush()
        //         .on('start brush', highlight)
        //         .on('end', brushEnd)
        //         .extent([
        //             [-margin.left, -margin.bottom],
        //             [width + margin.right, height + margin.top]
        //         ]);
        //
        //     ourBrush = brush;
        //     g.call(brush); // Adds the brush to this element
        //     // Highlight the selected circles.
        //     function highlight(event, d) {
        //         if (event.selection === null) return;
        //         const [
        //             [x0, y0],
        //             [x1, y1]
        //         ] = event.selection;
        //
        //         //     ()
        //         // points.classed('selected', d =>
        //         //     x0 <= X(d) && X(d) <= x1 && y0 <= Y(d) && Y(d) <= y1
        //         // );
        //
        //         updateSelection(event, d)
        //     }
        //
        //     function brushEnd(event, d) {
        //         // We don't want infinite recursion
        //         if (event.sourceEvent !== undefined && event.sourceEvent.type !== 'end') {
        //             d3.select(this).call(brush.move, null);
        //         }
        //     }
        // }

        // TODO check out his for brush
        //  https://stackoverflow.com/questions/21108915/d3-js-use-brush-over-a-sequence-of-rectangles

        return chart;
    }


    // Gets or sets the dispatcher we use for selection events
    chart.selectionDispatcher = function (_) {
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return chart;
    };

    return chart;
}
