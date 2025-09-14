import BlurryShape from '@/components/decorative/BlurryShape';
import { Button } from '@/components/ui/button';
import type { Page, QuizData } from '@/types';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

type quizPageParams = {
	onPageChange: (pageName: Page) => void;
	quizData: QuizData;
};

export function QuizPage({ onPageChange, quizData }: quizPageParams) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	const handleNextQuestionIndex = () => {
		if (currentQuestionIndex < quizData.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			onPageChange('home');
		}
	};

	const currentQuestion = quizData[currentQuestionIndex];
	const questionNumber = currentQuestionIndex + 1;
	const totalQuestions = quizData.length;

	return (
		<div className="min-h-screen min-w-screen w-full flex flex-col md:flex-row overflow-hidden">
			<div className="relative flex flex-col gap-6 px-8 justify-center items-center bg-custom-gray flex-1 md:flex-2/4 ">
				<div
					className="absolute -top-50 w-90 h-90 left-0 right-0 md:w-140
                                        md:h-140 md:-top-50 md:-left-70 lg:-top-100 lg:-left-110 lg:w-200 lg:h-200 opacity-80 "
				>
					<BlurryShape />
				</div>
				<p className=" text-custom-white text-center font-medium z-1">
					Question {questionNumber}
				</p>
				<h1 className="font-primary text-custom-white text-shadow-title/30  font-medium text-center text-3xl  w-full z-1">
					{currentQuestion.question}
				</h1>
			</div>
			<div className="relative flex flex-col flex-3 px-5 md:flex-1/3 justify-between py-5">
				<div className="flex w-full relative">
					<div className="progress-bar absolute w-[100%] bg-custom-light-gray/15 h-1 rounded-full transition-all duration-300"></div>
					<div
						className="progress-bar absolute max-w-full bg-custom-green h-1 rounded-full transition-all duration-300"
						style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
					></div>
				</div>
				<div className="answerOptions"></div>
			</div>
			<Button
				className="mt-5 w-10 h-10"
				size="lg"
				variant="green"
				onClick={() => onPageChange('quiz')}
			>
				<FontAwesomeIcon icon={faArrowRight} />
			</Button>
		</div>
	);
}
