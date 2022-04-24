import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { auth } from '../firebase.config';
import { RiGhostSmileLine } from 'react-icons/ri';

function Navbar() {
	const navigate = useNavigate();

	//Sign out ---------------------------------------------------------------------------------------------------//
	const startSignOut = () => {
		auth.signOut();
		toast.success('Signed out');
		navigate('/sign-in');
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="navbar bg-secondary mb-5 text-primary-content shadow-lg">
			{/* ------------------------------ Hamburger Menu ------------------------------ */}
			<div className="navbar-start h-20 ">
				<div className="dropdown">
					<label tabIndex="0" className="btn btn-ghost btn-circle">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-10 w-10"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h16M4 18h7"
							/>
						</svg>
					</label>
					<ul
						tabIndex="0"
						className="menu menu-normal dropdown-content mt-3 p-2 shadow bg-base-300 rounded-box w-52"
					>
						<li>
							<button onClick={() => navigate('/')}>Quizzes</button>
						</li>
						<li>
							<button onClick={() => navigate('/create-quiz')}>Create Quiz</button>
						</li>
						<li>
							<button onClick={() => navigate('/my-profile')}>Profile</button>
						</li>
					</ul>
				</div>
			</div>

			{/* ------------------------------ Quizzle Logo ------------------------------ */}
			<div className="navbar-center">
				<button
					className="btn btn-ghost normal-case text-4xl font-black tracking-widest shadow-xl"
					onClick={() => navigate('/')}
				>
					QUIZZLE
				</button>
			</div>

			{/* ------------------------------ Profile Menu ------------------------------ */}
			<div className="navbar-end">
				<div className="dropdown dropdown-end">
					<label tabIndex="0" className="btn btn-ghost btn-circle avatar">
						<RiGhostSmileLine className="h-10 w-10" />
					</label>
					<ul
						tabIndex="0"
						className="menu menu-normal dropdown-content mt-3 p-2 shadow bg-base-300 rounded-box w-52"
					>
						<li>
							<button onClick={() => navigate('/my-profile')}>Profile</button>
						</li>
						<li>
							<button onClick={startSignOut}>Logout</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
