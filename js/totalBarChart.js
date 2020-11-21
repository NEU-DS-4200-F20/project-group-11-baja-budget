function totalBarChart() {
    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
            top: 60,
            left: 50,
            right: 30,
            bottom: 30
        },
        width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,
        title = 'Total Remaining Budget (%)',
        padding = 1,
        barHeight = 100,
        halfBarHeight = barHeight / 2,
        //selectableElements = null,
        selectedSources = new Set(),
        dispatcher,
    selectedBar,
    remainingBar;

    // Create the chart by adding an svg to the div with the id
    // specified by the selector using the given data
    function chart(selector, data) {

        let svg = d3.select(selector)
            .append('svg')
            .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))

        let groupData = function (data) {
            // use scale to get percent values
            let percent = d3.scaleLinear()
                .domain([0, d3.sum(data, d => d.total_amount)])
                .range([0, 100])
            let cumulative = 0
            return data.map(d => {
                let val = percent(d.total_amount - d.amount_spent)
                cumulative += val
                return {
                    label: d.source,
                    value: val,
                    cumulative: cumulative - val,
                }
            })
        }

        let groupData2 = function (data) {
            // use scale to get percent values
            let percent = d3.scaleLinear()
                .domain([0, d3.sum(data, d => d.total_amount)])
                .range([0, 100])

            // todo is there a different sum?
            let percentSelected = d3.sum(data.filter(d => ! isSelected(d))
                    .map(d => percent(d.total_amount - d.amount_spent)));

            let selected = {
                label: selectedSources, // todo fix to be list of string
                value: percentSelected,
                cumulative: 0
            }

            let notSelected = {
                label: new Set(data.filter(d => isSelected(d)).map(d => d.source)),
                value: d3.sum(data.filter(d => isSelected(d))
                    .map(d => percent(d.total_amount - d.amount_spent))),
                cumulative: percentSelected
            }

            return [selected, notSelected]
        }

        // todo make sure to add removing selection when click on nothing
        selectedSources = new Set(data.map(d => d.source));

        // make data structure for the visualization
        let groupedData = groupData2(data) // groupData(data)

        // define x scale
        let xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([margin.left, width - margin.right])

        // add labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .text(title);
        svg.append("text")
            .attr('x', margin.left - 20)
            .attr('y', height / 2)
            .text('E')
        svg.append("text")
            .attr('x', width - margin.right + 5)
            .attr('y', height / 2)
            .text('F')

        // add outline
        svg.append('rect')
            .attr('class', 'outline')
            .attr('x', margin.left - 1)
            .attr('y', height / 2 - halfBarHeight - 1)
            .attr('height', barHeight + 2)
            .attr('width', width - margin.left - margin.right)


        // todo this does not make a rectangle
        selectedBar = svg.selectAll(selector)
            //.data(groupedData[0]).enter()
            .append('rect')
            .attr('x', margin.left + Math.floor(620 * groupedData[0].cumulative / 100))//xScale(d.cumulative)))
            .attr('width', padding + Math.ceil(620 * groupedData[1].value / 100))//xScale(d.value)))
            .attr('y', height / 2 - halfBarHeight)
            .attr('height', barHeight)
            .classed("selected", true)

        remainingBar =
            svg.selectAll(selector)
                //.data(groupedData[1]).enter()
                .append('rect')
                .attr('x', margin.left + Math.floor(620 * groupedData[1].cumulative / 100))//xScale(d.cumulative)))
                .attr('width', padding + Math.ceil(620 * groupedData[1].value / 100))//xScale(d.value)))
                .attr('y', height / 2 - halfBarHeight)
                .attr('height', barHeight)
                .classed("not-selected", true)


        // // add stacked rectangles
        // let bars = svg.selectAll(selector)
        //     .data(groupedData).enter()
        //     .append('rect')
        //
        // bars.attr('x', d => margin.left + Math.floor(620 * d.cumulative / 100))//xScale(d.cumulative)))
        //     .attr('width', d => padding + Math.ceil(620 * d.value / 100))//xScale(d.value)))
        //     .attr('y', height / 2 - halfBarHeight)
        //     .attr('height', barHeight)
        //     //.classed('selected', d => isSelected(d))
        //     .attr('fill', 'steelblue')
        //     // .on('click', (event, d) => {
        //     //
        //     //     selectedSources = new Set([d.label])
        //     //     console.log(selectedSources)
        //     //
        //     //     // Get the name of our dispatcher's event
        //     //     let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
        //     //     // Let other charts know
        //     //     dispatcher.call(dispatchString, this, selectedSources);
        //     //
        //     //     bars.classed("selected", d => isSelected(d))
        //     //
        //     // });


        //selectableElements = bars
        return chart;
    }

    // todo fix this to be simple string
    let isSelected = d => selectedSources.has(d.label);

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

        // todo how to update grouped data

        // selectedSources = selectedData
        // selectableElements.classed("selected", d => isSelected(d))

        // // Select an element if its datum was selected
        // selectableElements.classed('selected', d =>
        //     selectedData.includes(d)
        // );
    };

    return chart;
}