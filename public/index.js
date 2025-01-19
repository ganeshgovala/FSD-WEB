import { getAuth } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDnAj7cJEQU6q3vwqI7HyHDnSVytFRKXqI",
    authDomain: "fsd-web-ada3c.firebaseapp.com",
    projectId: "fsd-web-ada3c",
    storageBucket: "fsd-web-ada3c.firebasestorage.app",
    messagingSenderId: "969356613866",
    appId: "1:969356613866:web:314495ed15ccc39b369f93",
    measurementId: "G-CYG6ZT3TW6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("login").addEventListener("click", () => {
    window.location.href = "/login";
})

document.getElementById("signup").addEventListener("click", () => {
    window.location.href = "/signup";
})

document.getElementById("dashboard").addEventListener("click", () => {
    auth.onAuthStateChanged((user) => {
        if(user) {
            window.location.href = '/dashboard';
        } else {
            window.location.href = '/login';
        }
    })
    window.location.href = "/dashboard";
})

document.getElementById("createForm").addEventListener("click", () => {
    auth.onAuthStateChanged((user) => {
        if(user) {
            window.location.href = '/dashboard';
        } else {
            window.location.href = '/login';
        }
    })
    window.location.href = "/dashboard";
})