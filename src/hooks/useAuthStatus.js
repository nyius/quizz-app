import { useEffect, useState, useRef } from 'react';
import { auth } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';

//---------------------------------------------------------------------------------------------------//
/**
 * Handles the current logged in user and listens for log in/out events
 * @returns
 */
export const useAuthStatus = () => {
	// Logged in state
	const [loggedIn, setLoggedIn] = useState(false);
	// Checking logged in status state
	const [checkingStatus, setCheckingStatus] = useState(true);

	// this useRef is to handle memory leak errors.
	const isMounted = useRef(true);

	// UseEffect to check when a user logs in/out
	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, user => {
				if (user) {
					setLoggedIn(true);
				}

				setCheckingStatus(false);
			});
		}

		return () => {
			isMounted.current = false;
		};
	}, [isMounted]);

	// returns the current loggedIn status, and if we're currently checking the logged in status
	return { loggedIn, checkingStatus };
};
