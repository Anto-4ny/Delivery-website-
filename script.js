import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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
const db = getDatabase(app);
const storage = getStorage(app);

// PayPal and Stripe payments
document.addEventListener('DOMContentLoaded', function () {
    const checkoutForm = document.getElementById('checkout-form');
    const stripeButton = document.getElementById('stripe-button');
    const paypalButton = document.getElementById('paypal-button');
    const errorMessage = document.getElementById('error-message');
    
    const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');

    // Monitor auth state
    onAuthStateChanged(auth, user => {
        if (user) {
            stripeButton.addEventListener('click', function () {
                if (validateForm()) {
                    const userData = {
                        name: checkoutForm.name.value,
                        email: checkoutForm.email.value,
                        paymentMethod: 'stripe'
                    };

                    saveUserData(user.uid, userData)
                        .then((sessionId) => {
                            return stripe.redirectToCheckout({ sessionId: sessionId });
                        })
                        .catch(error => showError(error.message));
                }
            });

            paypal.Buttons({
                createOrder: function (data, actions) {
                    if (validateForm()) {
                        const userData = {
                            name: checkoutForm.name.value,
                            email: checkoutForm.email.value,
                            paymentMethod: 'paypal'
                        };

                        return saveUserData(user.uid, userData)
                            .then((orderId) => orderId)
                            .catch(error => showError(error.message));
                    }
                },
                onApprove: function (data, actions) {
                    return actions.order.capture().then(function (details) {
                        alert('Transaction completed by ' + details.payer.name.given_name);
                    });
                },
                onError: function (err) {
                    showError('An error occurred with PayPal. Please try again.');
                }
            }).render('#paypal-button');
        } else {
            showError('User is not authenticated.');
        }
    });

    function validateForm() {
        if (!checkoutForm.name.value.trim() || !checkoutForm.email.value.trim()) {
            showError('Please fill in all required fields.');
            return false;
        }
        return true;
    }

    function showError(message) {
        errorMessage.textContent = message;
    }

    function saveUserData(userId, userData) {
        return new Promise((resolve, reject) => {
            set(ref(db, 'users/' + userId), userData)
                .then(() => {
                    // Assuming your backend endpoint returns a session/order ID
                    fetch('/create-payment-session', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: userId,
                            paymentMethod: userData.paymentMethod
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            reject(new Error(data.error));
                        } else {
                            resolve(data.sessionId || data.orderId);
                        }
                    })
                    .catch(error => reject(new Error('An error occurred. Please try again.')));
                })
                .catch(error => reject(new Error('Failed to save user data.')));
        });
    }
});

// Get form and product list elements
const postProductForm = document.getElementById('post-product-form');
const productList = document.getElementById('product-list');

// Listen for form submission
postProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (user) {
        // Get form values
        const productName = document.getElementById('product-name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const category = document.getElementById('category').value;
        const mediaFile = document.getElementById('media').files[0];

        // Create a reference to store media file
        const mediaRef = storageRef(storage, 'media/' + mediaFile.name);

        // Upload media file
        uploadBytes(mediaRef, mediaFile).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                // Save product data to Firebase Realtime Database
                const productRef = ref(db, 'products').push();
                set(productRef, {
                    name: productName,
                    description: description,
                    price: price,
                    category: category,
                    mediaURL: downloadURL,
                    userId: user.uid
                });

                // Clear form
                postProductForm.reset();
            });
        });
    } else {
        alert('You need to be signed in to post a product.');
    }
});

// Load products from Firebase Realtime Database
onValue(ref(db, 'products'), (snapshot) => {
    productList.innerHTML = '';
    snapshot.forEach((childSnapshot) => {
        const product = childSnapshot.val();
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Category: ${product.category}</p>
            <img src="${product.mediaURL}" alt="${product.name}">
            <button onclick="addToCart('${childSnapshot.key}')">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
});

function addToCart(productId) {
    const user = auth.currentUser;
    if (user) {
        const cartRef = ref(db, 'carts/' + user.uid);
        set(ref(cartRef, productId), {
            productId: productId
        }).then(() => {
            // Redirect to shopping cart with product ID
            window.location.href = 'shopping_cart.html';
        });
    } else {
        alert('You need to be signed in to add items to your cart.');
    }
}

// Example authentication handling
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User signed in:', user);
    } else {
        console.log('No user signed in.');
    }
});

// Sign in function (add your own sign-in method here)
function signIn() {
    signInWithEmailAndPassword(auth, 'email@example.com', 'password')
        .catch((error) => {
            console.error('Sign-in error:', error);
        });
}

// Sign out function
function signOut() {
    auth.signOut()
        .then(() => {
            console.log('User signed out.');
        })
        .catch((error) => {
            console.error('Sign-out error:', error);
        });
}

// Disable right-click and certain keyboard shortcuts
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && (e.key === 'I' || e.key === 'J' || e.key === 'U'))) {
        e.preventDefault();
    }
});


const products = {
    electronics: [
        { id: 1, name: "iPhone Charger", image: "src/Images/product.jpg", price: 42.56, description: "Original 20W iPhone 14 Pro Max USB-C to Lightning Charger + 2m Cable" },
        // Add more electronics products here
    ],
    apparel: [
        { id: 2, name: "Garments", image: "src/Images/apparelproduct.jpg", price: 17.00, description: "High quality garments" },
        // Add more apparel products here
    ],
    // Add more categories and products as needed
};

function navigateToCategory(category) {
    const productSection = document.getElementById('products-section');
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products[category].forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="viewProduct(${product.id}, '${category}')">View Details</button>
        `;
        productList.appendChild(productItem);
    });
    productSection.scrollIntoView();
}

function viewProduct(productId, category) {
    const product = products[category].find(p => p.id === productId);
    const productDetail = document.getElementById('product-detail');
    productDetail.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>$${product.price}</p>
        <p>${product.description}</p>
        <button onclick="addToCart(${product.id}, '${category}')">Add to Cart</button>
    `;
    productDetail.scrollIntoView();
}

const cart = [];

function addToCart(productId, category) {
    const product = products[category].find(p => p.id === productId);
    cart.push(product);
    alert(`${product.name} added to cart`);
    displayCart();
}

function displayCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';
    cart.forEach(product => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
        `;
        cartList.appendChild(cartItem);
    });
}

function checkout() {
    // Implement checkout functionality here
    alert('Proceeding to checkout');
}
