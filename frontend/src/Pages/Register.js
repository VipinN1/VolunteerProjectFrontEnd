function invalidHighlight() {
    let email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let user_pass_regex = /^[a-zA-Z0-9-]/;
    x = document.getElementById("email");
    y = document.getElementById("username");
    z = document.getElementById("password");

    if (email_regex.text(x)) {
        x.style.border = "1px solid black";
    }
    else {
        x.style.border = "2px solid red";
    }

    if (user_pass_regex.text(y)) {
        y.style.border = "1px solid black";
    }
    else {
        y.style.border = "2px solid red";
    }

    if (user_pass_regex.text(z)) {
        z.style.border = "1px solid black";
    }
    else {
        z.style.border = "2px solid red";
    }
}