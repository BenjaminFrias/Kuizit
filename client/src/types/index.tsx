export type Page = 'home' | 'input' | 'quiz' | 'results' | 'review';

type InputOption = 'prompt' | 'youtube_link' | 'file';
type AnswerOptions = 'multiple_choice' | 'true_false';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
type NumberQuestions = 5 | 10 | 15 | 20;
export type QuizSettings = {
	quizInputType: InputOption;
	content?: string | File | File[] | undefined;
	numQuestions: NumberQuestions;
	difficulty: Difficulty;
	optionTypes: AnswerOptions;
};

export type InputPageParams = {
	setApiError: (error: string | null) => void;
	onQuizSubmit: (QuizSettings: QuizSettings) => void;
	initialSettings: QuizSettings;
	apiError: string | null;
};

export type QuizPageParams = {
	onPageChange: (pageName: Page) => void;
	quizData: QuizData;
	quizResultData: QuizResult;
	onAnswerSubmittion: (newQuizResult: QuizResult) => void;
};

export type QuizResultsPageParams = {
	quizResults: QuizResult;
	onPageChange: (page: Page) => void;
};

export type QuizReviewPageParams = {
	quizData: QuizData;
	quizResults: QuizResult;
	onPageChange: (page: Page) => void;
};

type QuizResultOption = {
	optionText: string;
	answer: boolean;
};

type QuizResultQuestion = {
	type: string;
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
