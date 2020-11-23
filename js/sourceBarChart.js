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
        selectedSources = new Set(),
        dispatcher,
        ourBrush;

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

        svg.call(brush);

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
            .classed('axes', true)
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


        // Append outline rectangles
        svg.selectAll(selector)
            .data(data).enter()
            .append('rect')
            .classed('outline', true)
            .attr('x', d => xScale(d.source) - 1)
            .attr('y', margin.top - 1)
            .attr('width', xScale.bandwidth() + 2)
            .attr('height', height - margin.top - margin.bottom + 2);

        // Create Tooltips
        let tooltip2 = d3.select("#source-bar-chart")
            .data(data).enter()
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")


//  function that change the tooltip when user hover / move / leave a cell
        let mousemove = function(event, d) {
            tooltip2
                .html(
                    "<p><b>Funding Source: "
                    + d.source
                    +"</b><br>Amount Spent: "
                    + d.amount_spent
                    +"<br>Amount Remaining: "
                    + Math.round((d.total_amount - d.amount_spent) * 100) / 100
                    +"</p>"
        )
        .style("left", (event.pageX) + "px")
                .style("top", (event.pageY-150) + "px")
        }
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
            .classed('bar', true)
            .classed('selected', d => isSelected(d))
            .on("mouseover", function(){return tooltip2.style("visibility", "visible");})
            .on("mousemove", mousemove)
            .on("mouseout", function(){return tooltip2.style("visibility", "hidden");})
            .on('click', (event, d) => {
                selectedSources = new Set([d.source])
                console.log(selectedSources)
                // Get the name of our dispatcher's event
                let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
                // Let other charts know
                dispatcher.call(dispatchString, this, selectedSources);
                bars.classed("selected", d => isSelected(d))
            });

        // todo add brushing


        // Highlight points when brushed
        function brush(g) {
            const brush = d3.brush()
                .on('start brush', highlight)
                .on('end', brushEnd)
                .extent([
                    [-margin.left, -margin.bottom],
                    [width + margin.right, height + margin.top]
                ]);
            ourBrush = brush;
            g.call(brush); // Adds the brush to this element
            // Highlight the selected circles.
            function highlight(event, d) {
                if (event.selection === null) return;
                const [
                    [x0, y0],
                    [x1, y1]
                ] = event.selection;
                // todo
                selectedSources = new Set()
                //     ()
                // points.classed('selected', d =>
                //     x0 <= X(d) && X(d) <= x1 && y0 <= Y(d) && Y(d) <= y1
                // );
                // todo review
                // Get the name of our dispatcher's event
                let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
                // Let other charts know
                dispatcher.call(dispatchString, this, selectedSources);
                bars.classed("selected", d => isSelected(d))
            }
            function brushEnd(event, d) {
                // We don't want infinite recursion
                if(event.sourceEvent !== undefined && event.sourceEvent.type!='end'){
                    d3.select(this).call(brush.move, null);
                }
            }
        }

        return chart;
    }

    let isSelected = d => selectedSources.has(d.source);

    // Gets or sets the dispatcher we use for selection events
    chart.selectionDispatcher = function (_) {
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return chart;
    };

    return chart;
}