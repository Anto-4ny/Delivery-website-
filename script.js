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
    
