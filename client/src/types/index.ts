import type { QuizSettings } from '@/schemas/QuizSchema';

export type Page = 'home' | 'input' | 'quiz' | 'results' | 'review';

export type InputPageParams = {
	setApiError: (error: string | null) => void;
	onQuizSubmit: (QuizSettings: QuizSettings) => void;
	initialSettings: QuizSettings;
	apiError: string | null;
	resetQuizStates: () => void;
};

export type QuizPageParams = {
	quizData: QuizData;
	onQuizSubmittion: (newQuizResult: QuizResult) => void;
};

export type QuizResultsPageParams = {
	quizResults: QuizResult;
};

export type QuizReviewPageParams = {
	quizData: QuizData;
	quizResults: QuizResult;
};

export type QuizResultOption = {
	optionText: string;
	answer: boolean;
};

export type QuizResultQuestion = {
	type: 'multiple_choice' | 'true_false';
	question: string;
	correctAnswerIndex: number;
	options: QuizResultOption[];
	explanation: string;
};

export type QuizData = QuizResultQuestion[];

type QuizAnswer = {
	isCorrect: boolean;
	selectedIndex: number;
};

export type QuizResult = QuizAnswer[];

export interface onPageChangeType {
	onPageChange: (pageName: Page) => void;
}
