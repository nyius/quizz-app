import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase.config';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, serverTimestamp, doc } from 'firebase/firestore';

function CreateAccount() {
	// Gather form data when user is entering information
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		name: '',
	});

	// split the vars to be used when submitting
	const { name, email, password } = formData;
	const navigate = useNavigate();

	// ---------------------------------------------------------------------------------------------------//
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

	//Submit new account ---------------------------------------------------------------------------------------------------//
	/**
	 * Expects an event to be passed in.
	 * Handles the submission of the user account creation.
	 * @param {*} e
	 * @returns
	 */
	const onSubmit = async e => {
		e.preventDefault();

		// run checks
		if (!name) {
			toast.error('Must enter a name!');
			return;
		} else if (!email) {
			toast.error('Must enter a valid email!');
			return;
		} else if (!password) {
			toast.error(`You need a password!`);
			return;
		} else {
			try {
				// Create the account on firebase
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				const user = userCredential.user;

				// Update the user displayName
				updateProfile(auth.currentUser, {
					displayName: name,
				});

				// Add the user to our 'users' database colelction
				const formDataCopy = { ...formData };
				delete formData.password;
				formDataCopy.timestamp = serverTimestamp();

				await setDoc(doc(db, 'users', user.uid), formDataCopy);

				toast.success('Account Created! You can now sign in');

				navigate('/');
			} catch (error) {
				toast.error('Something went wrong. Please try again');
				console.log(error);
			}
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col justify-center items-center w-fit h-fit p-16 shadow-xl bg-base-300 rounded-lg">
			<p className="text-2xl my-5">Create Account</p>
			<form onSubmit={onSubmit}>
				<input
					type="text"
					id="name"
					defaultValue={name}
					onChange={onChange}
					placeholder="name"
					className="input w-full my-5 input-lg"
				/>
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
				<button className="btn btn-secondary btn-xl w-full my-5">Create Account</button>
				<p>
					Already have an account?{' '}
					<Link to="/" className="link link-accent">
						Sign in
					</Link>
					<button className="btn btn-primary btn-xl w-full my-5">Sign in with google</button>
				</p>
			</form>
		</div>
	);
}

export default CreateAccount;
