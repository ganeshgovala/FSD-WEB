const express = require("express");
const path = require("path");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const cors = require("cors");
require('dotenv').config();

const serviceAccount = require("./serviceAccount.json");
const app = express();
app.use(cors());

initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newlines in private key
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
});
const db = getFirestore();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname+"/public/"+"index.html"));
});

app.get("/example", (req, res) => {
    res.sendFile(path.join(__dirname+"/public/"+"userForm.html"));
})

app.post("/getParticularForm", async (req, res) => {
    const data = req.body;
    try {
        const docRef = db.collection("Users").doc(data.email).collection("Forms").doc(data.docId);
        const docSnapshot = await docRef.get();
        if(!docSnapshot.exists) {
            res.status(500).send("Can't load the form");
        }
        const response = docSnapshot.data();
        res.status(200).json(response);
    } catch(err) {
        res.status(500).send("Can't Load the form")
        console.log(err);
    }
})

app.get("/form", (req, res) => {
    res.sendFile(path.join(__dirname+"/public/"+"form.html"));
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname+"/public/"+"login.html"));
})

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname+"/public/"+"register.html"));
})

app.get("/successfullPage", (req, res) => {
    res.sendFile(path.join(__dirname+"/public/"+"successfullPage.html"));
})

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname+"/public/"+"dashboard.html"));
})

app.post("/addData", async (req, res) => {
    const data = req.body;
    try {
        const docRef = await db.collection("Users").doc(data.email).collection("Forms").add({
            questions : data.questions,
            title : data.title,
            description : data.description
        });
    } catch (error) {
        console.error("Error adding document: ", error);
    }
});

app.post("/addUser", async (req, res) => {
    const data = req.body;
    try {
        const docRef = await db.collection("Users").doc(data.email).collection("Details").add(data);
        res.status(200).send("User added successfully");
    }
    catch(err) {
        console.log(err);
        res.status(500).send("Error adding user");
    }
})

app.post("/getForms", async (req, res) => {
    const data = req.body;
    var response = [];
    try {
        const formsSnapshot = await db.collection("Users").doc(data.email).collection("Forms").get();
        formsSnapshot.forEach((doc) => {
            response.push({docId : doc.id, data : doc.data()});
        })
        res.status(200).json({success : true, response});
    } catch(err) {
        res.json({success : false, err});
    }
})

app.get("/responses", (req, res) => {
    res.sendFile(__dirname+"/public/"+"responses.html");
})

app.post('/getFormDetails', async (req, res) => {
    const data = req.body;
    try {
        const response = await db.collection("Users").doc(data.email).collection("Forms").doc(data.docId).get();
        res.status(200).send(response.data());
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
})

app.post("/getReponses", async (req, res) => {
    const data = req.body;
    var response = [];
    try {
        const responsesSnapshot = await db.collection("Users").doc(data.email).collection("Forms").doc(data.docId).collection("Responses").get();
        responsesSnapshot.forEach((doc) => {
            response.push(doc.data());
        })
        res.status(200).json({success : true, response});
    } catch(err) {
        console.log(err);
        res.json({success : false, err});
    }
})

app.post('/deleteForm', async(req, res) => {
    const data = req.body;
    try {
        const docRef = db.collection("Users").doc(data.email).collection("Forms").doc(data.docId);
        await docRef.delete();
        res.status(200).json({success : true});
    } catch(err) {
        res.status(500).json({success : false});
    }
})

app.post("/addResponse", async (req, res) => {
    const data = req.body;
    try {
        const docRef = await db.collection("Users").doc(data.email).collection("Forms").doc(data.docId).collection("Responses").add({
            response : data.responses,
        })
        res.json({status : "success"});
    } catch(err) {
        res.json(err);
        console.log(err);
    }
})

app.post("/getDetails", async (req, res) => {
    const data = req.body;
    let response;
    const docs = await db.collection("Users").doc(data.email).collection("Details").get()
    docs.forEach((element) => {
        response = element.data();
    })
    res.json(response);
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});