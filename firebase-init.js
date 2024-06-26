// firebase-init.js

// Your Firebase configuration
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

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Monitor auth state
auth.onAuthStateChanged(user => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    updateUIForLoggedInUser(user);
  } else {
    localStorage.removeItem('user');
    updateUIForLoggedOutUser();
  }
});

// Update UI functions (to be defined in each HTML page)
function updateUIForLoggedInUser(user) {
  // Update the UI to show user info
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
  auth.signOut()
    .then(() => {
      alert('User logged out successfully');
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
}
  
