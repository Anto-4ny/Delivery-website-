//hamburger menu 
document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu toggle
    document.querySelector('.hamburger-menu').addEventListener('click', function() {
        document.querySelector('nav ul').classList.toggle('show');
    });
    
    function toggleMenu() {
        var menu = document.getElementById("menu");
        menu.classList.toggle("show-menu");
    }

                          

    // Initialize Swiper
    const swiper = new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
            delay: 3000, // 3 seconds delay between slides
            disableOnInteraction: false, // Continue autoplay after interaction
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        }
    });
});

//login and sign up pages

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;

        // Simulate login process
        alert(`Login attempt with username: ${username} and password: ${password}`);

        // Google Analytics Event Tracking
        gtag('event', 'submit', {
            'event_category': 'Form',
            'event_label': 'Login Form',
            'value': username
        });
    });

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newUsername = event.target.newUsername.value;
        const newPassword = event.target.newPassword.value;

        // Simulate sign-up process
        alert(`Sign-up attempt with username: ${newUsername} and password: ${newPassword}`);

        // Google Analytics Event Tracking
        gtag('event', 'submit', {
            'event_category': 'Form',
            'event_label': 'Sign-Up Form',
            'value': newUsername
        });
    });

    // Initialize Swiper
    const swiper = new Swiper('.swiper-container', {
        // Swiper parameters
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
});


