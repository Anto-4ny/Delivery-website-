
        // Firebase configuration and initialization
      
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  const auth = firebase.auth();
  const db = firebase.database();
  const storage = firebase.storage().ref();

        // Authentication and user management
        document.addEventListener("DOMContentLoaded", () => {
            const username = localStorage.getItem("username");
            if (username) {
                displayWelcomeMessage(username);
            }

            const googleProvider = new firebase.auth.GoogleAuthProvider();
            const facebookProvider = new firebase.auth.FacebookAuthProvider();

            document.getElementById("google-login").addEventListener("click", () => {
                auth.signInWithPopup(googleProvider)
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
                auth.signInWithPopup(facebookProvider)
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
                auth.signInWithPopup(googleProvider)
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
                auth.signInWithPopup(facebookProvider)
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

        function displayWelcomeMessage(username) {
            const loginBoxContent = document.querySelector("#login-box-content");
            loginBoxContent.innerHTML = `
                <div class="welcome-message">
                    <h2>Welcome, ${username}!</h2>
                    <p>Your account has been created.</p>
                </div>
            `;
        }

        // Profile page functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Handle product form submission
            const productForm = document.getElementById('product-form');
            productForm.addEventListener('submit', function(event) {
                event.preventDefault();

                const productName = productForm.querySelector('#productName').value;
                const productPrice = productForm.querySelector('#productPrice').value;
                const productDescription = productForm.querySelector('#productDescription').value;
                const productCategory = productForm.querySelector('#productCategory').value;
                const productImage = productForm.querySelector('#productImage').files[0]; // Get the file

                if (!productImage) {
                    alert('Please upload a product image.');
                    return;
                }

                // Upload image to Firebase Storage
                const imageRef = storage.child(`productImages/${productImage.name}`);
                imageRef.put(productImage).then(() => {
                    console.log('Image uploaded successfully.');
                    // Get download URL for the image
                    imageRef.getDownloadURL().then((imageUrl) => {
                        console.log('Image URL:', imageUrl);
                        // Save product details to Realtime Database
                        const newProductKey = db.ref().child('products').push().key;
                        const updates = {};
                        updates['/products/' + newProductKey] = {
                            productName: productName,
                            productPrice: productPrice,
                            productDescription: productDescription,
                            productCategory: productCategory,
                            productImage: imageUrl
                        };
                        db.ref().update(updates).then(() => {
                            alert('Product posted successfully!');
                            productForm.reset();
                        }).catch(error => {
                            console.error('Error posting product:', error);
                        });
                    }).catch(error => {
                        console.error('Error getting image URL:', error);
                    });
                }).catch(error => {
                    console.error('Error uploading image:', error);
                });
            });

            // Fetch and display products
            const productList = document.getElementById('product-list');
            db.ref('products').on('value', (snapshot) => {
                const products = snapshot.val();
                productList.innerHTML = '';
                if (products) {
                    Object.keys(products).forEach((key) => {
                        const product = products[key];
                        const productItem = document.createElement('div');
                        productItem.className = 'product-item';
                        productItem.innerHTML = `
                            <h3>${product.productName}</h3>
                            <p>Price: ${product.productPrice}</p>
                            <p>Description: ${product.productDescription}</p>
                            <p>Category: ${product.productCategory}</p>
                            <img src="${product.productImage}" alt="${product.productName}">
                            <button onclick="addToCart('${key}')">Add to Cart</button>
                        `;
                        productList.appendChild(productItem);
                    });
                } else {
                    productList.innerHTML = '<p>No products available.</p>';
                }
            });

            // Add to cart functionality
            window.addToCart = function(productId) {
                if (!auth.currentUser) {
                    alert('Please log in to add products to the cart.');
                    return;
                }
                const userId = auth.currentUser.uid;
                const cartRef = db.ref('carts/' + userId + '/' + productId);
                cartRef.set(true).then(() => {
                    alert('Product added to cart!');
                }).catch(error => {
                    console.error('Error adding product to cart:', error);
                });
            };

            // Authentication state change listener
            auth.onAuthStateChanged((user) => {
                if (user) {
                    console.log('User is signed in:', user.email);
                } else {
                    console.log('No user signed in.');
                    window.location.href = 'login.html';
                }
            });
        });

        // Profile form functionality
        const profileForm = document.getElementById('profile-form');
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const profileName = profileForm.querySelector('#profileName').value;
            const profileEmail = profileForm.querySelector('#profileEmail').value;
            const profilePhone = profileForm.querySelector('#profilePhone').value;
            const profileCountry = profileForm.querySelector('#profileCountry').value;
            const profileZip = profileForm.querySelector('#profileZip').value;
            const profilePicture = profileForm.querySelector('#profilePicture').files[0]; // Get the file

            if (!profilePicture) {
                alert('Please upload a profile picture.');
                return;
            }

            const userId = auth.currentUser.uid;
            const imageRef = storage.child(`profilePictures/${userId}/${profilePicture.name}`);
            imageRef.put(profilePicture).then(() => {
                console.log('Profile picture uploaded successfully.');
                imageRef.getDownloadURL().then((imageUrl) => {
                    console.log('Profile picture URL:', imageUrl);
                    db.ref('users/' + userId).set({
                        profileName: profileName,
                        profileEmail: profileEmail,
                        profilePhone: profilePhone,
                        profileCountry: profileCountry,
                        profileZip: profileZip,
                        profilePicture: imageUrl
                    }).then(() => {
                        alert('Profile updated successfully!');
                        profileForm.reset();
                    }).catch(error => {
                        console.error('Error updating profile:', error);
                    });
                }).catch(error => {
                    console.error('Error getting profile picture URL:', error);
                });
            }).catch(error => {
                console.error('Error uploading profile picture:', error);
            });
        });
    
  
