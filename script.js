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

document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
    if (username) {
        displayWelcomeMessage(username);
    }
});

function loginUser() {
    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;

    // For simplicity, this example does not validate the password.
    // In a real application, you would send the username and password to a server for validation.

    if (usernameInput && passwordInput) {
        localStorage.setItem("username", usernameInput);
        displayWelcomeMessage(usernameInput);
    } else {
        alert("Please enter both username and password.");
    }
    return false; // Prevent form submission
}

function displayWelcomeMessage(username) {
    const loginBoxContent = document.querySelector(".login-box-content");
    loginBoxContent.innerHTML = `
        <div class="welcome-message">
            <h2>Welcome, ${username}!</h2>
            <p>You are now logged in.</p>
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
