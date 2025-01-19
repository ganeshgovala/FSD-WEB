import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDnAj7cJEQU6q3vwqI7HyHDnSVytFRKXqI",
  authDomain: "fsd-web-ada3c.firebaseapp.com",
  projectId: "fsd-web-ada3c",
  storageBucket: "fsd-web-ada3c.firebasestorage.app",
  messagingSenderId: "969356613866",
  appId: "1:969356613866:web:314495ed15ccc39b369f93",
  measurementId: "G-CYG6ZT3TW6",
};

document.getElementById("heading").value = "";
document.getElementById("description").value = "";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let email;

auth.onAuthStateChanged((user) => {
  if (user) {
    email = user.email;
  } else {
    console.log("Cant Get the user");
  }
});

var questions = [];
const checkbox = document.getElementById("importantCheckBox");
const importantMarker = document.getElementById("important");

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    importantMarker.classList.remove("hidden");
  } else {
    importantMarker.classList.add("hidden");
  }
});

document.getElementById("addQuestionButton").addEventListener("click", () => {
  document.getElementById("overlay").classList.remove("hidden");
});

document.getElementById("closeCard").addEventListener("click", () => {
  document.getElementById("question").value = "";
  document.getElementById("option1").value = "";
  document.getElementById("option2").value = "";
  document.getElementById("option3").value = "";
  document.getElementById("option4").value = "";
  document.getElementById("overlay").classList.add("hidden");
});

document.getElementById("cancelForm").addEventListener("click", () => {
  history.back();
});

document.getElementById("submitQuestion").addEventListener("click", () => {
  const type = dropdown.value;
  document.getElementById("overlay").classList.add("hidden");
  const question = document.getElementById("question").value;
  const option1 = document.getElementById("option1").value;
  const option2 = document.getElementById("option2").value;
  const option3 = document.getElementById("option3").value;
  const option4 = document.getElementById("option4").value;
  let isImportant;
  if (document.getElementById("importantCheckBox").checked) {
    isImportant = true;
  } else {
    isImportant = false;
  }
  const options = [option1, option2, option3, option4];
  const data = {
    question: question,
    type : type,
    options: options,
    isImportant: isImportant,
  };
  questions.push(data);
  display();
  document.getElementById("question").value = "";
  document.getElementById("option1").value = "";
  document.getElementById("option2").value = "";
  document.getElementById("option3").value = "";
  document.getElementById("option4").value = "";
  dropdown.value = "text";
  document.getElementById("optionsField").classList.add("hidden");
});

const dropdown = document.getElementById("answerType");
dropdown.addEventListener("change", () => {
  const selectedOption = dropdown.value;
  const optionsField = document.getElementById("optionsField");
  if(selectedOption === "radio" || selectedOption === "checkbox") {
    optionsField.classList.remove("hidden");
  } else {
    optionsField.classList.add("hidden");
  }
  console.log(selectedOption);
}) 

function display() {
  const questionsField = document.getElementById("questionsField");
  questionsField.innerHTML = "";
  questions.forEach((element, index) => {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = `
          <div class="flex justify-between items-center mt-2 pr-4">
              <h1 class="text-2xl font-semibold">${index + 1}. ${element.question}${element.isImportant ? "<span class='text-red-500 text-lg'>  *</span>" : ""}</h1>
              <img src="icons/Trash.png" class="h-5 cursor-pointer" id="questionDelete${index}">
          </div>
          ${element.type == "radio" || element.type == "checkbox" ? `
            <div class="flex items-center py-1 px-2 rounded-xl space-x-4 mt-2">
              <input type=${element.type} name="${element.question}" class="size-4">
              <p class="text-lg">${element.options[0]}</p>
            </div>
            <div class="flex items-center py-1 px-2 rounded-xl space-x-4">
                <input type=${element.type} name="${element.question}" class="size-4">
                <p class="text-lg">${element.options[1]}</p>
            </div>
            <div class="flex items-center py-1 px-2 rounded-xl space-x-4">
                <input type=${element.type} name="${element.question}" class="size-4">
                <p class="text-lg">${element.options[2]}</p>
            </div>
            <div class="flex items-center py-1 px-2 rounded-xl space-x-4 mb-2">
                <input type=${element.type} name="${element.question}" class="size-4">
                <p class="text-lg">${element.options[3]}</p>
            </div>` 
            : `<input type=${element.type} class="mx-8 my-3 border-2 py-1 px-4 rounded-lg">`
          }
          <hr>
      `;
    questionsField.appendChild(newDiv);

    document.getElementById(`questionDelete${index}`).addEventListener("click", () => {
      questions.splice(index, 1);
      display();
    })
  });
}

document.getElementById("createForm").addEventListener("click", async () => {
  const heading = document.getElementById("heading").value;
  const description = document.getElementById("description").value;
  const data = {
    email: email,
    questions: questions,
    title: heading,
    description: description,
  };
  console.log("At Frontend : ", data);
  if (questions.length != 0 && heading != "") {
    history.back();
    await fetch("http://localhost:3000/addData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.text())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    window.alert("Add Atleast one question");
  }
});
