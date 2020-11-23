function budgetCatBarChart() {

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
        selectedSources = new Set(),

        categories = null,

        // function that returns whether selected sources contains the given string
        isSelected = d => selectedSources.has(d);

    // Create the chart by adding an svg to the div with the id
    // specified by the selector using the given data
    function chart(selector, funds, data, sources) {

        // set global variable
        selectedSources = new Set(sources)
        categories = new Set(data.map(d => d.category))

        // todo comment
        let get_cat_percent = c => {
                let filtered = data.filter(d => isSelected(d.source)),
                    total = d3.sum(filtered.map(d => d.amount_spent)),
                    cat = d3.sum(filtered.filter(d => c === d.category)
                        .map(d => d.amount_spent))
                return cat / total * 100;
            },

            // todo comment
            get_selected_data = () => Array.from(categories).map(c => {
                return {category: c, percent: get_cat_percent(c)}
            }),

            // define svg
            svg = d3.select(selector)
                .append('svg')
                .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '));


        console.log(get_selected_data())
        console.log(d3.sum(get_selected_data().map(d => d.percent)))


        return chart;
    }

    // Given selected data from another visualization select the relevant elements here (linking)
    chart.updateSelection = function (sources) {
        if (!arguments.length) return;

        selectedSources = sources

        // todo update bars
    };

    return chart;
}
