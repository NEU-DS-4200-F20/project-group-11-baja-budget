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
        // xLabelText = '',
        // yLabelText = '',
        padding = 1;

    // yLabelOffsetPx = 0,
    //barwidth = 50,
    //barOffset = 5
    //xScale = d3.scalePoint(),
    //yScale = d3.scaleLinear();

    // Create the chart by adding an svg to the div with the id
    // specified by the selector using the given data
    function chart(selector, data) {

        let svg = d3.select(selector)
            .append('svg')
            //.attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
        //.classed('svg-content', true);

        // svg = svg.append('g')
        //     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        //Define scales
        let xScale = d3.scaleBand()
            .domain(data.map(d => d.source))
            .range([margin.left, width - margin.right])
            .padding(0.5);

        let yScale = d3
            .scaleLinear()
            .domain([0, 100])
            .range([height - margin.bottom, margin.top]);

        let percent_spent =
            d => d.amount_spent / d.total_amount * 100;
        let percent_remaining =
            d => (d.total_amount - d.amount_spent) / d.total_amount * 100;

        //Draw Axes

        // X axis   //let xAxis =
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom().scale(xScale))
        //Add label
        // .append('text')
        // .attr('x', width - margin.left)
        // .attr('y', margin.bottom)
        // .style('stroke', 'black')
        // .text(xLabelText);

        //Y axis
        // let yAxis = svg
        //     .append('g')
        //     .attr('transform', `translate(${margin.left},0)`)
        //     .call(d3.axisLeft().scale(yScale))
        //
        //     //Add label
        //     .append('text')
        //     .attr('y', margin.bottom)
        //     .attr('x', 20)
        //     .style('stroke', 'black')
        //     .text(yLabelText);


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