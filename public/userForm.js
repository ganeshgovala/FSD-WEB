const urlParams = new URLSearchParams(window.location.search);
const param1 = urlParams.get("param1");
const param2 = urlParams.get("param2");

const formField = document.getElementById("formField");

let noOfQuestions;
let types = {};
let responses = {};

async function getForm() {
  try {
    const data1 = {
      email: param1,
      docId: param2,
    };
    const response = await fetch("http://localhost:3000/getParticularForm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data1),
    });
    const promise = response.json();
    promise
      .then((res) => {
        noOfQuestions = res.questions.length;
        formField.innerHTML = "";
        const header = document.createElement("div");
        header.innerHTML = `
                <div class="h-16 bg-[#232323] rounded-t-xl mb-6"></div>
                <h1 class="text-4xl font-semibold px-10">${res.title}</h1>
                <p class="my-4 text-[#3f3f3f] px-10">${res.description}</p>
                <hr />`;
        formField.appendChild(header);
        res.questions.forEach((element, index) => {
          types[index] = {type : element.type, isImp : element.isImportant};
          const questions = document.createElement("div");
          questions.innerHTML = `<div class="mt-4 flex space-x-3 px-10">
                <h1 class="text-xl font-semibold" id="question">${index+1}. ${element.question}</h1>
                <p class="text-xl text-red-500" id="isImportant">${element.isImportant ? "*" : ""}</p>
            </div>
            <div class="px-14 mt-3 space-y-2">
                ${element.type == "radio" || element.type == "checkbox" 
                  ? ` <div class="space-x-2">
                        <input type=${element.type} name="question${index}" id="option${index}1" value="1" class="size-4" />
                        <label for="option${index}1" class="text-lg">${element.options[0]}</label>
                      </div>
                      <div class="space-x-2">
                        <input type=${element.type} name="question${index}" id="option${index}2" value="2" class="size-4" />
                        <label for="option${index}2" class="text-lg">${element.options[1]}</label>
                      </div>
                      <div class="space-x-2">
                        <input type=${element.type} name="question${index}" id="option${index}3" value="3" class="size-4" />
                        <label for="option${index}3" class="text-lg">${element.options[2]}</label>
                      </div>
                      <div class="space-x-2">
                        <input type=${element.type} name="question${index}" id="option${index}4" value="4" class="size-4" />
                        <label for="option${index}4" class="text-lg">${element.options[3]}</label>
                      </div>`
                  : `<input type=${element.type} class="mx-1 my-3 border-2 py-1 px-4 rounded-lg" id="question${index}">`
                }
            </div>
            <hr class="mt-4">`;
          formField.appendChild(questions);
        })
        const buttons = document.createElement("div");
        buttons.innerHTML = `
            <div class="mt-6 px-8 space-x-3">
                <button class="py-2 px-8 bg-[#232323] text-white font-semibold rounded-xl" id="submit">Submit</button>  
            </div>
        `;
        formField.appendChild(buttons);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
}
getForm();

async function addResponse() {
  document.getElementById("submitting").classList.remove("hidden");
  for(let i = 0; i < noOfQuestions; i++) {
    if(types[i].type == "radio") {
      const selectedRadio = document.querySelector(`input[name='question${i}']:checked`);
      if(selectedRadio) {
        responses[i] = selectedRadio.nextElementSibling.textContent;
      } else if(types[i].isImp && selectedRadio == false) {
        window.alert("Few important questions are left empty. Please fill those");
        document.getElementById("submitting").classList.add("hidden");
        return;
      } else {
        responses[i] = null;
      }
    } else if(types[i].type == "checkbox") {
      const selectedCheckboxes = document.querySelectorAll(`input[name='question${i}']:checked`);
      const temp = [];
      if(selectedCheckboxes.length != 0) {
        selectedCheckboxes.forEach((element) => {
          temp.push(element.nextElementSibling.textContent);
        })
      } else if(types[i].isImp && selectedCheckboxes.length == 0) {
        window.alert("Few important questions are left empty. Please fill those");
        document.getElementById("submitting").classList.add("hidden");
        return;
      }
      responses[i] = temp;
    } else {
      if(types[i].isImp && document.getElementById("question"+i).value == "") {
        window.alert("Few important questions are left empty. Please fill those");
        document.getElementById("submitting").classList.add("hidden");
        return;
      }
      responses[i] = document.getElementById("question"+i).value;
    }
  }

  const data1 = {
    email : param1,
    docId : param2,
    responses : responses
  }

  console.log(data1);

  await fetch("http://localhost:3000/addResponse", {
    method : "POST",
    headers : {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(data1)
  })
  .then((res) => res.text())
  .catch((err) => console.log(err))

  window.location.href = "/successfullPage";
  window.history.replaceState(null, null, "/successfullPage");
}

document.getElementById("formField").addEventListener("click", () => {
  const submitButton = event.target.closest("#submit");
  if(submitButton) {
    addResponse();
  }
})