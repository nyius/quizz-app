import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../firebase.config';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { serverTimestamp, setDoc, doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

function Login() {
	// state to store our formData
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const { email, password } = formData;
	const navigate = useNavigate();

	//---------------------------------------------------------------------------------------------------//
	/**
	 * Expects an event to be passed in.
	 * Sets the state based on what input field the user typed in.
	 * @param {*} e
	 */
	const onChange = e => {
		setFormData(prevState => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	// Email Login form submit---------------------------------------------------------------------------------------------------//
	/**
	 * Handles form submission. Checks that input fields are valid
	 * Expects an event (e)
	 * @param {*} e
	 */
	const onSubmit = async e => {
		e.preventDefault();

		// run very simple checks on email and password
		if (!email) {
			toast.error('You must enter an email');
		} else if (!password) {
			toast.error('You must enter an password');
		}
		try {
			// log in with email/password
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;

			// if user exists, send them to the dashboard.
			if (user) {
				toast.success('Logged in!');
				navigate('/');
			} else {
				toast.error('Could not find an account with that email/password.');
			}
		} catch (error) {
			toast.error('Could not find an account with that email/password.');
			console.log(error);
		}
	};

	//  ---------------------------------------------------------------------------------------------------//
	/**
	 * Handles logging in with google account.
	 */
	const googleLogin = async () => {
		try {
			// Login with google account
			const userCredential = await signInWithPopup(auth, googleProvider);

			// Get user information.
			const uid = userCredential.user.uid;
			const name = userCredential.user.displayName;
			const email = userCredential.user.email;
			const timestamp = serverTimestamp();

			// Check our users DB for this google user
			const userRef = doc(db, 'users', uid);
			const userSnap = await getDoc(userRef);

			// Check if we already have the user in our DB. If we do, take them in
			if (userSnap.exists()) {
				navigate('/');
			} else {
				// if the user doesn't exist in our users db, set their info into our database
				const user = {
					name,
					email,
					timestamp,
					password: '',
				};

				// Add the user to our 'users' database colelction
				await setDoc(doc(db, 'users', uid), user);

				toast.success('Logged in!');

				navigate('/');
			}
		} catch (error) {
			toast.error('Something went wrong. Please try again');
			console.log(error);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col justify-center items-center w-fit h-fit p-16 shadow-xl bg-base-300 rounded-lg">
			<p className="text-2xl my-5">Sign in</p>
			<form onSubmit={onSubmit}>
				<input
					type="email"
					id="email"
					defaultValue={email}
					onChange={onChange}
					placeholder="email"
					className="input w-full my-5 input-lg"
				/>
				<input
					type="password"
					id="password"
					defaultValue={password}
					onChange={onChange}
					placeholder="password"
					className="input w-full my-5 input-lg"
				/>
				<button className="btn btn-secondary btn-xl w-full my-5">Sign in</button>
			</form>
			<button className="btn btn-primary btn-xl w-full my-5" onClick={googleLogin}>
				Sign in with google
			</button>
			<p>
				Don't have an account?{' '}
				<Link to="/create-account" className="link link-accent">
					Create one here
				</Link>
			</p>
		</div>
	);
}

export default Login;
