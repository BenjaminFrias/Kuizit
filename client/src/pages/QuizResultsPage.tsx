import type { QuizResultsPageParams } from '@/types';
import BlurryShape from '@/components/decorative/BlurryShape';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '@/hooks/useTranslation';

export function QuizResultsPage({
	quizResults,
	onPageChange,
}: QuizResultsPageParams) {
	const [isAnimating, setIsAnimating] = useState(true);
	const t = useTranslation();

	const replacePlaceholders = (
		text: string,
		values: { [key: string]: string | number }
	) => {
		let result = text;
		for (const key in values) {
			result = result.replace(
				new RegExp(`\\{${key}\\}`, 'g'),
				String(values[key])
			);
		}
		return result;
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsAnimating(false);
		}, 300);

		return clearInterval(timer);
	}, []);

	const totalQuestions = quizResults.length;
	const score = quizResults.filter((answer) => answer.isCorrect).length;
	const percentageScore = Math.floor((score / totalQuestions) * 100);

	const scoreText = replacePlaceholders(t.quizScoreText, {
		correctCount: score,
		totalCount: totalQuestions,
	});

	return (
		<div
			className="relative min-h-screen min-w-screen max-h-screen flex flex-col w-full justify-between items-center bg-custom-gray px-8 py-8 overflow-hidden"
			data-testid="results-page"
		>
			<h2 className="text-custom-white text-3xl font-medium z-1 shortFadeIn">
				{t.quizResultsTitle}
			</h2>
			<div className="relative flex flex-col w-full gap-2 justify-center ">
				<div className="text-custom-white text-center">
					<FontAwesomeIcon icon={faCrown} size="2x" data-testid="crown-icon" />
				</div>
				<p
					className={`text-custom-white text-2xl text-center font-semibold z-1 transition-all duration-300 mb-5
									${isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}
									`}
				>
					{t.congratulations}
				</p>
				<p
					className={`text-custom-white text-center font-medium z-1 transition-all duration-300
							${isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}
							`}
				>
					{t.yourScoreIs}...
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
					{scoreText}
				</p>
			</div>
			<div className="flex flex-col md:flex-row gap-3 z-1 mb-10 shortFadeIn">
				<Button
					size="md"
					variant="secondary"
					onClick={() => onPageChange('review')}
				>
					{t.reviewAnswers}
				</Button>
				<Button size="md" variant="green" onClick={() => onPageChange('input')}>
					{t.generateQuizBtn}
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
