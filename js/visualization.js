// Immediately Invoked Function Expression to limit access to our variables
((() => {

    let second_data = null;

    // read csv file
    d3.csv('data/budget.csv').then(function (data) {
        // convert data in total amount and amount spent columns to integers
        data.forEach(function (d) {
            d.total_amount = +d.total_amount;
            d.amount_spent = +d.amount_spent;

        });
        // save variable
        second_data = data;
    })

    // read csv file
    d3.csv("data/funds.csv").then(function (data) {
        // convert data in total amount and amount spent columns to integers
        data.forEach(function (d) {
            d.total_amount = +d.total_amount;
            d.amount_spent = +d.amount_spent;
        });

        // General event type for selections, used by d3-dispatch
        // https://github.com/d3/d3-dispatch
        let dispatchString = 'selectionUpdated',

            // get list of all sources
            sources = data.map(d => d.source),

            // total budget chart
            total_fuel = totalBarChart()
            ('#total-bar-chart', data, sources),

            // source bar chart
            source_fuel = sourceBarChart()
                .selectionDispatcher(d3.dispatch(dispatchString))
                ('#source-bar-chart', data, sources),

            // budget category chart
            budget_category = budgetCatBarChart()
            ('#budget-cat-chart', data, second_data, sources);

        // When the source chart selection is updated via clicks or brushing,
        // tell the scatterplot and table to update it's selection (linking)
        source_fuel.selectionDispatcher()
            .on(dispatchString + '.src-to-total', total_fuel.updateSelection);
        source_fuel.selectionDispatcher()
            .on(dispatchString + '.src-to-category', budget_category.updateSelection);
    })
})());
