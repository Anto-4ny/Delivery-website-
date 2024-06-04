document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;

        // Simulate login process
        alert(`Login attempt with username: ${username} and password: ${password}`);
    });

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newUsername = event.target.newUsername.value;
        const newPassword = event.target.newPassword.value;

        // Simulate sign-up process
        alert(`Sign-up attempt with username: ${newUsername} and password: ${newPassword}`);
    });
});
