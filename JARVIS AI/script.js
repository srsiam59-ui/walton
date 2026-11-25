
// DEMO LOGIN INFORMATION
const correctEmail = "waltonbd@gmail.com";
const correctPassword = "walton5975";

// Password Show / Hide
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function() {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.innerText = "HIDE";
    } else {
        passwordInput.type = "password";
        togglePassword.innerText = "SHOW";
    }

});

// Login System
document.getElementById("loginForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;
    const message = document.getElementById("message");
    const button = document.getElementById("loginBtn");

    if (
        email === correctEmail &&
        password === correctPassword
    ) {

        message.style.color = "#00e99a";
        message.innerText = "Login Successful!";

        button.disabled = true;
        button.innerText = "PLEASE WAIT...";

        setTimeout(function() {
            window.location.href = "MY WEBSITE/index.html"
        }, 1000);

    } else {

        message.style.color = "#ff5555";
        message.innerText = "Incorrect Email or Password!";

    }

});
