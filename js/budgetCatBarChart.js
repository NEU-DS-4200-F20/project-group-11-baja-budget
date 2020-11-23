function budgetCatBarChart() {

    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {top: 60, left: 50, right: 30, bottom: 30},
        // todo review sizes
        width = 700 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom,
        selectedSources = new Set(),
        // todo review
        title = 'Percent of Total Spent by Budget Category (%)',
        xLabelText = 'Budget Category',
        yLabelText = 'Percent Spent',
        categories = null,
        bars = null,
        original_data = null,
        tooltip2 = null,

        // y scale
        yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([height - margin.bottom, margin.top]),

        // todo comment
        get_cat_percent = c => {
            let filtered = original_data.filter(d => d.amount_spent !== 0 || selectedSources.has(d.source)),
                total = d3.sum(filtered.map(d => d.amount_spent)),
                cat = d3.sum(filtered.filter(d => c === d.category)
                    .map(d => d.amount_spent))

            //console.log(filtered)
            if (filtered.length === 0) {
                return 0
            }
            return cat / total * 100;
        },

        // todo comment
        get_selected_data = () => Array.from(categories).map(c => {
            //console.log('c = ' + c + ' percent = ' +  get_cat_percent(c))
            return {category: c, percent: get_cat_percent(c)}
        });

    // Create the chart by adding an svg to the div with the id specified by the selector using the given data
    // todo might not need funds
    function chart(selector, funds, data, sources) {

        // set global variable
        original_data = data
        selectedSources = new Set(sources)
        categories = new Set(data.map(d => d.category))

        // todo comment
        let

            // x scale
            xScale = d3.scaleBand()
                .domain(get_selected_data().map(d => d.category))
                .range([margin.left, width - margin.right])
                .padding(0.5),

            // define svg
            svg = d3.select(selector)
                .append('svg')
                .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.bottom].join(' '));

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
            .attr('y', margin.left / 4)
            .attr('x', -(height + margin.bottom) / 2)
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

        // append filled bars and save them in a variable
        bars = svg.selectAll(selector)
            .data(get_selected_data()).enter()
            .append('rect');

        bars.attr('y', d => Math.ceil(yScale(d.percent)))
            .attr('height', d => height - margin.bottom - Math.floor(yScale(d.percent)))
            .attr('x', d => xScale(d.category))
            .attr('width', xScale.bandwidth())
            .classed('bar', true)
            .classed('selected', true);

        // Append outline rectangles
        svg.selectAll(selector)
            .data(get_selected_data()).enter()
            .append('rect')
            .classed('outline', true)
            .attr('x', d => xScale(d.category) - 1)
            .attr('y', margin.top - 1)
            .attr('width', xScale.bandwidth() + 2)
            .attr('height', height - margin.top - margin.bottom + 2)
            .on("mouseout", () => tooltip2.style("visibility", "hidden"))
            .on("mouseover", () => tooltip2.style("visibility", "visible"))
            // function that change the tooltip when user hover / move / leave a cell
            .on("mousemove", (event, d) => tooltip2
                .html(""
                    + "<p><b>Budget Category: "
                    + d.category
                    + "</b><br>Proportion of Total Amount Spent: "
                    + Math.round((d.percent) * 100) / 100
                    + "%</p>")
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 150) + "px"));

        return chart;
    }

    // Given selected data from another visualization select the relevant elements here (linking)
    chart.updateSelection = function (sources) {
        if (!arguments.length) return;

        selectedSources = sources

        console.log(selectedSources)
        let selected_data = get_selected_data()

        console.log(selected_data)

        bars.data(selected_data).enter()
            .attr('y', d => Math.ceil(yScale(d.percent)))
            .attr('height', d => height - margin.bottom - Math.floor(yScale(d.percent)))
    };

    return chart;
}
