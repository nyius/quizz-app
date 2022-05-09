import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { auth, db } from '../firebase.config';
import { doc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { FiUser } from 'react-icons/fi';
import { MdTagFaces } from 'react-icons/md';
import { toast } from 'react-toastify';

function MyProfile() {
	// Loading state
	const [loading, setLoading] = useState(true);
	// State to hold all of our personal quizzes
	const [quizzes, setQuizzes] = useState(null);

	const navigate = useNavigate();

	// useEffect to fetch all of this users quizzes ---------------------------------------------------------------------------------------------------//
	useEffect(() => {
		const fetchQuizzes = async () => {
			const quizzesRef = collection(db, 'quizzes');
			// Set up our query to only get quizzes that match our loggeg in userRef
			const q = query(quizzesRef, where('userRef', '==', auth.currentUser.uid));

			const querySnap = await getDocs(q);

			let quizzes = [];

			// Loop over all of our quizzes and add them to our array, that will be stored in state
			querySnap.forEach(quiz => {
				return quizzes.push({
					id: quiz.id,
					data: quiz.data(),
				});
			});
			setQuizzes(quizzes);
			setLoading(false);
		};
		fetchQuizzes();
	}, []);

	//---------------------------------------------------------------------------------------------------//
	/**
	 * Handles the deleting of a specific quiz that belongs to this logged in user.
	 * Expects an ID of the quiz to be deleted.
	 * @param {*} quizId
	 */
	const deleteQuiz = async quizId => {
		await deleteDoc(doc(db, 'quizzes', quizId));
		const updatedQuizzes = quizzes.filter(quiz => quiz.id !== quizId);
		setQuizzes(updatedQuizzes);
		toast.success('Quiz deleted!');
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="w-full shadow-xl p-4 lg:p-8 rounded-xl justify-center bg-base-300 items-center flex flex-col">
			<header className="w-fit flex flex-col justify-center items-center mb-2 lg:my-8">
				<p className="font-bold text-primary-content text-xl lg:text-4xl tracking-widest">PROFILE</p>
				<div className="h-1 mt-1 w-full bg-secondary"></div>
			</header>
			<p className="text-left text-primary-content text-md lg:text-xl capitalize w-full lg:w-3/4">
				Name: <span className="text-accent ml-4"> {auth.currentUser.displayName}</span>
			</p>
			<p className="text-left text-primary-content text-md lg:text-xl mt-5 w-full lg:w-3/4">
				Email: <span className="text-accent ml-4"> {auth.currentUser.email}</span>
			</p>
			<div className="divider"></div>
			{loading ? (
				<Spinner />
			) : (
				<div className="w-full flex flex-col justify-center items-center">
					<p className="text-xl lg:text-2xl text-primary-content font-bold mb-5">Your quizzes</p>
					<div className="container w-full lg:w-11/12 mb-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
						{/* Loop over all of the users quizzes and displays them */}
						{quizzes.map((quiz, i) => {
							return (
								<div
									key={i}
									className="flex flex-col px-8 py-5 bg-base-100 rounded-lg cursor-pointer hover:bg-base-200"
								>
									<div className="flex lg:mt-2 lg:justify-between lg:items-center flex-col lg:flex-row w-full ">
										<div className="flex font-bold text-primary-content shrink-0 justify-center items-center h-7 w-7 lg:h-10 lg:w-10 rounded-full mr-4 lg:mr-10 bg-accent text-lg lg:text-xl">
											{i + 1}
										</div>
										<p className="flex capitalize items-center my-4 lg:mt-0 lg:justify-center text-xl lg:text-2xl text-primary-content">
											{quiz.data.quizName}
										</p>
									</div>
									<div className="flex flex-row lg:mt-4 w-full justify-between">
										{/* ----------------------------------- Edit Quiz ----------------------------------- */}
										<button
											className="btn btn-secondary btn-outline btn-sm lg:btn-md lg:px-10"
											onClick={() => navigate(`/edit-quiz/${quiz.id}`)}
										>
											Edit
										</button>

										{/* ----------------------------------- Delete Quiz -----------------------------------*/}
										<label
											className="btn btn-error btn-outline btn-sm lg:btn-md lg:px-10"
											htmlFor="delete-quiz-modal"
											data-bs-toggle="tooltip"
											data-bs-placement="top"
										>
											Delete
										</label>
										{/* ----------------------------------- Delete Field Modal----------------------------------- */}
										<input type="checkbox" id="delete-quiz-modal" className="modal-toggle" />
										<label htmlFor="delete-quiz-modal" className="modal">
											<label className="modal-box relative flex flex-col">
												<label
													htmlFor="delete-quiz-modal"
													className="btn btn-sm btn-circle absolute right-2 top-2"
												>
													X
												</label>
												<p className="text-lg text-accent-content mt-5">
													Are you sure you want to delete this quiz?
												</p>
												<label
													htmlFor="delete-quiz-modal"
													className="btn btn-sm btn-accent my-5"
												>
													CANCEL
												</label>

												<label
													htmlFor="delete-quiz-modal"
													className="btn btn-sm btn-outline btn-error "
													onClick={() => deleteQuiz(quiz.id)}
												>
													DELETE
												</label>
											</label>
										</label>
									</div>

									{/* ----------------------------------- Quiz stats ----------------------------------- */}
									<div className="flex mt-4 lg:mt-10 gap-2 lg:gap-0 flex-col lg:flex-row w-full h-full">
										<p className="flex flex-row w-full">
											<FiUser className="justify-center h-6 w-6  items-center mr-3 fill-secondary" />{' '}
											{quiz.data.timesCompleted * 10621} users
										</p>
										<p className="flex flex-row w-full">
											<MdTagFaces className="justify-center h-6 w-6  items-center mr-3 fill-accent" />{' '}
											89% average score
										</p>
										<p className="w-full lg:text-right">Created by {quiz.data.userName}</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

export default MyProfile;
