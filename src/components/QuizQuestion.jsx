import React, { useState } from 'react';
import { toast } from 'react-toastify';

function QuizQuestion({ question, nextQuestion }) {
	const [option, setOption] = useState(0);
	const { options } = question;

	const selectOption = e => {
		setOption(e.target.value);
	};

	const chooseAnswer = e => {
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

	return (
		<div className="mx-8">
			<p className="text-4xl text-primary-content font-bold">{question.question}</p>
			<form className="flex flex-col gap-4 my-10 " onSubmit={chooseAnswer}>
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
				<button className="btn btn-secondary self-center w-3/12 btn-outline btn-lg mt-8">Next Question</button>
			</form>
		</div>
	);
}

export default QuizQuestion;
