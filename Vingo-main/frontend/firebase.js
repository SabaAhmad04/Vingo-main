// // // Import the functions you need from the SDKs you need
// // import { initializeApp } from "firebase/app";
// // import { getAuth } from "firebase/auth";
// // // TODO: Add SDKs for Firebase products that you want to use
// // // https://firebase.google.com/docs/web/setup#available-libraries

// // // Your web app's Firebase configuration
// // const firebaseConfig = {
// //   apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
// //   authDomain: "vingo-food-delivery.firebaseapp.com",
// //   projectId: "vingo-food-delivery",
// //   storageBucket: "vingo-food-delivery.firebasestorage.app",
// //   messagingSenderId: "693314883513",
// //   appId: "1:693314883513:web:4840c943ecf3fb61a33068"
// // };

// // // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // const auth=getAuth(app)
// // export {app,auth}

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBRIHeZp7Yt0CGuwD0N6CLFjMF_gJ5LHXk",
//   authDomain: "onlinedelivery-791c2.firebaseapp.com",
//   projectId: "onlinedelivery-791c2",
//   storageBucket: "onlinedelivery-791c2.firebasestorage.app",
//   messagingSenderId: "633591536505",
//   appId: "1:633591536505:web:cfa5f7c6ae4cfc7800ada8"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ ADD THIS

const firebaseConfig = {
  apiKey: "AIzaSyBRIHeZp7Yt0CGuwD0N6CLFjMF_gJ5LHXk",
  authDomain: "onlinedelivery-791c2.firebaseapp.com",
  projectId: "onlinedelivery-791c2",
  storageBucket: "onlinedelivery-791c2.firebasestorage.app",
  messagingSenderId: "633591536505",
  appId: "1:633591536505:web:cfa5f7c6ae4cfc7800ada8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ CREATE AUTH
const auth = getAuth(app);

// ✅ EXPORT BOTH
export { app, auth };