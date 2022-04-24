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
		<div className=" w-full shadow-xl p-10 rounded-xl justify-center bg-base-300 items-center flex flex-col">
			<header className="w-fit flex flex-col justify-center items-center my-10">
				<p className="font-bold text-primary-content text-4xl tracking-widest">QUIZZES</p>
				<div className="h-1 mt-1 w-full bg-secondary"></div>
			</header>
			{loading ? (
				<Spinner />
			) : (
				<div className="container w-3/4 mb-10 flex flex-col gap-5">
					{quizzes.map((quiz, i) => {
						return (
							<div
								key={i}
								className="flex flex-col px-8 py-5 bg-base-100 rounded-lg cursor-pointer hover:bg-primary"
								onClick={() => navigate(`/quiz/${quiz.id}`)}
							>
								<div className="flex mt-10 flex-row w-full ">
									<div className="flex font-bold text-primary-content shrink-0 justify-center items-center h-14 w-14 rounded-full mr-10 bg-accent text-4xl">
										{i + 1}
									</div>
									<p className="flex items-center justify-center text-2xl text-primary-content">
										{quiz.data.quizName}
									</p>
								</div>
								<div className="flex mt-16 flex-row w-full h-full">
									<p className="flex flex-row w-full">
										<FiUser className="justify-center h-6 w-6  items-center mr-3 fill-secondary" />{' '}
										{quiz.data.timesCompleted * 10621} users
									</p>
									<p className="flex flex-row w-full">
										<MdTagFaces className="justify-center h-6 w-6  items-center mr-3 fill-accent" />{' '}
										89% average score
									</p>
									<p className="w-full text-right">Created by {quiz.data.userName}</p>
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
