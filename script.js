// Import Firebase SDK modules
import { initializeApp } from "firebase-app";
import { getAnalytics } from "firebase-analytics.";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged, signInWithEmailAndPassword } from "firebase-auth";
import { getDatabase, ref, set, onValue } from "firebase-database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase-storage";

// Your web app's Firebase configuration
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
const auth = getAuth();
const db = getDatabase();
const storage = getStorage();

// Handle registration
window.registerUser = function () {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Validate password strength (6-8 characters including letters, underscores, and numbers)
    if (!isValidPassword(password)) {
        alert('Password must be 6-8 characters long and include letters, underscores, and numbers.');
        return false;
    }

    // Check if email or username already exists
    checkEmailAndUsernameExists(email, username)
        .then((exists) => {
            if (exists) {
                alert('Email or username already exists. Please choose another.');
                return false;
            } else {
                // Create user with email and password
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        set(ref(db, 'users/' + user.uid), {
                            username: username,
                            email: email,
                        });
                        displayWelcomeMessage(user.displayName);
                        return false;
                    })
                    .catch((error) => {
                        console.error('Error signing up:', error);
                        return false;
                    });
            }
        })
        .catch((error) => {
            console.error('Error checking email and username:', error);
            return false;
        });

    return false; // Prevent default form submission
};

// Function to validate password strength
function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[_])[A-Za-z\d_]{6,8}$/;
    return passwordRegex.test(password);
}

// Function to check if email or username exists
function checkEmailAndUsernameExists(email, username) {
    return new Promise((resolve, reject) => {
        // Check Firestore or Realtime Database for existing email or username
        // Implement your logic here to query the database
        // For simplicity, assuming Firestore example:
        const usersRef = ref(db, 'users');
        onValue(usersRef, (snapshot) => {
            const users = snapshot.val();
            for (let userId in users) {
                const user = users[userId];
                if (user.email === email || user.username === username) {
                    resolve(true); // Email or username exists
                    return;
                }
            }
            resolve(false); // Email and username are unique
        }, {
            onlyOnce: true // To retrieve data once
        });
    });
}

// Function to display welcome message
function displayWelcomeMessage(username) {
    const welcomeMessage = document.querySelector('.welcome-message');
    welcomeMessage.innerHTML = `<h2>Welcome, ${username}!</h2><p>You are now registered and logged in.</p>`;
    // Optionally, hide the signup/login forms or redirect to another page
}


// Handle product posting
document.getElementById('post-product-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert('Please log in to post a product.');
        return;
    }

    const productName = document.getElementById('product-name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    const file = document.getElementById('media').files[0];

    if (file) {
        const storageRefPath = storageRef(storage, 'products/' + user.uid + '/' + file.name);
        uploadBytes(storageRefPath, file)
            .then((snapshot) => getDownloadURL(snapshot.ref))
            .then((downloadURL) => saveProductData(user.uid, productName, description, price, category, downloadURL))
            .catch((error) => console.error('Error uploading product media:', error));
    } else {
        alert('Please upload a media file.');
    }
});

// Function to save product data
function saveProductData(uid, name, description, price, category, mediaURL) {
    const newProductRef = ref(db, 'products').push();
    set(newProductRef, {
        userId: uid,
        name: name,
        description: description,
        price: price,
        category: category,
        mediaURL: mediaURL
    })
    .then(() => {
        alert('Product posted successfully!');
        document.getElementById('post-product-form').reset();
        fetchProducts(); // Refresh product list
    })
    .catch((error) => console.error('Error posting product:', error));
}

// Function to save product data
function saveProductData(uid, name, description, price, category, mediaURL) {
    const newProductRef = ref(db, 'products').push();
    set(newProductRef, {
        userId: uid,
        name: name,
        description: description,
        price: price,
        category: category,
        mediaURL: mediaURL
    })
    .then(() => {
        alert('Product posted successfully!');
        document.getElementById('post-product-form').reset();
        fetchProducts(); // Refresh product list
    })
    .catch((error) => console.error('Error posting product:', error));
}


// Function to create product HTML element
function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.classList.add('product');

    // Construct product element (e.g., image, name, description, price, category)

    return productElement;
}

// Initial call to fetch products
fetchProducts();


// Add to cart functionality
window.addToCart = async function(productId) {
    if (!auth.currentUser) {
        alert('Please log in to add products to the cart.');
        return;
    }
    const userId = auth.currentUser.uid;
    const cartRef = ref(db, 'carts/' + userId + '/' + productId);
    try {
        await set(cartRef, true);
        alert('Product added to cart successfully!');
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }
};

// Function to handle checkout
window.checkout = function() {
    // Implement checkout process, including displaying shipping options and prices
    // Redirect or display checkout page with selected products
};
