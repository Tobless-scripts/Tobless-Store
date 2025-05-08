import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
} from "firebase/auth";
import {
    initializeFirestore,
    persistentLocalCache,
    doc,
    setDoc,
    updateDoc,
    getDoc,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCyTsCYRaeZ9yu-rk-Mhj31n5PRK9Qyt1E",
    authDomain: "tobless-mart.firebaseapp.com",
    projectId: "tobless-mart",
    storageBucket: "tobless-mart.appspot.com",
    messagingSenderId: "1042579460452",
    appId: "1:1042579460452:web:ee4a5bf65bbbc9f9096a71",
    measurementId: "G-2LNX6RZ473",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = initializeFirestore(app, {
    localCache: persistentLocalCache(),
});
const googleProvider = new GoogleAuthProvider();

export {
    auth,
    db,
    googleProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
    doc,
    setDoc,
    updateDoc,
    getDoc,
    signInWithEmailAndPassword,
};
