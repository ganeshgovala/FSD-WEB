const urlParams = new URLSearchParams(window.location.search);
const param1 = urlParams.get("param1");
const param2 = urlParams.get("param2");
const table = document.createElement('table');
table.classList.add("text-lg", "border-collapse", "table-fixed");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const db = getFirestore(app);

async function getDetails(param1, param2) {
    const questionField = document.getElementById("responsesField");
    try {
        const docRef = doc(db, "Users", param1, "Forms", param2);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const res = docSnap.data();
            questionField.innerHTML = "";
            const newDiv = document.createElement("div");
            newDiv.innerHTML = `
                <h1 class="text-6xl font-semibold mt-1 text-[#232323]">${res.title}</h1>
                <p class="pt-5 pb-4 text-[#626262] mt-1 text-lg w-[60vw]">${res.description}</p>
            `;
            questionField.appendChild(newDiv);
            const th = document.createElement("tr");
            th.classList.add("font-medium");
            const temptd = document.createElement("td");
            temptd.innerHTML = S.No;
            temptd.classList.add("py-2", "px-7", "border-2","w-content", "border-dashed", "border-[#232323]", "text-center");
            th.appendChild(temptd);
            res.questions.forEach((element) => {
                const td = document.createElement("td");
                td.classList.add("py-2", "px-7", "border-2","w-content", "border-dashed", "border-[#232323]", "text-center");
                td.innerHTML = element.question;
                th.appendChild(td);
            });
            table.appendChild(th);
        }
    } catch (err) {
        console.log(err);
    }
}
getDetails(param1, param2);

async function getReponses(param1, param2) {
    const tableSection = document.getElementById("tableSection");
    try {
        const responsesSnapshot = await getDocs(collection(db, "Users", param1, "Forms", param2, "Responses"));
        const responses = [];
        responsesSnapshot.forEach((docSnap) => {
            responses.push(docSnap.data());
        });
        document.getElementById("totalResponses").innerHTML = `Total Responses : <span class="font-semibold"> ${responses.length}`;
        responses.forEach((element, index) => {
            const tr = document.createElement("tr");
            const temptd = document.createElement("td");
            temptd.innerHTML = index+1;
            temptd.classList.add("py-2", "px-7", "border-2","w-content", "border-dashed", "border-[#232323]", "text-center");
            tr.appendChild(temptd);
            for(let i in element.response) {
                const td = document.createElement("td");
                td.classList.add("py-2", "px-7", "border-2", "border-dashed", "border-[#232323]", "text-center");
                td.innerHTML = element.response[i];
                tr.appendChild(td);
            }
            table.appendChild(tr);
        });
        tableSection.appendChild(table);
    } catch (err) {
        console.log(err);
    }
}

getReponses(param1, param2);
