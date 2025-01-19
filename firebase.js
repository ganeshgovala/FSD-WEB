const admin = require('firebase-admin');
require('dotenv').config(); // Load environment variables

// Create a service account object from environment variables
const serviceAccount = require("./serviceAccount.json");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;