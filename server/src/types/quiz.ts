import { Request } from 'express';

export interface FileRequest extends Request {
	file: Express.Multer.File;
}

export type QuizRequestBody = {
	quizInputType: string;
	content?: string;
	numQuestions: string;
	difficulty: string;
	optionTypes: string | string[];
};

export type ValidatedQuizData = {
	quizInputType: string;
	quizContent: string | Express.Multer.File;
	numQuestions: number;
	difficulty: string;
	optionTypes: string[];
};
