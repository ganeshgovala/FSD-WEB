import { getAuth } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

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

auth.onAuthStateChanged((user) => {
    if(user) {
        console.log("User Logged in with email :", user.email);
        document.getElementById("user").innerText = user.email;
    } else {
        window.location.href("/");
    }
    getForms();
})

function getEmail() {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged((user) => {
            if(user) {
                console.log("User Logged in with email :", user.email);
                document.getElementById("user").innerText = user.email;
                resolve(user.email);
            } else {
                window.location.href("/");
                resolve(null);
            }
        })
    })
}

document.getElementById("logout").addEventListener("click", () => {
    auth.signOut(auth);
    window.location.href = '/';
    window.history.replaceState(null, null, '/');
})

document.getElementById("formsContainer").addEventListener("click", (event) => {
    const createFormButton = event.target.closest("#createForm");
    if (createFormButton) {
        console.log("Create Form clicked");
        window.location.href = "/form";
    }
});

async function getForms() {
    const email = await getEmail();
    const formsContainer = document.getElementById("formsContainer");
    if(!email) return;
    console.log("Email : ",email);
    try {
        const response = await fetch("http://localhost:3000/getForms", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({email : email}),
        })
        if(response.success) {
            console.log("Successsss");
        }
        const data = await response.json();
        console.log(data);
        const ar = data.response;
        console.log(ar);

        // response = [ { docId, data }, { docId, data } ]
        // data = { title, description, questions }
        // questions = [ {question, options}, {question, options}, {question, options}, {question, options} ]

        if(!Array.isArray(ar) || ar.length == 0) {
            formsContainer.innerHTML = `
                <p class="my-4 text-md text-[#616161] mt-32">No forms to show. Create a new one</p>
                <div class="py-10 h-36 w-2/3 border-[2px] border-dashed border-gray-600 rounded-xl flex items-center justify-center space-x-4 cursor-pointer" id="createForm">
                    <img src="icons/Add_square@3x.png" alt="" class="h-8 mt-1">
                    <h1 class="text-4xl text-[#383838] font-semibold">Create Form</h1>
                </div>
            `
        } else {
            formsContainer.innerHTML = "";
            ar.forEach((element, index) => {
                const newDiv = document.createElement("div");
                newDiv.innerHTML = `
                    <div class="w-[80vw] py-6 text-[#232323] bg-[#fbfcff] text-3xl font-semibold rounded-xl my-4 px-8 shadow-md border-2 border-dashed border-black flex justify-between items-center">
                        <p>${index+1}. ${element.data.title}</p>
                        <div class="flex text-lg items-center space-x-5">
                            <p class="cursor-pointer hover:underline" id="${element.docId+"copyLink"}">Copy Link</p>
                            <p class="cursor-pointer hover:underline" id="delete-${element.docId}">Delete</p>
                            <p class="cursor-pointer hover:underline" id="form${element.docId}">Responses</p>
                        </div>
                    </div>
                `
                formsContainer.appendChild(newDiv);

                document.getElementById(`form${element.docId}`).addEventListener("click", async () => {
                    const email = await getEmail();
                    window.location.href = `/responses?param1=${email}&param2=${element.docId}`;
                })

                document.getElementById(`delete-${element.docId}`).addEventListener('click', async () => {
                    await deleteForm(element.docId);
                    location.reload();
                })

                document.getElementById(`${element.docId+"copyLink"}`).addEventListener('click', async () => {
                    const email = await getEmail();
                    const textToCopy = `http://localhost:3000/example?param1=${email}&param2=${element.docId}`
                    navigator.clipboard.writeText(textToCopy).then(async () => {
                        document.getElementById(`${element.docId+"copyLink"}`).innerHTML = "Copied";
                        setTimeout(() => {
                            document.getElementById(`${element.docId+"copyLink"}`).innerHTML = "Copy Link";
                        }, 5000);
                    })
                    .catch((err) => {
                        window.alert("Failed to copy");
                    })
                })
            });
            const temp = document.createElement("div");
            temp.innerHTML = `
                <div class="w-[80vw] py-6 text-[#232323] bg-[#fbfcff] cursor-pointer text-3xl font-semibold rounded-xl my-4 px-8 shadow-md border-2 border-dashed border-black flex justify-center space-x-3 items-center" id="createForm">
                    <img src="icons/Add_square@3x.png" alt="" class="h-6 mt-1">
                    <h1 class="text-2xl text-[#383838] font-semibold">Create new</h1>
                </div>
            `
            formsContainer.appendChild(temp);
        }
    }
    catch(err) {
        console.log(err);
    }
}

async function deleteForm(formId) {
    const email = await getEmail();
    try {
        const data1 = {
            email : email,
            docId : formId
        }
        const response = await fetch("http://localhost:3000/deleteForm", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data1)
        })
        const data = await response.json();
        if(data.success) {
            console.log("Form Deleted Successfully");
        } else {
            window.alert("Cant delete the form");
        }
    } catch(err) {
        window.alert(err);
    }
}

async function getDetails() {
    const email = await getEmail();
    try {
        const response = await fetch("https://forming-0w01.onrender.com/getDetails", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({email : email})
        })
        const data = response.json();
        data.then((res) => {
            document.getElementById("welcomeNote").innerHTML = `
                <h1 class="text-5xl pt-4 pb-8 font-semibold text-[#232323]">Welcome ${res.name} !</h1>
            `
        })
    } catch(err) {
        console.log(err);
    }
}

getDetails();