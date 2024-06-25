import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, push, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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
const auth = getAuth();
const db = getDatabase();
const storage = getStorage();

// Handle registration
function registerUser() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            db.ref('users/' + user.uid).set({
                username: username,
                email: email
            });
            displayProfileIcon(user);
        })
        .catch((error) => {
            console.error('Error signing up:', error);
        });

    return false; // Prevent form submission
}

function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            displayProfileIcon(user);
        })
        .catch((error) => {
            console.error('Error logging in:', error);
        });

    return false; // Prevent form submission
}

document.getElementById('google-signup').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            db.ref('users/' + user.uid).set({
                username: user.displayName,
                email: user.email,
                profilePicture: user.photoURL
            });
            displayProfileIcon(user);
        })
        .catch((error) => {
            console.error('Error signing up with Google:', error);
        });
});

document.getElementById('facebook-signup').addEventListener('click', () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            db.ref('users/' + user.uid).set({
                username: user.displayName,
                email: user.email,
                profilePicture: user.photoURL
            });
            displayProfileIcon(user);
        })
        .catch((error) => {
            console.error('Error signing up with Facebook:', error);
        });
});

document.getElementById('google-login').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            displayProfileIcon(user);
        })
        .catch((error) => {
                       console.error('Error logging in with Google:', error);
        });
});

document.getElementById('facebook-login').addEventListener('click', () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            displayProfileIcon(user);
        })
        .catch((error) => {
            console.error('Error logging in with Facebook:', error);
        });
});

// Function to display profile icon and hide login/signup forms
function displayProfileIcon(user) {
    const profileIcon = document.createElement('div');
    profileIcon.classList.add('profile-icon');
    const profileImage = document.createElement('img');
    profileImage.src = user.photoURL;
    profileIcon.appendChild(profileImage);
    
    const accountLinks = document.querySelector('.account-links');
    accountLinks.innerHTML = ''; // Clear existing links
    accountLinks.appendChild(profileIcon);

    // Hide login/signup forms and welcome message
    const signupForm = document.getElementById('signup-form');
    signupForm.style.display = 'none';
    const loginForm = document.getElementById('login-form');
    loginForm.style.display = 'none';
    const welcomeMessage = document.querySelector('.welcome-message');
    welcomeMessage.style.display = 'none';
}

// Function to check user authentication state on page load
function checkAuthState() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            displayProfileIcon(user);
        } else {
            // User is signed out
            const accountLinks = document.querySelector('.account-links');
            accountLinks.innerHTML = ''; // Clear existing profile icon
            accountLinks.innerHTML = `<a href="#" id="sign-in-link">Sign In</a>
                                      <a href="#" id="join-free-link">Join Free</a>`;
        }
    });
}

// Switching between sign up and login forms
document.getElementById('switch-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

document.getElementById('switch-to-signup').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
});

// Initial call to check authentication state
checkAuthState();
//profpage
document.addEventListener('DOMContentLoaded', () => {
    // Handle product form submission
    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const productName = productForm.querySelector('#productName').value;
        const productPrice = productForm.querySelector('#productPrice').value;
        const productDescription = productForm.querySelector('#productDescription').value;
        const productCategory = productForm.querySelector('#productCategory').value;
        const productImage = productForm.querySelector('#productImage').files[0]; // Get the file

        if (!productImage) {
            alert('Please upload a product image.');
            return;
        }

        try {
            // Upload image to Firebase Storage
            const imageRef = storageRef(storage, `productImages/${productImage.name}`);
            await uploadBytes(imageRef, productImage);
            const imageUrl = await getDownloadURL(imageRef);
            console.log('Image URL:', imageUrl);

            // Save product details to Realtime Database
            const newProductKey = push(ref(db, 'products')).key;
            const updates = {};
            updates['/products/' + newProductKey] = {
                productName,
                productPrice,
                productDescription,
                productCategory,
                productImage: imageUrl
            };
            await update(ref(db), updates);
            alert('Product posted successfully!');
            productForm.reset();
        } catch (error) {
            console.error('Error posting product:', error);
        }
    });

    // Fetch and display products
    const productList = document.getElementById('product-list');
    onValue(ref(db, 'products'), (snapshot) => {
        const products = snapshot.val();
        productList.innerHTML = '';
        if (products) {
            Object.keys(products).forEach((key) => {
                const product = products[key];
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.innerHTML = `
                    <h3>${product.productName}</h3>
                    <p>Price: ${product.productPrice}</p>
                    <p>Description: ${product.productDescription}</p>
                    <p>Category: ${product.productCategory}</p>
                    <img src="${product.productImage}" alt="${product.productName}">
                    <button onclick="addToCart('${key}')">Add to Cart</button>
                `;
                productList.appendChild(productItem);
            });
        } else {
            productList.innerHTML = '<p>No products available.</p>';
        }
    });

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
});
        

