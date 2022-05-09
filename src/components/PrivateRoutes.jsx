import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';

function PrivateRoutes({ children }) {
	// get our loggedIn and checkingStatus vars from useAuthStatus
	const { loggedIn, checkingStatus } = useAuthStatus();

	// If we're checking the current user, show spinner
	if (checkingStatus) {
		return <Spinner />;
	}

	// if the user is logged in, we can safely show the passed in child pages.
	// If not, return them to sign in
	return loggedIn ? children : <Navigate to="/sign-in" />;
}

export default PrivateRoutes;
