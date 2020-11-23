function totalBarChart() {
    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
            top: 60,
            left: 50,
            right: 30,
            bottom: 30
        },
        // todo fix the view box size
        width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,
        title = 'Total Remaining Budget (%)',
        padding = 1,
        barHeight = 100,
        halfBarHeight = barHeight / 2,
        selectedSources = new Set(),
        selectedBar,
        remainingBar,
        groupedData,
        originalData,
        xScale;

    // Create the chart by adding an svg to the div with the id
    // specified by the selector using the given data
    function chart(selector, data) {

        let svg = d3.select(selector)
            .append('svg')
            .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))

        // todo make sure to add removing selection when click on nothing
        // todo is there a better way to do this (need global access)
        originalData = data
        selectedSources = new Set(data.map(d => d.source));
        groupedData = groupData(data)

        // define x scale
        xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([margin.left, width - margin.right])

        // add labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .text(title);
        svg.append("text")
            .attr('x', margin.left - 15)
            .attr('y', height / 2)
            .attr("text-anchor", "middle")
            .text('E')
        svg.append("text")
            .attr('x', width - margin.right + 10)
            .attr('y', height / 2)
            .attr("text-anchor", "middle")
            .text('F')

        // add outline
        svg.append('rect')
            .attr('class', 'outline')
            .attr('x', margin.left - 1)
            .attr('y', height / 2 - halfBarHeight - 1)
            .attr('height', barHeight + 2)
            .attr('width', width - margin.left - margin.right)

        // add the selected rectangle
        selectedBar = svg
            .append('rect')
            .attr('x', margin.left + Math.floor(620 * groupedData[0].cumulative / 100))
            .attr('width', padding + Math.ceil(620 * groupedData[0].value / 100))
            .attr('y', height / 2 - halfBarHeight)
            .attr('height', barHeight)
            .classed("selected", true)
            .classed("total", true)
            .classed("bar", true)

        // todo double check that x and width calculations are good,
        //  the right boarder of a gray rect moves
        // add the unselected rectangle
        remainingBar = svg
            .append('rect')
            .attr('x', margin.left + Math.floor(620 * groupedData[1].cumulative / 100))
            .attr('width', Math.ceil(620 * groupedData[1].value / 100))
            .attr('y', height / 2 - halfBarHeight)
            .attr('height', barHeight)
            .classed("not-selected", true)
            .classed("bar", true)



        return chart;
    }

    let groupData = function (data) {
        // use scale to get percent values
        let percent = d3.scaleLinear()
            .domain([0, d3.sum(data, d => d.total_amount)])
            .range([0, 100])

        // todo is there a different sum?
        let percentSelected = d3.sum(data.filter(d => isSelected(d.source))
            .map(d => percent(d.total_amount - d.amount_spent)));

        let selected = {
            label: selectedSources, // todo fix to be list of string
            value: percentSelected,
            cumulative: 0
        }

        let notSelected = {
            label: new Set(data.filter(d => !isSelected(d.source)).map(d => d.source)),
            value: d3.sum(data.filter(d => !isSelected(d.source))
                .map(d => percent(d.total_amount - d.amount_spent))),
            cumulative: percentSelected
        }

        return [selected, notSelected]
    }

    // todo fix this to be simple string
    let isSelected = d => selectedSources.has(d);


    // Given selected data from another visualization select the relevant elements here (linking)
    chart.updateSelection = function (selectedData) {
        if (!arguments.length) return;

        // todo how to update grouped data
        selectedSources = selectedData
        let groupedData = groupData(originalData);

        d3.selectAll("rect.total")
            .attr('x', margin.left + Math.floor(620 * groupedData[0].cumulative / 100))
            .attr('width', padding + Math.ceil(620 * groupedData[0].value / 100))

        // todo review floor / ceil and padding
        d3.selectAll("rect.not-selected")
            .attr('x', margin.left + Math.floor(620 * groupedData[1].cumulative / 100))
            .attr('width', Math.ceil(620 * groupedData[1].value / 100))
    };

    return chart;
}
