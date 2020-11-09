// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

    d3.csv("data/funds.csv").then(function (data) {

        data.forEach(function(d) {
            d.total_amount = +d.total_amount;
            d.amount_spent = +d.amount_spent;
        });

        console.log(data)


        // General event type for selections, used by d3-dispatch
        // https://github.com/d3/d3-dispatch
        const dispatchString = 'selectionUpdated';

        // Create a line chart given x and y attributes, labels, offsets;
        // a dispatcher (d3-dispatch) for selection events;
        // a div id selector to put our svg in; and the data to use.
        let total_fuel = sourceBarChart()
            //.selectionDispatcher(d3.dispatch(dispatchString))
            ('#main-bar-chart', data);

    })
})());