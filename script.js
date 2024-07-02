<script type="module"></script>
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

// Initialize cart count
let cartCount = 0;

// Update the cart count displayed on the cart icon
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = cartCount;
}

// Add product to cart
function addToCart(productId) {
    const user = auth.currentUser;
    if (user) {
        const cartRef = ref(db, 'carts/' + user.uid);
        set(ref(cartRef, productId), {
            productId: productId
        }).then(() => {
            // Increment cart count and update the display
            cartCount++;
            updateCartCount();

            // Optionally: Show a message or animation that item was added to cart
        });
    } else {
        alert('You need to be signed in to add items to your cart.');
    }
}

// Redirect to cart page
function redirectToCart() {
    window.location.href = 'cart.html';
}

// Load cart count on page load
window.onload = function() {
    const user = auth.currentUser;
    if (user) {
        const cartRef = ref(db, 'carts/' + user.uid);
        onValue(cartRef, (snapshot) => {
            cartCount = snapshot.size();
            updateCartCount();
        });
    }
};

// Function to calculate total and display cart items
function loadCart() {
    const user = auth.currentUser;
    if (user) {
        const cartRef = ref(db, 'carts/' + user.uid);
        onValue(cartRef, (snapshot) => {
            const cartList = document.getElementById('cart-list');
            cartList.innerHTML = '';
            let total = 0;

            snapshot.forEach((childSnapshot) => {
                const productId = childSnapshot.val().productId;
                const productRef = ref(db, 'products/' + productId);
                onValue(productRef, (productSnapshot) => {
                    const product = productSnapshot.val();
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product');
                    productDiv.innerHTML = `
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Price: $${product.price}</p>
                        <p>Category: ${product.category}</p>
                        <img src="${product.mediaURL}" alt="${product.name}">
                    `;
                    cartList.appendChild(productDiv);

                    total += parseFloat(product.price);
                    document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
                });
            });
        });
    }
}

// Call loadCart function when on cart.html
if (window.location.pathname.endsWith('cart.html')) {
    window.onload = function() {
        const user = auth.currentUser;
        if (user) {
            loadCart();
        }
    };
}

// Handle checkout button click
function checkout() {
    // Calculate total and proceed to payment
    const user = auth.currentUser;
    if (user) {
        calculateTotal();
        // Proceed to the payment process
        // You can redirect to a payment page or open a payment modal here
    } else {
        alert('You need to be signed in to checkout.');
    }
}
    
