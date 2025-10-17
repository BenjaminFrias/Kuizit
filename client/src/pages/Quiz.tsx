import BlurryShape from '@/components/decorative/BlurryShape';
import { Button } from '@/components/ui/button';
import type { QuizPageParams, QuizResult, QuizResultQuestion } from '@/types';
import { faArrowRight, faQuestion } from '@fortawesome/free-solid-svg-icons';
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

export function QuizPage({
	quizData,
	onPageChange,
	onQuizSubmittion,
}: QuizPageParams) {
	const [quizResultData, setQuizResultData] = useState<QuizResult>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const t = useTranslation();
	const [isExiting, setIsExiting] = useState(false);

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
			onPageChange('results');
		}
	};

	const onQuestionTransitionEnd = () => {
		if (isExiting) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
			setSelectedAnswer(null);
			setIsExiting(false);
		}
	};

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

	return (
		<div className="min-h-screen min-w-screen flex flex-col w-full items-center md:flex-row md:items-stretch md:overflow-hidden">
			<div
				className="relative flex flex-col w-full gap-6 px-8 py-8 justify-center items-center
			bg-custom-gray flex-4 md:flex-2/4 md:h-screen md:pl-13 overflow-hidden"
			>
				<div
					className="absolute -top-50 w-90 h-90 left-0 right-0 md:w-140
                                        md:h-140 md:top-0 md:bottom-0 md:-left-70 lg:-left-110 lg:w-200 lg:h-200 opacity-80 "
				>
					<BlurryShape />
				</div>
				<p
					className={`text-custom-white text-center md:self-start font-medium z-1 transition-all duration-300
						${isExiting ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}
						`}
				>
					{t.question} {questionNumber}
				</p>
				<h1
					className={`font-primary text-custom-white text-shadow-title/30  font-medium text-center text-3xl  w-full z-1 
				md:self-start md:text-start md:text-5xl transition-all duration-300 ${
					isExiting ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
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
						data-testid="progress-bar"
						style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
					></div>
				</div>
				<div className="answerOptions flex-1 flex flex-col justify-center items-center w-full gap-3">
					{currentQuestion.options.map((option, index) => {
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
								onTransitionEnd={onQuestionTransitionEnd}
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
				</div>
				<div className="flex gap-3">
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
				</div>
			</div>
		</div>
	);
}
