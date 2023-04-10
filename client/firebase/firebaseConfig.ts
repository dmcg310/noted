import "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyAlOF9sSkfBvWIb8SXhiPhAsdtzF2tqc9Q",
	authDomain: "noted-d16a2.firebaseapp.com",
	projectId: "noted-d16a2",
	storageBucket: "noted-d16a2.appspot.com",
	messagingSenderId: "66061362918",
	appId: "1:66061362918:web:d507a354ee912a95263d27",
	measurementId: "G-R8M7QRTFGJ",
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
