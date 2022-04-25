import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../firebase.config';
import { getDoc, doc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import QuizQuestion from '../components/QuizQuestion';
import QuizResults from '../components/QuizResults';
import { toast } from 'react-toastify';

function Quiz() {
	const [quiz, setQuiz] = useState(null);
	const [question, setQuestion] = useState(0);
	const [answers, setAnswers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [score, setScore] = useState(0);
	const params = useParams();

	useEffect(() => {
		// fetch the quiz
		const fetchQuiz = async () => {
			const docRef = doc(db, 'quizzes', params.quizId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setQuiz(docSnap.data());
				setLoading(false);
			}
		};
		fetchQuiz();
	}, []);

	// submit a question ---------------------------------------------------------------------------------------------------//
	const nextQuestion = (correct, option) => {
		setAnswers(prevState => {
			prevState.push([correct, option]);
			return prevState;
		});

		// if correct score, set their score
		if (correct) setScore(prevState => (prevState += 1));

		setQuestion(prevState => prevState + 1);
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className=" w-full h-fit shadow-xl p-4 md:p-6 rounded-xl bg-base-300 items-center justify-center flex flex-col">
			{loading ? (
				<Spinner />
			) : (
				<div className="w-full flex flex-col justify-center items-center">
					<header className="w-fit flex flex-col justify-center items-center mb-6 xl:my-8 lg:px-10">
						<p className="font-bold text-primary-content text-xl lg:text-2xl tracking-widest uppercase">
							{quiz.quizName}
						</p>
						<div className="h-1 mt-1 w-full bg-secondary"></div>
					</header>

					{/* Display Quiz question or results */}
					<div className="flex flex-col w-full lg:px-10">
						{question === quiz.questions.length ? (
							<QuizResults quiz={quiz} questions={quiz.questions} answers={answers} score={score} />
						) : (
							<QuizQuestion question={quiz.questions[question]} nextQuestion={nextQuestion} />
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default Quiz;
