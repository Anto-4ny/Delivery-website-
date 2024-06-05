//hamburger menu 
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    document.querySelector('.hamburger-menu').addEventListener('click', function() {
        console.log('Hamburger menu clicked');
        document.querySelector('nav ul').classList.toggle('show');
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


