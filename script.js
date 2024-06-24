// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
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
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getDatabase();
const storage = getStorage();

// Handle registration
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Save user data to the database
            set(ref(db, 'users/' + user.uid), {
                username: username,
                email: email,
                profilePicture: user.photoURL || 'default_profile_picture_url'  // Replace with default picture URL
            });

            // Display the profile icon
            displayProfileIcon(user);
        })
        .catch((error) => {
            console.error('Error signing up:', error);
        });
});

// Social sign-up handlers
document.getElementById('google-signup').addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            set(ref(db, 'users/' + user.uid), {
                username: user.displayName,
                email: user.email,
                profilePicture: user.photoURL
            });
            displayProfileIcon(user);
        })
        .catch((error) => {
            console.error('Google sign-up error:', error);
        });
});

document.getElementById('facebook-signup').addEventListener('click', () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            set(ref(db, 'users/' + user.uid), {
                username: user.displayName,
                email: user.email,
                profilePicture: user.photoURL
            });
            displayProfileIcon(user);
        })
        .catch((error) => {
            console.error('Facebook sign-up error:', error);
        });
});

function displayProfileIcon(user) {
    const accountLinks = document.querySelector('.account-links');
    accountLinks.innerHTML = `
        <img src="${user.photoURL || 'default_profile_picture_url'}" alt="${user.displayName}" class="profile-icon">
        <span>${user.displayName}</span>
    `;
}

function displayWelcomeMessage(username) {
    const loginBoxContent = document.querySelector("#login-box-content");
    loginBoxContent.innerHTML = `
        <div class="welcome-message">
            <h2>Welcome, ${username}!</h2>
            <p>Your account has been created.</p>
        </div>
    `;
}

// Profile page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle product form submission
    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', function(event) {
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

        // Upload image to Firebase Storage
        const imageRef = storageRef(storage, `productImages/${productImage.name}`);
        uploadBytes(imageRef, productImage).then(() => {
            console.log('Image uploaded successfully.');
            // Get download URL for the image
            getDownloadURL(imageRef).then((imageUrl) => {
                console.log('Image URL:', imageUrl);
                // Save product details to Realtime Database
                const newProductKey = push(ref(db, 'products')).key;
                const updates = {};
                updates['/products/' + newProductKey] = {
                    productName: productName,
                    productPrice: productPrice,
                    productDescription: productDescription,
                    productCategory: productCategory,
                    productImage: imageUrl
                };
                update(ref(db), updates).then(() => {
                    alert('Product posted successfully!');
                    productForm.reset();
                }).catch(error => {
                    console.error('Error posting product:', error);
                });
            }).catch(error => {
                console.error('Error getting image URL:', error);
            });
        }).catch(error => {
            console.error('Error uploading image:', error);
        });
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
    window.addToCart = function(productId) {
        if (!auth.currentUser) {
            alert('Please log in to add products to the cart.');
            return;
        }
        const userId = auth.currentUser.uid;
        const cartRef = ref(db, 'carts/' + userId + '/' + productId);
        set(cartRef, true).then(() => {
            alert('Product added to cart successfully!');
        }).catch(error => {
            console.error('Error adding product to cart:', error);
        });
    }
});
                                          
