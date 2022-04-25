import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { FiUser } from 'react-icons/fi';
import { MdTagFaces } from 'react-icons/md';

function AllQuizes() {
	const [quizzes, setQuizzes] = useState(null);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchQuizzes = async () => {
			try {
				// Create reference to DB and our query
				const quizzesRef = collection(db, 'quizzes');
				const q = query(quizzesRef);

				// get our quizzes
				const querySnap = await getDocs(q);

				const quizzesArr = [];

				querySnap.forEach(quiz => {
					return quizzesArr.push({
						id: quiz.id,
						data: quiz.data(),
					});
				});

				setQuizzes(quizzesArr);
				setLoading(false);
			} catch (error) {
				toast.error('Something went wrong while loading quizzes. Please try again');
				console.log(error);
			}
		};

		fetchQuizzes();
	}, []);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className=" w-full shadow-xl p-2 lg:p-6 rounded-xl mt-4 justify-center bg-base-300 items-center flex flex-col">
			<header className="w-fit flex flex-col justify-center items-center my-4 lg:my-10">
				<p className="font-bold text-primary-content text-xl md:text-4xl tracking-widest">QUIZZES</p>
				<div className="h-1 mt-1 w-full bg-secondary"></div>
			</header>
			{loading ? (
				<Spinner />
			) : (
				<div className="container w-full lg:w-11/12 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{quizzes.map((quiz, i) => {
						return (
							<div
								key={i}
								className="flex flex-col px-4 lg:px-6 py-4 lg:py-5 bg-base-100 rounded-lg cursor-pointer hover:bg-primary"
								onClick={() => navigate(`/quiz/${quiz.id}`)}
							>
								<div className="flex flex-row w-full">
									<div className="flex font-bold text-primary-content shrink-0 justify-center items-center h-7 w-7 lg:h-10 lg:w-10 rounded-full mr-4 lg:mr-10 bg-accent text-lg lg:text-xl">
										{i + 1}
									</div>
									<p className="flex items-center justify-center text-lg md:text-2xl text-primary-content">
										{quiz.data.quizName}
									</p>
								</div>
								<div className="flex mt-6 md:mt-8 flex-col gap-3 md:gap-0 xl:flex-row w-full h-full">
									<p className="flex flex-row w-full">
										<FiUser className="justify-center h-6 w-6 items-center mr-3 fill-secondary" />{' '}
										{quiz.data.timesCompleted * 10621} users
									</p>
									<p className="flex flex-row w-full mt-2 xl:mt-0">
										<MdTagFaces className="justify-center h-6 w-6  items-center mr-3 fill-accent" />{' '}
										89% average score
									</p>
									<p className="w-full text-left xl:text-right">Created by {quiz.data.userName}</p>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default AllQuizes;
