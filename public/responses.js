const urlParams = new URLSearchParams(window.location.search);
const param1 = urlParams.get("param1");
const param2 = urlParams.get("param2");
const table = document.createElement('table');
table.classList.add("text-lg", "border-collapse", "table-fixed");

async function getDetails(param1, param2) {
    const questionField = document.getElementById("responsesField");
    const data1 = {
        email : param1,
        docId : param2
    }
    try {
        const response = await fetch("https://fsd-web.onrender.com/getFormDetails", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data1)
        })
        const data = response.json();
        data.then((res) => {
            console.log(res);
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
            temptd.innerHTML = `S.No`;
            temptd.classList.add("py-2", "px-7", "border-2","w-content", "border-dashed", "border-[#232323]", "text-center");
            th.appendChild(temptd);
            res.questions.forEach((element) => {
                const td = document.createElement("td");
                td.classList.add("py-2", "px-7", "border-2","w-content", "border-dashed", "border-[#232323]", "text-center");
                td.innerHTML = element.question;
                th.appendChild(td);
            })
            table.appendChild(th);
        })
        .catch((err) => {
            console.log(err);
        })
    } catch(err) {
        console.log(err);
    }
}
getDetails(param1, param2);

async function getReponses(param1, param2) {
    const data1 = {
        email : param1,
        docId : param2
    }
    const tableSection = document.getElementById("tableSection");
    console.log(data1);
    try {
        const response = await fetch("https://fsd-web.onrender.com/getReponses", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data1)
        })
        const data = response.json();
        data.then(async (res) => {
            document.getElementById("totalResponses").innerHTML = `Total Responses : <span class="font-semibold"> ${res.response.length}`;
            await res.response.forEach((element, index) => {
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
            })
        })
        tableSection.appendChild(table);
    } catch(err) {
        console.log(err);
    }
}

getReponses(param1, param2);