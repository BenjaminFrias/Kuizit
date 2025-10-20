import BlurryShape from '@/components/decorative/BlurryShape';
import { useTranslation } from '@/hooks/useTranslation';
import type { QuizResultQuestion } from '@/types';

type QuizLayoutProps = {
	currentQuestion: QuizResultQuestion;
	questionNumber: number;
	totalQuestions: number;
	answerOptions: React.ReactNode;
	navigationButtons: React.ReactNode;
	isExiting: boolean;
	onTransitionEnd: () => void;
};

export function QuizLayout({
	currentQuestion,
	questionNumber,
	totalQuestions,
	answerOptions,
	navigationButtons,
	isExiting,
	onTransitionEnd,
}: QuizLayoutProps) {
	const t = useTranslation();

	return (
		<div
			className="min-h-screen min-w-screen flex flex-col w-full items-center md:flex-row md:items-stretch overflow-x-hidden"
			data-testid="review-page"
		>
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
						${isExiting ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}
                    `}
					onTransitionEnd={onTransitionEnd}
					aria-label="question-title"
				>
					{t.question} {questionNumber}
				</p>
				<h1
					className={`font-primary text-custom-white text-shadow-title/30  font-medium text-center text-3xl  w-full z-1 
						md:self-start md:text-start md:text-5xl transition-all duration-300
						${isExiting ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}
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
					{answerOptions}
				</div>
				<div className="flex gap-2">{navigationButtons}</div>
			</div>
		</div>
	);
}
