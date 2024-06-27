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
const storage = firebase.storage();

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
      const mediaRef = storage.ref('media/' + mediaFile.name);

      // Upload media file
      mediaRef.put(mediaFile).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          // Save product data to Firebase Realtime Database
          const productRef = database.ref('products').push();
          productRef.set({
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
  database.ref('products').on('value', (snapshot) => {
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
      const cartRef = database.ref('carts/' + user.uid);
      cartRef.push({
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
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('User signed in:', user);
    } else {
      console.log('No user signed in.');
    }
  });

  // Sign in function (add your own sign-in method here)
  function signIn() {
    auth.signInWithEmailAndPassword('email@example.com', 'password').catch((error) => {
      console.error('Sign-in error:', error);
    });
  }

  // Sign out function
  function signOut() {
    auth.signOut().then(() => {
      console.log('User signed out.');
    }).catch((error) => {
      console.error('Sign-out error:', error);
    });
  }
</script>
              

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && (e.key === 'I' || e.key === 'J' || e.key === 'U'))) {
        e.preventDefault();
    }
});
    
