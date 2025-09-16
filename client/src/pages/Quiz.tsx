import BlurryShape from '@/components/decorative/BlurryShape';
import { Button } from '@/components/ui/button';
import type { Page, QuizData, QuizResult } from '@/types';
import { faArrowRight, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

type QuizPageParams = {
	onPageChange: (pageName: Page) => void;
	quizData: QuizData;
	quizResultData: QuizResult;
	onAnswerSubmittion: (newQuizResult: QuizResult) => void;
};

export function QuizPage({
	quizData,
	quizResultData,
	onPageChange,
	onAnswerSubmittion,
}: QuizPageParams) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [isAnimating, setIsAnimating] = useState(false);

	const currentQuestion = quizData[currentQuestionIndex];
	const questionNumber = currentQuestionIndex + 1;
	const totalQuestions = quizData.length;

	const handleNextQuestionIndex = () => {
		if (selectedAnswer === null) {
			return;
		}

		setIsAnimating(true);

		setTimeout(() => {
			if (currentQuestionIndex < quizData.length - 1) {
				setCurrentQuestionIndex(currentQuestionIndex + 1);
				setSelectedAnswer(null);
			} else {
				onPageChange('home');
			}
			setIsAnimating(false);
		}, 500);
	};

	const handleQuestionAnswer = (selectedIndex: number) => {
		if (selectedAnswer !== null) {
			return;
		}

		const isCorrect = currentQuestion.correctAnswerIndex === selectedIndex;
		const newQuizResultData = [
			...quizResultData,
			{ isCorrect, selectedIndex: selectedIndex },
		];

		setSelectedAnswer(selectedIndex);
		onAnswerSubmittion(newQuizResultData);
	};

	return (
		<div className="min-h-screen min-w-screen flex flex-col w-full items-center md:flex-row md:items-stretch overflow-hidden">
			<div
				className="relative flex flex-col w-full gap-6 px-8 py-8 justify-center items-center
			bg-custom-gray flex-4 md:flex-2/4 md:h-screen md:pl-13"
			>
				<div
					className="absolute -top-50 w-90 h-90 left-0 right-0 md:w-140
                                        md:h-140 md:top-0 md:bottom-0 md:-left-70 lg:-left-110 lg:w-200 lg:h-200 opacity-80 "
				>
					<BlurryShape />
				</div>
				<p
					className={`text-custom-white text-center md:self-start font-medium z-1 transition-all duration-300
						${isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}
						`}
				>
					Question {questionNumber}
				</p>
				<h1
					className={`font-primary text-custom-white text-shadow-title/30  font-medium text-center text-3xl  w-full z-1 
				md:self-start md:text-start md:text-5xl transition-all duration-300 ${
					isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
				}`}
				>
					{currentQuestion.question}
				</h1>
			</div>
			<div className="relative flex flex-col flex-3 w-full px-5 gap-10 md:flex-1/3 justify-between items-center py-5 bg-custom-white">
				<div className="flex w-full relative">
					<div className="progress-bar absolute w-[100%] bg-custom-light-gray/15 h-1 rounded-full transition-all duration-300"></div>
					<div
						className="progress-bar absolute max-w-full bg-custom-green h-1 rounded-full transition-all duration-300"
						style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
					></div>
				</div>
				<div className="answerOptions flex-1 flex flex-col justify-center items-center w-full gap-3">
					{currentQuestion.options.map((option, index) => {
						let optionClass = '';
						if (selectedAnswer !== null) {
							if (option.answer === true) {
								optionClass = 'bg-correct text-white';
							}
						}

						return (
							<div
								key={index}
								className={`w-full py-3 flex justify-center items-center font-primary text-center
								font-medium text-custom-gray/80 cursor-pointer select-none border-1 border-custom-light-gray/50
								rounded-full transition-all duration-300 ${
									isAnimating
										? 'opacity-0 translate-y-20'
										: 'opacity-100 translate-y-0'
								}
								
								${optionClass} ${
									selectedAnswer === null
										? 'hover:bg-custom-light-gray/10 '
										: index === currentQuestion.correctAnswerIndex
										? 'border-transparent'
										: ''
								}
								
								${
									selectedAnswer !== null
										? index === selectedAnswer
											? selectedAnswer !== currentQuestion.correctAnswerIndex
												? 'bg-wrong text-white border-transparent'
												: ''
											: ''
										: ''
								}
								`}
								onClick={() => {
									handleQuestionAnswer(index);
								}}
							>
								{option.optionText}
							</div>
						);
					})}
				</div>
				<div className="flex gap-3">
					{selectedAnswer !== null ? (
						<Dialog>
							<DialogTrigger asChild>
								<Button
									className={`transition-all duration-300 ${
										isAnimating
											? 'opacity-0 translate-y-20'
											: 'opacity-100 translate-y-0'
									}`}
									size="lg"
									variant="minimal"
								>
									<FontAwesomeIcon icon={faQuestion} />
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-md bg-custom-white">
								<DialogHeader>
									<DialogTitle className="text-custom-green mb-5">
										Explanation
									</DialogTitle>
									<DialogDescription className="text-custom-gray text-md font-medium">
										{currentQuestion.explanation}
									</DialogDescription>
								</DialogHeader>
							</DialogContent>
						</Dialog>
					) : null}

					{selectedAnswer !== null ? (
						<Button
							size="lg"
							variant="green"
							onClick={() => handleNextQuestionIndex()}
						>
							<FontAwesomeIcon icon={faArrowRight} />
						</Button>
					) : (
						<Button
							className="opacity-50 pointer-events-none"
							size="lg"
							variant="green"
						>
							<FontAwesomeIcon icon={faArrowRight} />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
