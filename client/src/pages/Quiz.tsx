import { Button } from '@/components/ui/button';
import type {
	QuizPageParams,
	QuizResult,
	QuizResultOption,
	QuizResultQuestion,
} from '@/types';
import { faArrowRight, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useState } from 'react';
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
import { useNavigate } from 'react-router';

export default function QuizPage({
	quizData,
	onQuizSubmittion,
}: QuizPageParams) {
	const [quizResultData, setQuizResultData] = useState<QuizResult>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const t = useTranslation();
	const [isExiting, setIsExiting] = useState(false);
	const navigate = useNavigate();

	const currentQuestion: QuizResultQuestion = quizData[currentQuestionIndex];
	const questionNumber = currentQuestionIndex + 1;
	const totalQuestions = quizData.length;

	const handleNextQuestionIndex = () => {
		if (selectedAnswer === null) {
			return;
		}

		if (currentQuestionIndex < quizData.length - 1) {
			setIsExiting(true);
		} else {
			onQuizSubmittion(quizResultData);
			navigate('/results');
		}
	};

	const onQuestionTransitionEnd = useCallback(() => {
		if (isExiting) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
			setSelectedAnswer(null);
			setIsExiting(false);
		}
	}, [
		isExiting,
		setCurrentQuestionIndex,
		setSelectedAnswer,
		setIsExiting,
		currentQuestionIndex,
	]);

	const handleQuestionAnswer = (selectedIndex: number) => {
		if (selectedAnswer !== null) {
			return;
		}

		const isCorrect = currentQuestion.correctAnswerIndex === selectedIndex;
		setQuizResultData((prevResults) => [
			...prevResults,
			{ isCorrect, selectedIndex: selectedIndex },
		]);

		setSelectedAnswer(selectedIndex);
	};

	const answerOptions = (
		<>
			{currentQuestion.options.map((option: QuizResultOption, index) => {
				// Set option class for correct and wrong options
				let optionClass = '';
				if (selectedAnswer !== null) {
					if (option.answer) {
						optionClass = 'bg-correct text-white border-transparent';
					} else if (
						index === selectedAnswer &&
						selectedAnswer !== currentQuestion.correctAnswerIndex
					) {
						optionClass = 'bg-wrong text-white border-transparent';
					}
				} else {
					optionClass = 'hover:bg-custom-light-gray/10';
				}

				return (
					<button
						key={index}
						className={`w-full py-3 flex justify-center items-center font-primary text-center
								font-medium text-custom-gray/80 cursor-pointer select-none border-1 border-custom-light-gray/50
								rounded-full transition-all duration-300 
								${isExiting ? 'opacity-0 translate-y-20' : 'opacity-100 translate-y-0'}
								
								${optionClass}
								
								`}
						onClick={() => {
							handleQuestionAnswer(index);
						}}
					>
						{option.optionText}
					</button>
				);
			})}
		</>
	);

	const navigationButtons = (
		<>
			<Dialog>
				<DialogTrigger
					asChild
					className={selectedAnswer === null ? 'hidden' : ''}
				>
					<Button
						className={`transition-all duration-500 ${
							selectedAnswer === null
								? 'absolute opacity-0 translate-y-20 border-0 -z-1'
								: 'opacity-100 translate-y-0 '
						}`}
						size="lg"
						aria-label="explanation"
						variant="minimal"
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
							{selectedAnswer !== null ? currentQuestion.explanation : null}
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			<Button
				size="lg"
				variant="green"
				onClick={() => handleNextQuestionIndex()}
				aria-label="next question"
				disabled={selectedAnswer === null}
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
