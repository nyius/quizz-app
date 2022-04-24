import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyAQ7Cu2r6SjrxGqcEBeHo2EuFiLqhH9km8',
	authDomain: 'quizz-app-1cec7.firebaseapp.com',
	projectId: 'quizz-app-1cec7',
	storageBucket: 'quizz-app-1cec7.appspot.com',
	messagingSenderId: '837466367617',
	appId: '1:837466367617:web:a1c18252b3f17e52050f80',
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth();

googleProvider.setCustomParameters({
	prompt: 'select_account',
});
