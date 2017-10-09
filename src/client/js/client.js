console.log("Hello There");
var tesing = document.getElementById("testing");
var result = google.script.run.getUserInfo("hello");
testing.innerHTML = "Result: " + result;

var ID_LENGTH = 8;

var id_input = document.getElementById("id_input");

var employee_found_div = document.getElementById("employee_found");
var employee_not_found_div = document.getElementById("employee_not_found");
var customer_request_div = document.getElementById("customer_request_div");
var employee_name_p = document.getElementById("employee_name");

var customer_name_input = document.getElementById("customer_name");
var customer_email_input = document.getElementById("customer_email");
var customer_submit = document.getElementById("customer-submit");

var employee_login_submit = document.getElementById("log_in_button");
var employee_logout_submit = document.getElementById("log_out_button");
var customer_request_submit = document.getElementById("customer_request_button");

//var employee_active;
function show_user(user) {

    if (user.type === "employee") {
        console.log("Showing Employee: ");
        console.log(user);
        if (user.name) {
            console.log("Employee name: ", user.name);
            // Show employee found div
            employee_found_div.classList.remove("d-none");
            employee_found_div.classList.add("d-block");

            // Hide employee not found div
            employee_not_found_div.classList.add("d-none");
            employee_not_found_div.classList.remove("d-block");

            // We do not need to keep track of 'active' employees
            // Any employee is able to customer request
            /*
            if (employee_active) {
                employee_login_submit.style.visibility = "hidden";
                employee_logout_submit.style.visibility = "visible";
                customer_request_submit.style.visibility = "visible";
            } else {
                employee_login_submit.style.visibility = "visible";
                employee_logout_submit.style.visibility = "hidden";
                customer_request_submit.style.visibility = "hidden";
            }
            */

            // Update with employee info
            employee_name_p.innerHTML = user.name;
        } else {
            // Hide employee found div
            employee_found_div.classList.add("d-none");
            employee_found_div.classList.remove("d-block");

            // Show employee not found div
            employee_not_found_div.classList.remove("d-none");
            employee_not_found_div.classList.add("d-block");

            /*
            employee_login_submit.style.visibility = "hidden";
            employee_logout_submit.style.visibility = "visible";
            customer_request_submit.style.visibility = "visible";
            */
        }
    }
}

/*
function set_employee_active(employee) {
    employee_active = employee;
    console.log("Active Employee = ", employee_active);
    show_user(employee);
}
*/

id_input.addEventListener('input', function (e) {
    console.log("Change:", id_input.value);
    var id = id_input.value;
    //Hide info when text field is empty
    employee_not_found_div.style.display = "none";
    employee_found_div.style.display = "none";
    if (id.length >= ID_LENGTH) {
        console.log("ID entered");
        google.script.run.withSuccessHandler(show_user).getUserInfo(id, true);
    }
}, false);

customer_request_submit.addEventListener("click", function (e) {
    employee_not_found_div.style.display = "none";
    employee_found_div.style.display = "none";
    employee_login_submit.style.visibility = "visible";
    employee_logout_submit.style.visibility = "hidden";
    customer_request_submit.style.visibility = "hidden";
    employee_found_div.classList.add("d-none");
    employee_found_div.classList.remove("d-block");
    employee_not_found_div.classList.add("d-none");
    employee_not_found_div.classList.remove("d-block");
    customer_request_div.style.visibility = "visible";
    customer_request_div.classList.add("d-block");
    customer_request_div.classList.remove("d-remove");
}, false);

customer_submit.addEventListener('click', function (e) {
    console.log("customer submited");
    var customer = {}
    customer.name = customer_name_input.value;
    customer.email = customer_email_input.value;
    customer.department = $("#customer-department-div input:radio:checked").val();

    console.log("name: ", customer.name);
    console.log("email: ", customer.email);
    console.log("dept: ", customer.department);

    if (customer.name !== null && customer.email !== null && customer.department != null) {
        var result = google.script.run.upload_customer_info(customer);
        console.log("Upload result: ", result);
    }
}, false);

employee_login_submit.addEventListener('click', function (e) {
    // Just need to send request to worker log
    /*
    var id = id_input.value;
    var employee_active = google.script.run.withSuccessHandler(set_employee_active).getUserInfo(id, true);
    */
}, false);

employee_logout_submit.addEventListener("click", function (e) {
    // Just need to send request to worker log

    /*
    if (employee_active)
        employee_active = null;
    else
        throw "ERR: No employee is signed in";
    id_input.value = "";
    //Hide info when text field is empty
    employee_not_found_div.style.display = "none";
    employee_found_div.style.display = "none";
    employee_login_submit.style.visibility = "visible";
    employee_logout_submit.style.visibility = "hidden";
    customer_request_submit.style.visibility = "hidden";
    employee_found_div.classList.add("d-none");
    employee_found_div.classList.remove("d-block");
    employee_not_found_div.classList.add("d-none");
    employee_not_found_div.classList.remove("d-block");
    */
}, false);