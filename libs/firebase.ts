// this file is to configure the firebase inorder to stock our images

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9pbaaDCOCFvffuc6xaDp1C3XlITfuFhc",
  authDomain: "e-commerce-ace4d.firebaseapp.com",
  databaseURL: "https://e-commerce-ace4d-default-rtdb.firebaseio.com",
  projectId: "e-commerce-ace4d",
  storageBucket: "e-commerce-ace4d.appspot.com",
  messagingSenderId: "926676822205",
  appId: "1:926676822205:web:16ad2429e849e208b0efd4"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp