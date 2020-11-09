function sourceBarChart() {
    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
        top: 60,
        left: 50,
        right: 30,
        bottom: 30
    },
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        // xValue = d => d[0],
        // yValue = d => d[1],
        xLabelText = '',
        yLabelText = '',
        // yLabelOffsetPx = 0,
        barwidth = 50,
        barOffset = 5
    //xScale = d3.scalePoint(),
    //yScale = d3.scaleLinear();

    // Create the chart by adding an svg to the div with the id
    // specified by the selector using the given data
    function chart(selector, data) {

        let svg = d3.select(selector)
            .append('svg')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
        //.classed('svg-content', true);

        svg = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        //Define scales
        let xScale = d3.scaleBand()
            .domain(
                data.map(function (d) {
                    return d.source;
                })
            )
            .range([margin.left, width - margin.right])
            .padding(0.5);

        let yScale = d3
            .scaleLinear()
            .domain([0, 100])
            .range([height - margin.bottom, margin.top]);

        //Draw Axes

        // X axis
        let xAxis = svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom().scale(xScale))

            //Add label
            .append('text')
            .attr('x', width - margin.left)
            .attr('y', margin.bottom)
            .style('stroke', 'black')
            .text(xLabelText);
/*
        //Y axis
        let yAxis = svg
            .append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft().scale(yScale))

            //Add label
            .append('text')
            .attr('y', margin.bottom)
            .attr('x', 20)
            .style('stroke', 'black')
            .text(yLabelText);
*/


        //Draw bars
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', function (d) {
                return xScale(d.source);
            })
            .attr('y', function (d) {
                //not exactly at 100, figure this out later pls (...)
                console.log(d.amount_spent/d.total_amount)
                return margin.top;
                //return height + margin.bottom - yScale((d.amount_spent / d.total_amount));
                
            })
            .attr('width', xScale.bandwidth())
            .attr('fill', 'grey')
            .attr('height', function (d) {
                return height - margin.bottom - yScale((d.amount_spent / d.total_amount) * 100);
                //return height - margin.bottom - yScale(d.amount_spent);
            });

        //Draw bars
        svg.selectAll('#main-bar-chart')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', function (d) {
                return xScale(d.source);
            })
            .attr('y', function (d) {
                console.log(((d.total_amount - d.amount_spent) / d.total_amount) * 100)
                return height + margin.bottom - yScale((d.amount_spent / d.total_amount) * 100);
            })
            .attr('width', xScale.bandwidth())
            .attr('fill', 'steelblue')
            .attr('height', function (d) {
                return height - margin.bottom - yScale(((d.total_amount - d.amount_spent) / d.total_amount) * 100);
                //return height - margin.bottom - yScale(d.amount_spent);
            });


        return chart;
    }

    return chart;
}

/*
//Define data
let data = [
    {name: 'John', rating: 5},
    {name: 'Arya', rating: 6},
    {name: 'Jamie', rating: 7},
    {name: 'Daenerys', rating: 9},
    {name: 'Cersei', rating: 2},
    {name: 'Ramsay', rating: 4}
];

let barwidth = 50;
let barOffset = 5;

//Generate SVG
let width = 600,
    height = 400;
let margin = {
    top: 40,
    bottom: 30,
    left: 30,
    right: 30
};

let svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', '#e9f7f2');

// Define Scales
let yScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([height - margin.bottom, margin.top]);

let xScale = d3
    .scaleBand()
    .domain(
        data.map(function (d) {
            return d.name;
        })
    )
    .range([margin.left, width - margin.right])
    .padding(0.5);

//Draw Axes
let yAxis = svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft().scale(yScale))

    //Add label
    .append('text')
    .attr('y', 30)
    .attr('x', 20)
    .style('stroke', 'black')
    .text('Rating');

let xAxis = svg
    .append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom().scale(xScale))

    //Add label
    .append('text')
    .attr('x', width - margin.left)
    .attr('y', -10)
    .style('stroke', 'black')
    .text('Names');

//Draw bars
let bar = svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', function (d) {0
        return xScale(d.name);
    })
    .attr('y', function (d) {
        return yScale(d.rating);
    })
    .attr('width', xScale.bandwidth())
    .attr('fill', 'steelblue')
    .attr('height', function (d) {
        return height - margin.bottom - yScale(d.rating);
    });
 */