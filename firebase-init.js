
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDJ1g4qrix-xtkJN1dtEWXZ6SSUUHt04Cw",
  authDomain: "ele-max-delivery.firebaseapp.com",
  databaseURL: "https://ele-max-delivery-default-rtdb.firebaseio.com",
  projectId: "ele-max-delivery",
  storageBucket: "ele-max-delivery.appspot.com",
  messagingSenderId: "385223965783",
  appId: "1:385223965783:web:5dc0c0b03ddd9666fb7712",
  measurementId: "G-KBJX1CEYL8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

// Monitor auth state
onAuthStateChanged(auth, user => {
  if (user) {
    // User is signed in
    localStorage.setItem('user', JSON.stringify(user));
    updateUIForLoggedInUser(user);
  } else {
    // User is signed out
    localStorage.removeItem('user');
    updateUIForLoggedOutUser();
  }
});

// Update UI functions
function updateUIForLoggedInUser(user) {
  const userDisplay = document.getElementById('user-display');
  if (userDisplay) {
    userDisplay.textContent = `Welcome, ${user.email}`;
  }

  const loginLink = document.getElementById('login-link');
  if (loginLink) {
    loginLink.style.display = 'none';
  }

  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.style.display = 'inline';
  }
}

function updateUIForLoggedOutUser() {
  const userDisplay = document.getElementById('user-display');
  if (userDisplay) {
    userDisplay.textContent = '';
  }

  const loginLink = document.getElementById('login-link');
  if (loginLink) {
    loginLink.style.display = 'inline';
  }

  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.style.display = 'none';
  }
}

// Logout function
function logoutUser() {
  signOut(auth)
    .then(() => {
      alert('User logged out successfully');
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
}

// Validation functions
function isUsernameValid(username) {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return usernameRegex.test(username);
}

function isPasswordStrong(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d_]{6,8}$/;
  return passwordRegex.test(password);
}

function validateForm(username, email, password) {
  if (!isUsernameValid(username)) {
    alert('Username must contain only letters, numbers, and underscores.');
    return false;
  }
  
  if (password.length < 6 || password.length > 8) {
    alert('Password must be 6-8 characters long.');
    return false;
  }

  if (!isPasswordStrong(password)) {
    alert('Password must contain at least one uppercase letter, one lowercase letter, and one number.');
    return false;
  }

  if (username === password) {
    alert('Username cannot be the same as the password.');
    return false;
  }

  if (email === password) {
    alert('Email cannot be the same as the password.');
    return false;
  }

  return true;
}

// User registration function
function registerUser(event) {
  event.preventDefault();
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  if (!validateForm(username, email, password)) {
    return false;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Save additional user data in the database
      set(ref(database, 'users/' + user.uid), {
        username: username,
        email: email,
      });
      alert('User registered successfully');
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });

  return false;
}

// User login function
function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert('User logged in successfully');
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });

  return false;
}
      
