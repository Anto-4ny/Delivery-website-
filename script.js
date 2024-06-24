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
const storage = firebase.storage().ref();

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

// Profile page functionality
document.addEventListener('DOMContentLoaded', function() {
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
    });

    // Add product to cart
    window.addToCart = function(productId) {
        const user = firebase.auth().currentUser;
        if (user) {
            const userId = user.uid;
            database.ref('carts/' + userId + '/' + productId).set(true)
                .then(() => {
                    alert('Product added to cart!');
                }).catch(error => {
                    console.error('Error adding to cart:', error);
                });
        } else {
            alert('Please log in to add items to your cart.');
        }
    };
});
                          
