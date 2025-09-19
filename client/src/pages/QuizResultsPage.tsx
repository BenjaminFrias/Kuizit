import type { Page, QuizResult } from '@/types';
import BlurryShape from '@/components/decorative/BlurryShape';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

type QuizResultsPageParams = {
	quizResults: QuizResult;
	onPageChange: (page: Page) => void;
};

export function QuizResultsPage({
	quizResults,
	onPageChange,
}: QuizResultsPageParams) {
	const [isAnimating, setIsAnimating] = useState(true);

	setTimeout(() => {
		setIsAnimating(false);
	}, 300);

	const totalQuestions = quizResults.length;
	const score = quizResults.filter((answer) => answer.isCorrect == true).length;
	const percentageScore = Math.floor((score / totalQuestions) * 100);

	return (
		<div className="min-h-screen min-w-screen flex flex-col w-full justify-between items-center bg-custom-gray px-8 py-8 overflow-hidden">
			<h2 className="text-custom-white text-3xl font-medium z-1">
				Quiz Results
			</h2>
			<div className="relative flex flex-col w-full gap-2 justify-center ">
				<div className="text-custom-white text-center">
					<FontAwesomeIcon icon={faCrown} size="2x" />
				</div>
				<p
					className={`text-custom-white text-2xl text-center font-semibold z-1 transition-all duration-300 mb-5
									${isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}
									`}
				>
					Congratulations!
				</p>
				<p
					className={`text-custom-white text-center font-medium z-1 transition-all duration-300
							${isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}
							`}
				>
					Your score is..
				</p>
				<h1
					className={`font-primary text-custom-white text-shadow-title/30  font-medium text-center text-8xl  w-full z-1 
					transition-all duration-300 md:text-[10rem] ${
						isAnimating
							? 'opacity-0 translate-y-3'
							: 'opacity-100 translate-y-0'
					}`}
				>
					{percentageScore}%
				</h1>
				<p
					className={`text-custom-white text-center font-medium z-1 transition-all duration-300
							${isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}
							`}
				>
					You got <span className="text-custom-green font-bold">{score}</span>{' '}
					out of{' '}
					<span className="text-custom-green font-bold">{totalQuestions}</span>{' '}
					questions correctly
				</p>
			</div>
			<div className="flex gap-3 z-1 mb-10">
				<Button
					size="md"
					variant="secondary"
					onClick={() => onPageChange('quiz')}
				>
					Review answers
				</Button>
				<Button size="md" variant="green" onClick={() => onPageChange('quiz')}>
					Generate quiz
				</Button>
			</div>
			<div
				className="absolute -top-50 w-90 h-90 left-50 right-0 md:w-140
											md:h-140 md:-top-30 md:bottom-0 md:-right-80 md:left-auto lg:w-200 lg:h-200 opacity-80 "
			>
				<BlurryShape />
			</div>
			<div
				className="absolute -bottom-50 w-90 h-90 left-0 right-50 md:w-140
											md:h-140 md:top-30 md:bottom-0 md:-left-80 lg:w-200 lg:h-200 opacity-80 "
			>
				<BlurryShape />
			</div>
		</div>
	);
}
