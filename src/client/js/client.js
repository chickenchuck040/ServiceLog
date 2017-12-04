
var requests_div = document.getElementById("requests");

var alerts_div = document.getElementById("alerts");

var employee_card = new CardLookup(
    "Employee", 
    document.getElementById("employee_card"),
    "employee",
    false,
);

var customer_card = new CardLookup(
    "Customer", 
    document.getElementById("customer_card"),
    "customer",
    true,
);

/*
var search = new Search(
    document.getElementById("search"),
    [
        {
            name: "Request",
            type: "request"
        },
        {
            name: "Loan",
            type: "loan"
        },
        {
            name: "Return",
            type: "return"
        },
        {
            name: "Other",
            type: "other"
        }
    ]
);
*/

var search = new Search (
    document.getElementById("search"),
    [
        // Scanned an instrument
        {
            regex: /^[0-9]{11}$/,
            on_match: function (input, on_add) {
                var div = document.createElement("div");

                google.script.run.withSuccessHandler(function (instrument) {

                    if (instrument.manufacturer) {
                        var name = document.createElement("h5");
                        name.classList += " mb-1";
                        name.textContent = instrument.manufacturer + " " + instrument.part_number;

                        var subtitle = document.createElement("p");
                        subtitle.classList += " mb-1 text-secondary";
                        subtitle.textContent = " S/N: " + instrument.serial_number + " (" + input + ")";

                        div.appendChild(name);
                        div.appendChild(subtitle);

                        var add_button = document.createElement("button");
                        add_button.type = "button";
                        add_button.classList += " btn";
                        add_button.classList += " btn-success";
                        add_button.textContent = "Add";


                        if(instrument.current_location === "Home Location"){

                            name.textContent = "Loan: " + name.textContent;

                            var input_group = document.createElement("div");
                            input_group.classList += " input-group";
                            input_group.classList += " d-flex";

                            var input_text = document.createElement("span");
                            input_text.classList += "input-group-addon";
                            input_text.textContent = "New location";

                            var location = document.createElement("input");
                            location.type = "text";
                            location.classList += " form-control";
                            location.focus();

                            var button_box = document.createElement("div");
                            button_box.classList += "input-group-btn";

                            add_button.addEventListener('click', function (e) {
                                instrument.current_location = location.value;
                                on_add({
                                    search: input,
                                    type: "instrument-loan",
                                    name: "Instrument Loan",
                                    data: instrument,
                                });
                            }, false);

                            button_box.appendChild(add_button);

                            input_group.appendChild(input_text);
                            input_group.appendChild(location);
                            input_group.appendChild(button_box);

                            div.appendChild(input_group);
                        } else {
                            name.textContent = "Return: " + name.textContent;

                            add_button.addEventListener('click', function (e) {
                                instrument.current_location = instrument.home_location;
                                on_add({
                                    search: input,
                                    type: "instrument-return",
                                    name: "Instrument Return",
                                    data: instrument,
                                });
                            }, false);

                            div.appendChild(add_button);
                        }
                    } else {
                        var name = document.createElement("h5");
                        name.classList += " mb-1";
                        name.textContent = "Instrument not found";

                        div.appendChild(name);
                    }
                }).equipment_search(input);

                return div;
            },
        },

        // Not an instrument
        {
            regex: /.+/,
            on_match: function (input, on_add) {
                var div = document.createElement("div");
                div.classList += " btn-group";
                div.role = "group";

                var request_button = document.createElement("button");
                request_button.classList += " btn btn-success";
                request_button.textContent = "Request";
                request_button.addEventListener('click', function (e) {
                    on_add({
                        search: input,
                        type: "request",
                        name: "Request",
                        data: {}
                    });
                });
                div.appendChild(request_button);

                var loan_button = document.createElement("button");
                loan_button.classList += " btn btn-success";
                loan_button.textContent = "Loan";
                loan_button.addEventListener('click', function (e) {
                    on_add({
                        search: input,
                        type: "loan",
                        name: "Loan",
                        data: {}
                    });
                });
                div.appendChild(loan_button);

                var return_button = document.createElement("button");
                return_button.classList += " btn btn-success";
                return_button.textContent = "Return";
                return_button.addEventListener('click', function (e) {
                    on_add({
                        search: input,
                        type: "return",
                        name: "Return",
                        data: {}
                    });
                });
                div.appendChild(return_button);

                var service_button = document.createElement("button");
                service_button.classList += " btn btn-success";
                service_button.textContent = "Service";
                service_button.addEventListener('click', function (e) {
                    on_add({
                        search: input,
                        type: "service",
                        name: "Service",
                        data: {}
                    });
                });
                div.appendChild(service_button);

                return div;
            },
        },
    ],
    function(service) {
        console.log(search);
        search.focus();
        service_list.add_service(service);
        console.log(service);
    }
);

var service_list = new ServiceList(
    requests_div
);

var submit = new Submit(
    document.getElementById("submit")
);

var employee = null;
var customer = null;

employee_card.focus();
employee_card.on_success = function(user) {
    customer_card.focus();
    employee = user;
}

employee_card.on_failure = function(user) {
    employee = null;
}

customer_card.on_success = function(user) {
    console.log(search);
    search.focus();
    customer = user;
}

customer_card.on_failure = function(user) {
    customer = null;
}

/*
search.on_add = function(service) {
    search.focus();
    service_list.add_service(service);
    console.log(service);
}
*/

submit.get_info = function() {
    return {
        services: service_list.services,
        employee: employee,
        customer: customer
    }
}

submit.on_submit = function() {
    employee_card.focus();

    employee_card.clear();
    customer_card.clear();
    service_list.clear();
    employee = null;
    customer = null;

    show_alert("Submission successful", "success");
}

submit.on_failed_submit = function() {
    if(employee === null){
        employee_card.focus();
    }else{
        customer_card.focus();
    }    
    show_alert("Both an employee and a customer are required for submission", "danger");
}

function show_alert(alert_text, level){

    while(alerts_div.firstChild){
        alerts_div.removeChild(alerts_div.firstChild);
    }

    var alert = document.createElement("div");
    alert.classList += " alert";
    alert.classList += " alert-" + level;
    alert.role = "alert";

    var text = document.createElement("p");
    text.textContent = alert_text;
    alert.appendChild(text);

    alerts_div.appendChild(alert);
}
