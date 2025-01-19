import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDnAj7cJEQU6q3vwqI7HyHDnSVytFRKXqI",
    authDomain: "fsd-web-ada3c.firebaseapp.com",
    projectId: "fsd-web-ada3c",
    storageBucket: "fsd-web-ada3c.firebasestorage.app",
    messagingSenderId: "969356613866",
    appId: "1:969356613866:web:314495ed15ccc39b369f93",
    measurementId: "G-CYG6ZT3TW6"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app);

document.getElementById("login").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("loginError");
    const loading = document.getElementById("loading");
    if(email === ""  || password === "") {
        errorMessage.innerHTML = "Enter credentials";
        errorMessage.classList.remove("hidden");
        return;
    }
    loading.classList.remove("hidden");
    try {
        errorMessage.classList.add("hidden");
        await signInWithEmailAndPassword(auth, email, password)
        .then((res) => {
            window.location.href = "/dashboard";
            window.history.replaceState(null, null, "/dashboard");
        })
        .catch((err) => {
            if(err.message == "Firebase: Error (auth/invalid-credential).") {
                errorMessage.innerHTML = "Invalid Credentials";
            } else {
                errorMessage.innerHTML = "Error! Try again after some time.";
            }
            errorMessage.classList.remove("hidden");
            console.log(err);
        })
    } catch(err) {
        window.alert(err);
    } finally {
        loading.classList.add("hidden");
    }
})