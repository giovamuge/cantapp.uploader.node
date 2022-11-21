// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require("firebase/app");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const { query } = require("express");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

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
// Initialize the default app
// admin.initializeApp(firebaseConfig);
// const defaultAuth = admin.auth();
// const db = admin.firestore();

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// console.log(db);

db.collection("new_songs")
    .orderBy("title")
    .startAt("Su")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(data);
        });
    });
