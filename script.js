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

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "password123") {
        alert("Login successful!");
    } else {
        alert("Invalid username or password.");
    }
});
                          
