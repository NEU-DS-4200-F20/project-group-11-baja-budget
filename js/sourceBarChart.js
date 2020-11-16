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
        yLabelOffset = 40;

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
            .attr('fill', 'grey')
            .attr('x', d => xScale(d.source))
            .attr('y', margin.top)
            .attr('width', xScale.bandwidth())
            .attr('height', d => padding + Math.ceil(height - margin.bottom - yScale(percent_spent(d))));

        //Draw bars
        svg.selectAll(selector)
            .data(data).enter()
            .append('rect')
            .attr('fill', 'steelblue')
            .attr('x', d => xScale(d.source))
            .attr('y', d => Math.ceil(height + margin.bottom - yScale(percent_spent(d))))
            .attr('width', xScale.bandwidth())
            .attr('height', d => Math.floor(height - margin.bottom - yScale(percent_remaining(d))));
        return chart;
    }

    return chart;
}