import type {
	QuizResultOption,
	QuizResultQuestion,
	QuizReviewPageParams,
} from '@/types';
import { Button } from '@/components/ui/button';
import {
	faArrowLeft,
	faArrowRight,
	faQuestion,
	faX,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/useTranslation';
import { QuizLayout } from './QuizLayout';
import { Link, useNavigate } from 'react-router';

export default function QuizReviewPage({
	quizData,
	quizResults,
}: QuizReviewPageParams) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [isExiting, setIsExiting] = useState(false);
	const [transitionDirection, setTransitionDirection] = useState<0 | 1 | -1>(0);
	const navigate = useNavigate();
	const t = useTranslation();

	const currentQuestion: QuizResultQuestion = quizData[currentQuestionIndex];
	const questionNumber = currentQuestionIndex + 1;
	const totalQuestions = quizData.length;
	const selectedAnswerIndex = quizResults[currentQuestionIndex].selectedIndex;

	const handleNextQuestionIndex = () => {
		if (currentQuestionIndex < quizData.length - 1) {
			setIsExiting(true);
			setTransitionDirection(1);
		} else {
			navigate('/results');
		}
	};

	const handlePrevQuestionIndex = () => {
		if (currentQuestionIndex > 0) {
			setIsExiting(true);
			setTransitionDirection(-1);
		}
	};

	const onQuestionTransitionEnd = () => {
		if (isExiting) {
			setCurrentQuestionIndex(currentQuestionIndex + transitionDirection);
			setIsExiting(false);
		}
	};

	const answerOptions = (
		<>
			{currentQuestion.options.map((option: QuizResultOption, index) => {
				// Set class for correct and wrong options
				let optionClass = '';
				if (option.answer) {
					optionClass = 'bg-correct text-white border-transparent';
				} else if (
					index === selectedAnswerIndex &&
					selectedAnswerIndex !== currentQuestion.correctAnswerIndex
				) {
					optionClass = 'bg-wrong text-white border-transparent';
				}

				return (
					<button
						key={index}
						className={`w-full py-3 flex justify-center items-center font-primary text-center font-medium 
									text-custom-gray/80 cursor-pointer select-none border-1 border-custom-light-gray/50
                                    rounded-full transition-all duration-300
									${isExiting ? 'opacity-0 translate-y-20' : 'opacity-100 translate-y-0'}
                                    
                                    ${optionClass}
                                `}
					>
						{option.optionText}
					</button>
				);
			})}
		</>
	);

	const navigationButtons = (
		<>
			<Link to={'/results'}>
				<Button size="responsive" variant="minimal" aria-label="end review">
					<FontAwesomeIcon icon={faX} />
				</Button>
			</Link>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						className={`transition-all duration-500`}
						size="responsive"
						variant="minimal"
						aria-label="explanation"
					>
						<FontAwesomeIcon icon={faQuestion} />
					</Button>
				</DialogTrigger>

				<DialogContent className="sm:max-w-md bg-custom-white">
					<DialogHeader>
						<DialogTitle className="text-custom-green mb-5">
							{t.explanation}
						</DialogTitle>
						<DialogDescription className="text-custom-gray text-md font-medium">
							{currentQuestion.explanation}
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			{currentQuestionIndex > 0 ? (
				<Button
					size="responsive"
					variant="minimal"
					onClick={() => handlePrevQuestionIndex()}
					aria-label="previous question"
				>
					<FontAwesomeIcon icon={faArrowLeft} />
				</Button>
			) : null}

			<Button
				size="responsive"
				variant="minimal"
				onClick={() => handleNextQuestionIndex()}
				aria-label="next question"
			>
				<FontAwesomeIcon icon={faArrowRight} />
			</Button>
		</>
	);

	return (
		<QuizLayout
			currentQuestion={currentQuestion}
			questionNumber={questionNumber}
			totalQuestions={totalQuestions}
			answerOptions={answerOptions}
			navigationButtons={navigationButtons}
			isExiting={isExiting}
			onTransitionEnd={onQuestionTransitionEnd}
		/>
	);
}
