export interface onPageChangeType {
	onPageChange: (pageName: pageOptionsType) => void;
}

export type answerOptionsType = 'multiple_choice' | 'true_false';
export type pageOptionsType = 'home' | 'input' | 'quiz' | 'result';
export type numberQuestionsType = 5 | 10 | 15 | 20;
