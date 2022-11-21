// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const { auth } = require("firebase/app");
const firebase = require("firebase/app");
const fs = require("fs");
const path = require("path");
const backup = require("./backup.json");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/auth");

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvY92afgZ7gtRvlZSaodFrgG0ORZRozFw",
  authDomain: "mgc-cantapp.firebaseapp.com",
  databaseURL: "https://mgc-cantapp.firebaseio.com",
  projectId: "mgc-cantapp",
  storageBucket: "mgc-cantapp.appspot.com",
  messagingSenderId: "44505885939",
  appId: "1:44505885939:web:86ad78b7062564f47ddb86",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let count = 0;

db.collection("songs")
  .orderBy("title")
  .get()
  .then(function (querySnapshot) {
    const batch = db.batch();
    querySnapshot.forEach(function (doc) {
      count++;
      // doc.data() is never undefined for query doc snapshots
      // db.doc(`songs/${doc.id}`).update({ number: `${count}` });
      const data = doc.data();
      // console.log(`number: ${data.number} | index: ${data.title}`);
      batch.update(doc.ref, { number: `${count}` });
      console.log(`batch number ${count} id ${data.id} title ${data.title}`);
    });

    // Commit the batch
    batch.commit().then(() => console.log("batch committed"));
  });
