// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// Function to navigate to a specific category
function navigateToCategory(category) {
    window.location.href = `category-${category}.html`;
}

// Menu icon toggle
document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menu-icon");
    const navLinks = document.getElementById("nav-links");
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;

    menuIcon.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    setInterval(nextSlide, 6000); // Change slide every 6 seconds
    showSlide(currentSlide); // Initialize the first slide
});

// Product box click handling for email order
document.querySelectorAll(".box").forEach((box) => {
    box.addEventListener("click", () => {
        let websiteType = box.classList.contains("basic")
            ? "Basic Website"
            : box.classList.contains("advanced")
            ? "Advanced Website"
            : "Premium Website";
        let message = "I want to order the " + websiteType;
        window.location.href =
            "mailto:antocaptechnologies@gmail.com?subject=Website Order&body=" +
            encodeURIComponent(message);
    });
});

// Send inquiry via email
function sendInquiry(subject, message) {
    window.location.href = "mailto:antocaptechnologies@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(message);
}

// Authentication and user management
document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
    if (username) {
        displayWelcomeMessage(username);
    }

    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const facebookProvider = new firebase.auth.FacebookAuthProvider();

    document.getElementById("google-login").addEventListener("click", () => {
        firebase.auth().signInWithPopup(googleProvider)
            .then((result) => {
                const user = result.user;
                localStorage.setItem("username", user.displayName);
                displayWelcomeMessage(user.displayName);
            })
            .catch((error) => {
                console.error("Google login error:", error);
            });
    });

    document.getElementById("facebook-login").addEventListener("click", () => {
        firebase.auth().signInWithPopup(facebookProvider)
            .then((result) => {
                const user = result.user;
                localStorage.setItem("username", user.displayName);
                displayWelcomeMessage(user.displayName);
            })
            .catch((error) => {
                console.error("Facebook login error:", error);
            });
    });

    document.getElementById("google-signup").addEventListener("click", () => {
        firebase.auth().signInWithPopup(googleProvider)
            .then((result) => {
                const user = result.user;
                localStorage.setItem("username", user.displayName);
                displayWelcomeMessage(user.displayName);
            })
            .catch((error) => {
                console.error("Google sign-up error:", error);
            });
    });

    document.getElementById("facebook-signup").addEventListener("click", () => {
        firebase.auth().signInWithPopup(facebookProvider)
            .then((result) => {
                const user = result.user;
                localStorage.setItem("username", user.displayName);
                displayWelcomeMessage(user.displayName);
            })
            .catch((error) => {
                console.error("Facebook sign-up error:", error);
            });
    });
});

function loginUser() {
    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;

    if (usernameInput && passwordInput) {
        firebase.auth().signInWithEmailAndPassword(usernameInput, passwordInput)
            .then((userCredential) => {
                localStorage.setItem("username", usernameInput);
                displayWelcomeMessage(usernameInput);
            })
            .catch((error) => {
                alert("Invalid login credentials.");
                console.error("Login error:", error);
            });
    } else {
        alert("Please enter both username and password.");
    }
    return false; // Prevent form submission
}

function registerUser() {
    const usernameInput = document.getElementById("signup-username").value;
    const emailInput = document.getElementById("signup-email").value;
    const passwordInput = document.getElementById("signup-password").value;

    if (usernameInput && emailInput && passwordInput) {
        firebase.auth().createUserWithEmailAndPassword(emailInput, passwordInput)
            .then((userCredential) => {
                localStorage.setItem("username", usernameInput);
                displayWelcomeMessage(usernameInput);
            })
            .catch((error) => {
                alert("Error creating account.");
                console.error("Sign-up error:", error);
            });
    } else {
        alert("Please fill out all fields.");
    }
    return false; // Prevent form submission
}

function displayWelcomeMessage(username) {
    const loginBoxContent = document.querySelector(".login-box-content");
    loginBoxContent.innerHTML = `
        <div class="welcome-message">
            <h2>Welcome, ${username}!</h2>
            <p>Your account has been created.</p>
        </div>
    `;
}

// Post creation and interaction
function createPost() {
    const postContent = document.getElementById('new-post').value;
    if (postContent.trim() !== "") {
        const postContainer = document.createElement('div');
        postContainer.className = 'post';
        postContainer.innerHTML = `
            <p>${postContent}</p>
            <div class="likes" onclick="likePost(this)">Like</div>
            <div class="comments"></div>
            <input type="text" class="comment-input" placeholder="Write a comment...">
            <button onclick="addComment(this)">Comment</button>
        `;
        document.getElementById('posts-container').prepend(postContainer);
        document.getElementById('new-post').value = "";
    }
}

function likePost(element) {
    const likesDiv = element;
    likesDiv.textContent = likesDiv.textContent === "Like" ? "Unlike" : "Like";
}

function addComment(element) {
    const commentInput = element.previousElementSibling;
    const commentText = commentInput.value;
    if (commentText.trim() !== "") {
        const commentContainer = document.createElement('div');
        commentContainer.className = 'comment';
        commentContainer.textContent = commentText;
        element.parentElement.querySelector('.comments').appendChild(commentContainer);
        commentInput.value = "";
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatMessage = chatInput.value;
    if (chatMessage.trim() !== "") {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'chat-message';
        messageContainer.textContent = chatMessage;
        document.getElementById('chat-container').appendChild(messageContainer);
        chatInput.value = "";
    }
}

// Fetch data from backend
function fetchDataFromBackend() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            console.log('Data from backend:', data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Reviews section
document.addEventListener('DOMContentLoaded', () => {
    fetchReviews();
});

function fetchReviews() {
    const reviews = [
        { name: 'John Doe', profilePic: 'path/to/profile-pic1.jpg', text: 'Great service!' },
        { name: 'Jane Smith', profilePic: 'path/to/profile-pic2.jpg', text: 'Fast and reliable!' },
    ];

    const container = document.querySelector('.reviews-container');
    reviews.forEach(review => {
        const reviewBox = document.createElement('div');
        reviewBox.classList.add('review-box');
        reviewBox.innerHTML = `
            <img src="${review.profilePic}" alt="${review.name}'s profile picture">
            <div class="name">${review.name}</div>
            <div class="review-text">${review.text}</div>
        `;
        container.appendChild(reviewBox);
    });
}

document.getElementById('review-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const profilePic = document.getElementById('profilePic').value;
    const reviewText = document.getElementById('reviewText').value;

    const response = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, profilePic, reviewText })
    });

    if (response.ok) {
        alert('Review submitted successfully!');
        document.getElementById('review-form').reset();
    } else {
        alert('Failed to submit review.');
    }
});

// Function to fetch and display products
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

function fetchProducts() {
    // Simulate fetching products from an API
    const products = [
        { id: 1, name: 'Basic Website', price: '$100', description: 'A simple website.' },
        { id: 2, name: 'Advanced Website', price: '$200', description: 'A more complex website with additional features.' },
        { id: 3, name: 'Premium Website', price: '$300', description: 'A top-tier website with all the bells and whistles.' }
    ];

    const productsContainer = document.querySelector('.products-container');
    products.forEach(product => {
        const productBox = document.createElement('div');
        productBox.className = 'product';
        productBox.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Description: ${product.description}</p>
            <button onclick="orderProduct('${product.name}')">Order Now</button>
        `;
        productsContainer.appendChild(productBox);
    });
}

function orderProduct(productName) {
    const message = `I want to order the ${productName}`;
    window.location.href = `mailto:antocaptechnologies@gmail.com?subject=Product Order&body=${encodeURIComponent(message)}`;
}

//profile page
        document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    const firebaseConfig = {
        // Your Firebase config here
    };
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const storage = firebase.storage().ref();

    // Handle product form submission
    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const productName = productForm.querySelector('#productName').value;
        const productPrice = productForm.querySelector('#productPrice').value;
        const productDescription = productForm.querySelector('#productDescription').value;
        const productCategory = productForm.querySelector('#productCategory').value;
        const productImage = productForm.querySelector('#productImage').files[0]; // Get the file

        // Upload image to Firebase Storage
        const imageRef = storage.child(`productImages/${productImage.name}`);
        imageRef.put(productImage).then(() => {
            console.log('Image uploaded successfully.');
            // Get download URL for the image
            imageRef.getDownloadURL().then((imageUrl) => {
                // Save product details to Realtime Database
                const newProductKey = database.ref().child('products').push().key;
                const updates = {};
                updates['/products/' + newProductKey] = {
                    productName: productName,
                    productPrice: productPrice,
                    productDescription: productDescription,
                    productCategory: productCategory,
                    productImage: imageUrl
                };
                database.ref().update(updates).then(() => {
                    alert('Product posted successfully!');
                    // Clear form fields after submission
                    productForm.reset();
                }).catch(error => {
                    console.error('Error posting product:', error);
                });
            });
        });
    });

    // Handle profile form submission
    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const profileName = profileForm.querySelector('#profileName').value;
        const profileEmail = profileForm.querySelector('#profileEmail').value;
        const profilePhone = profileForm.querySelector('#profilePhone').value;
        const profileCountry = profileForm.querySelector('#profileCountry').value;
        const profileZip = profileForm.querySelector('#profileZip').value;
        const profilePicture = profileForm.querySelector('#profilePicture').files[0]; // Get the file

        // Upload profile picture to Firebase Storage
        const profileImageRef = storage.child(`profilePictures/${profilePicture.name}`);
        profileImageRef.put(profilePicture).then(() => {
            console.log('Profile picture uploaded successfully.');
            // Get download URL for the profile picture
            profileImageRef.getDownloadURL().then((profileImageUrl) => {
                // Save profile details to Realtime Database
                database.ref('profiles/' + profileEmail).set({
                    profileName: profileName,
                    profileEmail: profileEmail,
                    profilePhone: profilePhone,
                    profileCountry: profileCountry,
                    profileZip: profileZip,
                    profilePicture: profileImageUrl
                }).then(() => {
                    alert('Profile updated successfully!');
                    // Clear form fields after submission
                    profileForm.reset();
                }).catch(error => {
                    console.error('Error updating profile:', error);
                });
            });
        });
    });

    // Display products from Realtime Database
    const productList = document.getElementById('product-list');
    database.ref('products').once('value').then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const productData = childSnapshot.val();
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <h3>${productData.productName}</h3>
                <p><strong>Price:</strong> ${productData.productPrice}</p>
                <p><strong>Description:</strong> ${productData.productDescription}</p>
                <p><strong>Category:</strong> ${productData.productCategory}</p>
                <img src="${productData.productImage}" alt="Product Image" style="max-width: 100%; margin-bottom: 10px;">
                <button onclick="addToCart('${childSnapshot.key}')">Add to Cart</button>
            `;
            productList.appendChild(productCard);
        });
    }).catch((error) => {
        console.error('Error getting products:', error);
    });

    // Function to add product to shopping cart (simulated)
    window.addToCart = function(productId) {
        const productRef = database.ref('products/' + productId);
        productRef.once('value').then((snapshot) => {
            const productData = snapshot.val();
            const shoppingCartForm = document.getElementById('shopping-cart-form');
            const cartItem = document.createElement('div');
            cartItem.classList.add('shopping-cart-item');
            cartItem.innerHTML = `
                <p><strong>Product Name:</strong> ${productData.productName}</p>
                <p><strong>Price:</strong> ${productData.productPrice}</p>
                <button onclick="checkout('${productId}')">Remove</button>
            `;
            shoppingCartForm.appendChild(cartItem);
        }).catch((error) => {
            console.error('Error adding to cart:', error);
        });
    };

    // Function to simulate checkout process
    window.checkout = function(productId) {
        // Simulate checkout process, remove product from cart (if needed)
        const cartItem = document.querySelector(`.shopping-cart-item[data-product-id="${productId}"]`);
        if (cartItem) {
            cartItem.remove();
        }
        alert('Checkout process simulated. Product removed from cart.');
    };

    // Smooth scrolling for navigation links
    document.querySelectorAll('.alibaba-navigation a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });
});
        
