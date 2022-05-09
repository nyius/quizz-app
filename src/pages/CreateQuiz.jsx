import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BsPlusCircle } from 'react-icons/bs';
import { BiMinusCircle } from 'react-icons/bi';
import { auth, db } from '../firebase.config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

function CreateQuiz() {
	// State for all of the entered quiz data
	const [formData, setFormData] = useState({
		quizName: '',
		questions: [{ question: '', answer: '', options: [''] }],
	});

	const { questions } = formData;
	const navigate = useNavigate();

	// ---------------------------------------------------------------------------------------//
	/**
	 * Handles whenever a user starts typing in an input field
	 * Stores entered quiz information into formData.
	 * Expects an event (e), a question index num (i), and option index num (j).
	 * @param {*} e
	 * @param {number} i
	 * @param {number} j
	 */
	const onChange = (e, i, j) => {
		if (e.target.id === 'quizName') {
			setFormData(prevState => ({
				...prevState,
				quizName: e.target.value,
			}));
		}
		if (e.target.id === 'question') {
			questions[i].question = e.target.value;
			setFormData(prevState => ({
				...prevState,
				questions,
			}));
		}
		if (e.target.id === 'option') {
			questions[i].options[j] = e.target.value;
			setFormData(prevState => ({
				...prevState,
				questions,
			}));
		}
	};

	// ---------------------------------------------------------------------------------------------------//
	/**
	 * Call this function when a user presses "add a new question" button.
	 * Handles checking if their question is valid, and if it is we add it to our formState.
	 * Expects an event.
	 * @param {*} e
	 */
	const addQuestion = e => {
		e.preventDefault();
		// Check if the user has enterd a question name and atleast 1 option before making a new question
		if (
			questions[questions.length - 1].question !== '' &&
			questions[questions.length - 1].options[0] !== '' &&
			questions[questions.length - 1].answer !== ''
		) {
			questions.push({ question: '', answer: '', options: [''] });

			setFormData(prevState => ({
				...prevState,
				questions,
			}));
		} else if (
			questions[questions.length - 1].options[0] === '' &&
			questions[questions.length - 1].options.length === 1
		) {
			toast.error('You need to enter atleast 1 answer!');
		} else if (questions[questions.length - 1].question === '') {
			toast.error('You need to enter a question!');
		} else if (questions[questions.length - 1].answer === '') {
			toast.error('You need to select an answer!');
		}
	};

	// ------------------------------------------------------------------------------------------//
	/**
	 * Handles user adding an option to a question.
	 * Expects an event, and a index number for a question to push the option to.
	 * @param {*} e
	 * @param {number} i
	 */
	const addOption = (e, i) => {
		// Check if the user entered anything in the last field before making a new one
		if (questions[i].options[questions[i].options.length - 1] !== '') {
			questions[i].options.push('');
			setFormData(prevState => ({
				...prevState,
				questions,
			}));
		}
	};

	// ---------------------------------------------------------------------------------------------------//
	/**
	 * Handles the user removing an option from a question.
	 * Expects an event (e), a question index num (i), and a option index num (j).
	 * @param {*} e
	 * @param {number} i
	 * @param {number} j
	 */
	const removeOption = (e, i, j) => {
		// First checks if this is the only option in the list or not (don't let the user remove the last option)
		if (questions[i].options.length > 1) {
			questions[i].options.splice(j, 1);
			setFormData(prevState => ({
				...prevState,
				questions,
			}));
		} else {
			toast.error('Cant remove last option');
		}
	};

	// ---------------------------------------------------------------------------------------------------//
	/**
	 * Handles user pressing the enter key when inside of an option field (to add a new option)
	 * Expects an event.
	 * @param {*} e
	 */
	const addQuestionKeyDown = e => {
		if (e.key === 'Enter') {
			addQuestion(e);
		}
	};

	//  ---------------------------------------------------------------------------------------------------//
	/**
	 * Handles the user choosing an option as the correct answer
	 * expects an event, and a question index number.
	 * @param {*} e
	 * @param {number} i
	 */
	const setAnswer = (e, i) => {
		questions[i].answer = e.target.value;
		setFormData(prevState => ({
			...prevState,
			questions,
		}));
	};

	//---------------------------------------------------------------------------------------------------//
	/**
	 * Handles the user submitting their quiz.
	 * Expects an event.
	 * Checks over all input fields for valid entries, and displays error message and stops submission if there are invalid entries.
	 * @param {*} e
	 * @returns
	 */
	const quizSubmit = async e => {
		e.preventDefault();

		// Variables to check if the user has met minimum proper requirements for submitting a new quiz.
		// All options have to pass before the quiz can be submitted
		let qName = false;
		let qQuestions = true;
		let qAnswers = true;
		let qOptions = true;

		// Check that there are no blank form fields
		// First, check for any blank questions
		questions.forEach((q, i) => {
			if (q.question === '') {
				toast.error('You forgot one of your questions!');
				qQuestions === false ? (qQuestions = false) : (qQuestions = false);
			} else {
				qQuestions === false ? (qQuestions = false) : (qQuestions = true);
			}

			// Loop over each option and make sure there are no blanc options.
			q.options.forEach((opt, j) => {
				if (opt === '') {
					toast.error('One of your options is blank!');
					qOptions === false ? (qOptions = false) : (qOptions = false);
				} else {
					qOptions === false ? (qOptions = false) : (qOptions = true);
				}
			});

			// Check the answer and make sure there is one set.
			if (q.answer === '') {
				toast.error('You need to have an answer for all questions!');
				qAnswers === false ? (qAnswers = false) : (qAnswers = false);
			} else {
				qAnswers === false ? (qAnswers = false) : (qAnswers = true);
			}
		});

		// Check if the user set a quiz name.
		if (formData.quizName === '') {
			toast.error('You need to give your quiz a name!');
			qName = false;
			return;
		} else {
			qName = true;
		}

		// If theres all form fields are good, submit the quiz
		if (qName && qQuestions && qOptions && qAnswers) {
			const formDataCopy = {
				...formData,
				userName: auth.currentUser.displayName,
				userRef: auth.currentUser.uid,
				timestamp: serverTimestamp(),
				timesCompleted: 0,
			};
			// Add the quiz to our database.
			const docRef = await addDoc(collection(db, 'quizzes'), formDataCopy);
			toast.success('Quiz created!');

			navigate(`/quiz/${docRef.id}`);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="w-full rounded-xl shadow-xl p-4 lg:p-10 bg-base-300">
			<div className="justify-center items-center flex flex-col">
				<header className="w-fit flex flex-col justify-center items-center my-3 lg:my-8">
					<p className="font-bold text-primary-content text-xl lg:text-4xl tracking-widest">CREATE</p>
					<div className="h-1 mt-1 w-full bg-secondary"></div>
				</header>
			</div>
			<div className="w-full flex flex-col gap-5">
				<label htmlFor="" className="text-primary-content text-xl lg:text-2xl shrink-0">
					Quiz Name
				</label>
				<input
					type="text"
					id="quizName"
					placeholder="enter name"
					onChange={onChange}
					className="input input-md-- lg:input-lg w-full"
				/>

				{/* Questions -------------------------------------------------------------------------- */}
				{formData.questions.map((question, i) => {
					return (
						<div key={i} className="w-full">
							<div className="divider"></div>
							<div className="flex flex-col lg:flex-row gap-4 lg:gap-10">
								<div className="flex font-bold text-primary-content shrink-0 justify-center items-center h-8 w-8 lg:h-12 lg:w-12 mt-1 rounded-full bg-accent text-xl lg:text-2xl">
									{i + 1}
								</div>
								<div className="w-full lg:w-4/12">
									<textarea
										type="text"
										id="question"
										defaultValue=""
										placeholder="enter question"
										onChange={e => onChange(e, i)}
										onKeyDown={addQuestionKeyDown}
										className="textarea w-full text-lg lg:text-xl"
										min={3}
									/>
								</div>

								{/* Options -------------------------------------------------------------------------- */}
								<form className="w-full lg:w-6/12">
									{question.options.map((option, j) => {
										return (
											<div key={j} className="flex flex-row gap-3 items-center">
												<div className="flex justify-center items-center font-bold text-primary-content shrink-0 h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-primary text-xl">
													{j + 1}
												</div>
												<input
													type="text"
													id="option"
													defaultValue=""
													placeholder="enter option"
													onChange={e => onChange(e, i, j)}
													className="input input-lg w-full mb-2"
													min={1}
												/>
												<input
													type="radio"
													defaultValue={option}
													name="radio-4"
													className="radio radio-accent mr-4"
													onChange={e => setAnswer(e, i)}
													title="Set answer"
												/>
												<BiMinusCircle
													className="w-10 h-10 cursor-pointer fill-error hover:fill-error-content"
													onClick={e => removeOption(e, i, j)}
													title="Add a new option"
												/>
											</div>
										);
									})}
								</form>
								<button
									className="btn btn-outline btn-secondary btn-large block lg:hidden"
									onClick={e => addOption(e, i)}
									title="Add option"
								>
									Add Option
								</button>
								<BsPlusCircle
									className="w-7 h-7 hidden lg:block mt-5 cursor-pointer fill-secondary hover:fill-accent"
									onClick={e => addOption(e, i)}
									title="Add option"
								/>
							</div>
						</div>
					);
				})}

				<button
					className="btn btn-secondary btn-outline btn-large w-full mt-8"
					onClick={addQuestion}
					title="Add a new question"
				>
					Add Question <BsPlusCircle className="w-5 h-5 ml-4" />{' '}
				</button>
				<button
					className="btn btn-accent btn-outline btn-large w-full mt-2"
					onClick={quizSubmit}
					title="Submit Quiz"
				>
					Submit Quiz
				</button>
			</div>
		</div>
	);
}

export default CreateQuiz;
