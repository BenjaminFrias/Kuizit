import type { QuizReviewPageParams } from '@/types';
import BlurryShape from '@/components/decorative/BlurryShape';
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

export function QuizReviewPage({
	quizData,
	quizResults,
	onPageChange,
}: QuizReviewPageParams) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	const currentQuestion = quizData[currentQuestionIndex];
	const questionNumber = currentQuestionIndex + 1;
	const totalQuestions = quizData.length;
	const selectedAnswerIndex = quizResults[currentQuestionIndex].selectedIndex;

	const t = useTranslation();

	const handleNextQuestionIndex = () => {
		setIsAnimating(true);

		setTimeout(() => {
			if (currentQuestionIndex < quizData.length - 1) {
				setCurrentQuestionIndex(currentQuestionIndex + 1);
			} else {
				onPageChange('results');
			}
			setIsAnimating(false);
		}, 500);
	};

	const handlePrevQuestionIndex = () => {
		setIsAnimating(true);

		setTimeout(() => {
			if (currentQuestionIndex > 0) {
				setCurrentQuestionIndex(currentQuestionIndex - 1);
			}
			setIsAnimating(false);
		}, 500);
	};

	return (
		<div className="min-h-screen min-w-screen flex flex-col w-full items-center md:flex-row md:items-stretch overflow-x-hidden">
			<div
				className="relative flex flex-col w-full gap-6 px-8 py-8 justify-center items-center
                bg-custom-gray flex-4 md:flex-2/4 md:overflow-hidden md:max-h-screen md:pl-13"
			>
				<div
					className="absolute -top-50 w-90 h-90 left-0 right-0 md:w-140
                                            md:h-140 md:top-0 md:bottom-0 md:-left-70 lg:-left-110 lg:w-200 lg:h-200 opacity-80 "
				>
					<BlurryShape />
				</div>
				<p
					className={`text-custom-white text-center md:self-start font-medium z-1 transition-all duration-300
                    ${
											isAnimating
												? 'opacity-0 translate-y-3'
												: 'opacity-100 translate-y-0'
										}
                    `}
				>
					{t.question} {questionNumber}
				</p>
				<h1
					className={`font-primary text-custom-white text-shadow-title/30  font-medium text-center text-3xl  w-full z-1 
                    md:self-start md:text-start md:text-5xl transition-all duration-300 ${
											isAnimating
												? 'opacity-0 translate-y-3'
												: 'opacity-100 translate-y-0'
										}`}
				>
					{currentQuestion.question}
				</h1>
			</div>
			<div className="relative flex flex-col flex-3 w-full px-5 pb-8 gap-10 md:flex-1/3 justify-between items-center py-5 bg-custom-white">
				<div className="flex w-full relative">
					<div className="progress-bar absolute w-[100%] bg-custom-light-gray/15 h-1 rounded-full transition-all duration-300"></div>
					<div
						className="progress-bar absolute max-w-full bg-custom-green h-1 rounded-full transition-all duration-300"
						style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
						data-testid="progress-bar"
					></div>
				</div>
				<div className="answerOptions flex-1 flex flex-col justify-center items-center w-full gap-3">
					{currentQuestion.options.map((option, index) => {
						let optionClass = '';
						if (option.answer === true) {
							optionClass = 'bg-correct text-white';
						}

						return (
							<button
								key={index}
								className={`w-full py-3 flex justify-center items-center font-primary text-center
                                    font-medium text-custom-gray/80 cursor-pointer select-none border-1 border-custom-light-gray/50
                                    rounded-full transition-all duration-300 ${
																			isAnimating
																				? 'opacity-0 translate-y-20'
																				: 'opacity-100 translate-y-0'
																		}
                                    
                                    ${optionClass} ${
									index === currentQuestion.correctAnswerIndex
										? 'border-transparent'
										: ''
								}
                                    
                                    ${
																			index === selectedAnswerIndex
																				? selectedAnswerIndex !==
																				  currentQuestion.correctAnswerIndex
																					? 'bg-wrong text-white border-transparent'
																					: ''
																				: ''
																		}
                                    `}
							>
								{option.optionText}
							</button>
						);
					})}
				</div>
				<div className="flex gap-2">
					<Button
						size="responsive"
						variant="minimal"
						onClick={() => onPageChange('home')}
						aria-label="end review"
					>
						<FontAwesomeIcon icon={faX} />
					</Button>
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
				</div>
			</div>
		</div>
	);
}
