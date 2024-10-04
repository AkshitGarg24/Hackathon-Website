document.getElementById("registrationForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    const messageDiv = document.getElementById("message");

    // Password validation: at least 8 characters and one special character
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/;

    if (password !== confirmPassword) {
        showMessage("Passwords do not match", "error");
        return;
    }

    if (!passwordRegex.test(password)) {
        showMessage("Password must be at least 8 characters long and contain at least one special character", "error");
        return;
    }

    const formData = new FormData(this);
    const response = await fetch("/register", {
        method: "POST",
        body: formData
    });

    const result = await response.json();

    if (result.success) {
        showMessage(result.message, "success");
        this.reset();
    } else {
        showMessage(result.message, "error");
    }
});

// Function to show messages with animation
function showMessage(message, type) {
    const messageDiv = document.getElementById("message");
    messageDiv.innerHTML = message;
    messageDiv.classList.remove("success", "error", "show");
    messageDiv.classList.add(type);
    setTimeout(() => {
        messageDiv.classList.add("show");
    }, 10);

    setTimeout(() => {
        messageDiv.classList.remove("show");
    }, 3000);
}
