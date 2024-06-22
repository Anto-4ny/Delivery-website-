//categories 
function navigateToCategory(category) {
    // Adjust the URL as necessary to match your site's structure
    window.location.href = `category-${category}.html`;
}



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

document.querySelectorAll(".box").forEach((box) => {
    box.addEventListener("click", () => {
        let websiteType =
            box.classList.contains("basic")
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
function sendInquiry(subject, message) {
            window.location.href = "mailto:antocaptechnologies@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(message);
        }
// script.js
// script.js
//login and sign up pages

document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
    if (username) {
        displayWelcomeMessage(username);
    }

    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
    firebase.initializeApp(firebaseConfig);

    // Set up Google and Facebook login
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


// Function to create a new post
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

// Function to like a post
function likePost(element) {
    const likesDiv = element;
    if (likesDiv.textContent === "Like") {
        likesDiv.textContent = "Unlike";
    } else {
        likesDiv.textContent = "Like";
    }
}

// Function to add a comment to a post
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

// Function to send a chat message
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

// Frontend JavaScript code (script.js)

// Example function to fetch data from the backend
function fetchDataFromBackend() {
    // Make an AJAX request to your backend server
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            // Do something with the data received from the backend
            console.log('Data from backend:', data);
        })
        .catch(error => {
            // Handle errors
            console.error('Error fetching data:', error);
        });
}
//Reviews section
document.addEventListener('DOMContentLoaded', () => {
  fetchReviews();
});

function fetchReviews() {
  // This function should fetch reviews from your server.
  // Here we'll use a placeholder array of reviews for demonstration.
  const reviews = [
    { name: 'John Doe', profilePic: 'path/to/profile-pic1.jpg', text: 'Great service!' },
    { name: 'Jane Smith', profilePic: 'path/to/profile-pic2.jpg', text: 'Fast and reliable!' },
    // Add more reviews as needed
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
<script>
document.getElementById('review-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const profilePic = document.getElementById('profilePic').value;
  const reviewText = document.getElementById('reviewText').value;

  const response = await fetch('http://localhost:3000/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, profilePic, text: reviewText })
  });

  if (response.ok) {
    fetchReviews();  // Refresh reviews
  } else {
    console.error('Error adding review');
  }
});
</script>
//contact us form
function sendEmail() {
    const subject = document.getElementById('gmail-subject').value;
    const message = document.getElementById('gmail-message').value;
    const mailtoLink = `mailto: antocaptechnologies@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
}

function sendWhatsApp() {
    const subject = document.getElementById('whatsapp-subject').value;
    const message = document.getElementById('whatsapp-message').value;
    const whatsappLink = `https://wa.me/+254757492614?text=${encodeURIComponent(`Subject: ${subject}\n\n${message}`)}`;
    window.location.href = whatsappLink;
}


// script.js

document.addEventListener('DOMContentLoaded', async function() {
    // Fetch all posts from backend when page loads
    await fetchPosts();
});

// Function to fetch all posts from backend
async function fetchPosts() {
    try {
        const response = await fetch('http://localhost:3000/api/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const posts = await response.json();

        // Display posts in the UI
        displayPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Function to display posts in the UI
function displayPosts(posts) {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = ''; // Clear previous content

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        // HTML structure for each post (customize as needed)
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            ${post.imagePath ? `<img src="${post.imagePath}" alt="Post Image">` : ''}
        `;

        postsContainer.appendChild(postElement);
    });
}

// Event listener for form submission
document.getElementById('postForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('content', document.getElementById('content').value);
    formData.append('image', document.getElementById('image').files[0]);

    try {
        // Send POST request to backend API endpoint
        const response = await fetch('http://localhost:3000/api/posts', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error posting content');
        }

        // Refresh posts after successful submission
        await fetchPosts();

        // Reset form after successful submission
        document.getElementById('postForm').reset();
        alert('Post submitted successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit post. Please try again later.');
    }
});


// Example: Writing data to Firebase Realtime Database
var database = firebase.database();
var ref = database.ref('path/to/your/data');
ref.set({
  key1: 'value1',
  key2: 'value2'
});

// Example: Reading data from Firebase Realtime Database
var ref = database.ref('path/to/your/data');
ref.once('value')
  .then(function(snapshot) {
    var data = snapshot.val();
    console.log(data);
  });

// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    // Function to navigate to a specific category
    function navigateToCategory(category) {
        window.location.href = `category-${category}.html`;
    }

    // scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const products = [
        {
            id: 'product1',
            name: 'Original 20W iPhone 14 Pro Max USB-C to Lightning Charger + 2m Cable',
            price: '$42.56',
            description: 'This is a high-quality charger for iPhone 14 Pro Max with USB-C to Lightning connection.',
            image: 'src/Images/product.jpg',
            similarProducts: [
                { name: 'Product 2', price: '$200.00', image: 'src/Images/product2.jpg' },
                { name: 'Product 3', price: '$300.00', image: 'src/Images/product3.jpg' }
            ]
        },
        {
            id: 'product2',
            name: 'Product 2',
            price: '$200.00',
            description: 'Description for product 2',
            image: 'src/Images/product2.jpg',
            similarProducts: [
                { name: 'Product 1', price: '$42.56', image: 'src/Images/product.jpg' },
                { name: 'Product 3', price: '$300.00', image: 'src/Images/product3.jpg' }
            ]
        },
        {
            id: 'product3',
            name: 'Product 3',
            price: '$300.00',
            description: 'Description for product 3',
            image: 'src/Images/product3.jpg',
            similarProducts: [
                { name: 'Product 1', price: '$42.56', image: 'src/Images/product.jpg' },
                { name: 'Product 2', price: '$200.00', image: 'src/Images/product2.jpg' }
            ]
        }
        // Add more products as needed
    ];

    const productItems = document.querySelectorAll('.product-item');
    const productDetails = document.getElementById('product-details');
    const suggestions = document.getElementById('suggestions');
    const searchInput = document.getElementById('search');

    productItems.forEach(item => {
        item.addEventListener('click', () => {
            const productId = item.dataset.productId;
            const product = products.find(p => p.id === productId);
            showProductDetails(product);
        });
    });

    searchInput.addEventListener('input', showSuggestions);

    function showProductDetails(product) {
        productDetails.innerHTML = `
            <h2>${product.name}</h2>
            <img src="${product.image}" alt="${product.name}">
            <p>${product.description}</p>
            <div class="similar-products">
                <h3>Similar Products</h3>
                <div class="product-list">
                    ${product.similarProducts.map(sp => `
                        <div class="product-item">
                            <img src="${sp.image}" alt="${sp.name}">
                            <h3>${sp.name}</h3>
                            <p>${sp.price}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        productDetails.style.display = 'block';
        window.scrollTo(0, productDetails.offsetTop);
    }

    function showSuggestions() {
        const input = searchInput.value.toLowerCase();
        const matchedProducts = products.filter(product => product.name.toLowerCase().includes(input));
        suggestions.innerHTML = matchedProducts.map(product => `<li onclick="selectProduct('${product.id}')">${product.name}</li>`).join('');
    }

    window.selectProduct = function(productId) {
        const product = products.find(p => p.id === productId);
        searchInput.value = product.name;
        suggestions.innerHTML = '';
        showProductDetails(product);
    };
});
    
