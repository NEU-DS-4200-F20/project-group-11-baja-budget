// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

    let second_data = null;

    d3.csv('data/budget.csv').then(function (data) {


        data.forEach(function (d) {
            d.total_amount = +d.total_amount;
            d.amount_spent = +d.amount_spent;

        });

        second_data = data;
    })

    d3.csv("data/funds.csv").then(function (data) {
        data.forEach(function (d) {
            d.total_amount = +d.total_amount;
            d.amount_spent = +d.amount_spent;
        });

        // General event type for selections, used by d3-dispatch
        // https://github.com/d3/d3-dispatch
        const dispatchString = 'selectionUpdated';

        // Create a line chart given x and y attributes, labels, offsets;
        // a dispatcher (d3-dispatch) for selection events;
        // a div id selector to put our svg in; and the data to use.
        let total_fuel = totalBarChart()
        ('#total-bar-chart', data);

        let source_fuel = sourceBarChart()
            .selectionDispatcher(d3.dispatch(dispatchString))
            ('#source-bar-chart', data);

        let budget_category = budgetCatBarChart()
            ('#budget-cat-chart', second_data)

        // todo comment
        source_fuel.selectionDispatcher().on(dispatchString + '.src-to-total', total_fuel.updateSelection);
        source_fuel.selectionDispatcher().on(dispatchString + '.src-to-category', budget_category.updateSelection);
    })
})());