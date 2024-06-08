document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menu-icon");
    const navLinks = document.getElementById("nav-links");
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;

    menuIcon.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    setInterval(nextSlide, 6000); // Change slide every 6 seconds

    showSlide(currentSlide); // Initialize the first slide
});

document.querySelectorAll(".box").forEach((box) => {
    box.addEventListener("click", () => {
        let websiteType =
            box.classList.contains("basic")
                ? "Basic Website"
                : box.classList.contains("advanced")
                ? "Advanced Website"
                : "Premium Website";
        let message = "I want to order the " + websiteType;
        window.location.href =
            "mailto:antocaptechnologies@gmail.com?subject=Website Order&body=" +
            encodeURIComponent(message);
    });
});

function openFullScreen(contentId) {
    window.location.href = "full_screen_page.html?contentId=" + contentId;
}

// script.js

document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
    if (username) {
        displayWelcomeMessage(username);
    }
});

function loginUser() {
    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;

    // For simplicity, this example does not validate the password.
    // In a real application, you would send the username and password to a server for validation.

    if (usernameInput && passwordInput) {
        localStorage.setItem("username", usernameInput);
        displayWelcomeMessage(usernameInput);
    } else {
        alert("Please enter both username and password.");
    }
    return false; // Prevent form submission
}

function displayWelcomeMessage(username) {
    const loginBoxContent = document.querySelector(".login-box-content");
    loginBoxContent.innerHTML = `
        <div class="welcome-message">
            <h2>Welcome, ${username}!</h2>
            <p>You are now logged in.</p>
        </div>
    `;
            }

