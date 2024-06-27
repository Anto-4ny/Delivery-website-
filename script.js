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
const database = firebase.database();
const auth = firebase.auth();

//paypal and stripe payments 
document.addEventListener('DOMContentLoaded', function () {
    const checkoutForm = document.getElementById('checkout-form');
    const stripeButton = document.getElementById('stripe-button');
    const paypalButton = document.getElementById('paypal-button');
    const errorMessage = document.getElementById('error-message');
    
    const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');

    // Monitor auth state
    auth.onAuthStateChanged(user => {
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
            database.ref('users/' + userId).set(userData, (error) => {
                if (error) {
                    reject(new Error('Failed to save user data.'));
                } else {
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
                }
            });
        });
    }
});
      
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
            .catch((error) => {
                console.error('Error uploading product media:', error);
                alert('Error uploading product media: ' + error.message);
            });
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
    .catch((error) => {
        console.error('Error posting product:', error);
        alert('Error posting product: ' + error.message);
    });
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
        alert('Error adding product to cart: ' + error.message);
    }
};

// Function to handle checkout
window.checkout = function() {
    // Implement checkout process, including displaying shipping options and prices
    // Redirect or display checkout page with selected products
};

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && (e.key === 'I' || e.key === 'J' || e.key === 'U'))) {
        e.preventDefault();
    }
});
    
