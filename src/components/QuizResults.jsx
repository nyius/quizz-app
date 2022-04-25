import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { docRef, doc, collection, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase.config';

function QuizResults({ quiz, questions, answers, score }) {
	const params = useParams();
	const navigate = useNavigate();

	// Add a count to how many times a quiz has been completed
	useEffect(() => {
		const updateQuiz = async () => {
			const docRef = doc(db, 'quizzes', params.quizId);

			const formDataCopy = {
				...quiz,
				timesCompleted: (quiz.timesCompleted += 1),
			};
			await updateDoc(docRef, formDataCopy);
		};
		updateQuiz();
	}, [params.quizId]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="w-full">
			{/* --------------------- User Score --------------------- */}
			<div className="flex flex-col justify-center mb-3 lg:mb-10 items-center w-full">
				<p className="text-xl lg:text-2xl font-bold text-success">Your Score</p>
				<p className="mt-0 lg:mt-3 text-primary-content text-2xl lg:text-4xl">
					{score}/{answers.length}
				</p>
			</div>
			{/* --------------------- Answers --------------------- */}
			<p className="text-xl lg:text-2xl text-primary-content font-bold">Answers</p>
			<div className="divider"></div>
			<div className="mt-2 lg:mt-10">
				{answers.map((answer, i) => {
					return (
						<div key={i} className="flex flex-col mt-2 lg:mt-10">
							<div className="flex flex-row items-center gap-4">
								<p
									className={`flex font-bold text-primary-content shrink-0 justify-center items-center h-8 w-8 lg:h-12 lg:w-12 rounded-full mr-10 ${
										answer[0] === true ? 'bg-success' : 'bg-error'
									} text-xl lg:text-2xl`}
								>
									{i + 1}
								</p>
								<div className="flex flex-col w-full">
									<p className="text-2xl capitalize text-primary-content">{questions[i].question}</p>
									<div className="flex lg:flex-row flex-col mt-2 gap-2 lg:gap-16">
										<p className="lg:w-1/2">
											Your answer: <span className="font-bold capitalize lg:ml-3">{answer}</span>
										</p>
										<p className="lg:w-1/2">
											Correct answer:{' '}
											<span className="font-bold capitalize lg:ml-3">{questions[i].answer}</span>
										</p>
									</div>
								</div>
							</div>
							<div className="divider"></div>
						</div>
					);
				})}
			</div>
			<div className="w-full flex justify-center items-center mt-5">
				<button className="btn btn-outline btn-secondary btn-md lg:btn-lg" onClick={() => navigate('/')}>
					Return to Quizzes
				</button>
			</div>
		</div>
	);
}

export default QuizResults;
