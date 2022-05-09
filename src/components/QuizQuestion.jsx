import React, { useState } from 'react';
import { toast } from 'react-toastify';

// A quiz question. Takes in the current question, as well as the function to handle submitting an answer and going to the next question
function QuizQuestion({ question, nextQuestion }) {
	// State to store an option
	const [option, setOption] = useState(0);

	// Get all of the options for the current question
	const { options } = question;

	//---------------------------------------------------------------------------------------------------//
	/**
	 * Handles the user selecting an answer
	 * expects an event (e)
	 * @param {*} e
	 */
	const selectOption = e => {
		setOption(e.target.value);
	};

	//---------------------------------------------------------------------------------------------------//
	/**
	 * Handles the user submitting an answer and going to the next question.
	 * Checks for valid selected answer.
	 * Expectes an event(e)
	 * @param {*} e
	 * @returns
	 */
	const submitAnswer = e => {
		e.preventDefault();

		if (!option) {
			toast.error('You need to select an option');
			return;
		} else {
			// If they chose the right or wrong answer
			if (option.toLowerCase() === question.answer.toLowerCase()) {
				nextQuestion(true, option);
			} else {
				nextQuestion(false, option);
			}
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<p className="text-2xl text-primary-content font-bold">{question.question}</p>
			<form className="flex flex-col gap-2 my-6 " onSubmit={submitAnswer}>
				{/* Loop over each option and add it to the form */}
				{options.map((option, i) => {
					return (
						<div key={i} className="flex flex-row px-4 items-center gap-6 rounded-lg hover:bg-base-100">
							<input
								type="radio"
								value={option}
								name="radio-4"
								className="radio radio-accent"
								onChange={selectOption}
							/>
							<p className="text-primary-content capitalize my-4 text-2xl">{option}</p>
						</div>
					);
				})}
				<button className="btn btn-secondary self-center w-1/2 lg:w-3/12 btn-outline btn-lg mt-8">
					Next Question
				</button>
			</form>
		</>
	);
}

export default QuizQuestion;
