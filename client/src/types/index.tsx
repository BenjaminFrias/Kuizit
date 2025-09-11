export type InputOption = 'prompt' | 'youtube_link' | 'file';
export type AnswerOptions = 'multiple_choice' | 'true_false';
export type Page = 'home' | 'input' | 'quiz' | 'result';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type NumberQuestions = 5 | 10 | 15 | 20;
export type QuizRequestBody = {
	quizInputType: string;
	content?: string | File | File[];
	numQuestions: number;
	difficulty: string;
	optionTypes: string | string[];
};

export interface onPageChangeType {
	onPageChange: (pageName: Page) => void;
}
