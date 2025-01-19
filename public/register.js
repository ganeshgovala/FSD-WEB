import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

document.getElementById("signup").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("loginError");
  const loading = document.getElementById("loading");
  if (email === "" || password === "") {
    errorMessage.innerHTML = "Enter credentials";
    errorMessage.classList.remove("hidden");
    return;
  }
  try {
    loading.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        await addUser(name, email);
        window.location.href = "/dashboard";
        window.history.replaceState(null, null, "/dashboard");
      })
      .catch((err) => {
        if (err.message == "Firebase: Error (auth/email-already-in-use).") {
          errorMessage.innerHTML = "Email already in Use";
        } else {
          errorMessage.innerHTML = "Error! Try again after some time.";
        }
        errorMessage.classList.remove("hidden");
      });
  } catch (err) {
    window.alert(err);
  } finally {
    loading.classList.add("hidden");
  }
});

async function addUser(name, email) {
  console.log("User Added");
  const data = {
    name : name,
    email : email
  }
  await fetch("https://fsd-web.onrender.com/addUser", {
    method : "POST",
    headers : {
      "Content-Type" : "application/json",
    },
    body : JSON.stringify(data),
  })
  .then((res) => res.text())
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  })
}