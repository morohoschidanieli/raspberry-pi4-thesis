const firebase = require('firebase');

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD3qooGTPdXGN6NBDSpNZteiwGOpgkJZzY",
    authDomain: "licenta-3e164.firebaseapp.com",
    databaseURL: "https://licenta-3e164-default-rtdb.firebaseio.com",
    projectId: "licenta-3e164",
    storageBucket: "licenta-3e164.appspot.com",
    messagingSenderId: "987851035034",
    appId: "1:987851035034:web:825ea9c221d2d8933c2a23",
    measurementId: "G-9SKBFKBX69"
};

firebase.initializeApp(firebaseConfig); //initialize firebase app
module.exports = { firebase }; //export the app
