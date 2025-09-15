export type InputOption = 'prompt' | 'youtube_link' | 'file';
export type AnswerOptions = 'multiple_choice' | 'true_false';
export type Page = 'home' | 'input' | 'quiz' | 'result';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type NumberQuestions = 5 | 10 | 15 | 20;
export type QuizRequestBody = {
	quizInputType: InputOption;
	content?: string | File | File[];
	numQuestions: NumberQuestions;
	difficulty: Difficulty;
	optionTypes: AnswerOptions;
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
