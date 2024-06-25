
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
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
window.registerUser = function () {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            set(ref(db, 'users/' + user.uid), {
                username: username,
                email: email,
            });
            displayProfileIcon(user);
            return false;
        })
        .catch((error) => {
            console.error('Error signing up:', error);
            return false;
        });

    return false; // Prevent default form submission
};

// Handle login
window.loginUser = function () {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            displayProfileIcon(user);
            return false;
        })
        .catch((error) => {
            console.error('Error logging in:', error);
            return false;
        });

    return false; // Prevent default form submission
};

// Handle profile form submission
document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    const name = document.getElementById('profileName').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    const country = document.getElementById('profileCountry').value;
    const zip = document.getElementById('profileZip').value;
    const file = document.getElementById('profilePicture').files[0];

    if (file) {
        const storageRefPath = storageRef(storage, 'profile_pictures/' + user.uid);
        uploadBytes(storageRefPath, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                saveProfileData(user.uid, name, email, phone, country, zip, downloadURL);
            });
        });
    } else {
        saveProfileData(user.uid, name, email, phone, country, zip, user.photoURL);
    }
});

function saveProfileData(uid, name, email, phone, country, zip, photoURL) {
    set(ref(db, 'users/' + uid), {
        username: name,
        email: email,
        phone: phone,
        country: country,
        zip: zip,
        photoURL: photoURL
    }).then(() => {
        alert('Profile updated successfully!');
        displayProfileIcon(auth.currentUser);
    }).catch((error) => {
        console.error('Error updating profile:', error);
    });
}

// Handle product posting
document.getElementById('post-product-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    const productName = document.getElementById('product-name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    const file = document.getElementById('media').files[0];

    if (file) {
        const storageRefPath = storageRef(storage, 'products/' + user.uid + '/' + file.name);
        uploadBytes(storageRefPath, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                saveProductData(user.uid, productName, description, price, category, downloadURL);
            });
        });
    } else {
        alert('Please upload a media file.');
    }
});

function saveProductData(uid, name, description, price, category, mediaURL) {
    const newProductRef = ref(db, 'products').push();
    set(newProductRef, {
        userId: uid,
        name: name,
        description: description,
        price: price,
        category: category,
        mediaURL: mediaURL
    }).then(() => {
        alert('Product posted successfully!');
        document.getElementById('post-product-form').reset();
        fetchProducts(); // Refresh product list
    }).catch((error) => {
        console.error('Error posting product:', error);
    });
}

// Fetch and display products
function fetchProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear current products

    onValue(ref(db, 'products'), (snapshot) => {
        const products = snapshot.val();
        for (let productId in products) {
            const product = products[productId];
            const productElement = createProductElement(product);
            productList.appendChild(productElement);
        }
    });
}

function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.classList.add('product');

    const mediaElement = document.createElement('img');
    mediaElement.src = product.mediaURL;
    mediaElement.alt = product.name;
    productElement.appendChild(mediaElement);

    const nameElement = document.createElement('h3');
    nameElement.textContent = product.name;
    productElement.appendChild(nameElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = product.description;
    productElement.appendChild(descriptionElement);

    const priceElement = document.createElement('p');
    priceElement.textContent = '$' + product.price;
    productElement.appendChild(priceElement);

    const categoryElement = document.createElement('p');
    categoryElement.textContent = 'Category: ' + product.category;
    productElement.appendChild(categoryElement);

    return productElement;
}

// Initial call to fetch products
fetchProducts();

// Display profile icon
function displayProfileIcon(user) {
    const profileIconPlaceholder = document.getElementById('profile-icon-placeholder');
    if (user && user.photoURL) {
        profileIconPlaceholder.innerHTML = `<img src="${user.photoURL}" alt="Profile Picture" />`;
    } else {
        profileIconPlaceholder.innerHTML = '';
    }
}

// Switch between login and signup forms
document.getElementById('switch-to-login').addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
});

document.getElementById('switch-to-signup').addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
});

// Handle Google and Facebook authentication
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

document.getElementById('google-signup').addEventListener('click', () => {
    signInWithPopup(auth, googleProvider).then((result) => {
        const user = result.user;
        set(ref(db, 'users/' + user.uid), {
            username: user.displayName,
            email: user.email,
        });
        displayProfileIcon(user);
    }).catch((error) => {
        console.error('Error signing up with Google:', error);
    });
});

document.getElementById('google-login').addEventListener('click', () => {
    signInWithPopup(auth, googleProvider).then((result) => {
        const user = result.user;
        displayProfileIcon(user);
    }).catch((error) => {
        console.error('Error logging in with Google:', error);
    });
});

document.getElementById('facebook-signup').addEventListener('click', () => {
    signInWithPopup(auth, facebookProvider).then((result) => {
        const user = result.user;
        set(ref(db, 'users/' + user.uid), {
            username: user.displayName,
            email: user.email,
        });
        displayProfileIcon(user);
    }).catch((error) => {
        console.error('Error signing up with Facebook:', error);
    });
});

document.getElementById('facebook-login').addEventListener('click', () => {
    signInWithPopup(auth, facebookProvider).then((result) => {
        const user = result.user;
        displayProfileIcon(user);
    }).catch((error) => {
        console.error('Error logging in with Facebook:', error);
    });
});

// Handle user state change
onAuthStateChanged(auth, (user) => {
    if (user) {
        displayProfileIcon(user);
        document.querySelector('.containerforlogin').style.display = 'none';
        document.querySelector('main').style.display = 'block';
    } else {
        document.querySelector('.containerforlogin').style.display = 'block';
        document.querySelector('main').style.display = 'none';
    }
});
            
            

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
        }
    };
});
        

