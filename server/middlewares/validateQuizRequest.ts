import { Request, Response, NextFunction } from 'express';

type QuizRequestBody = {
	content: string;
	numQuestions: string;
	difficulty: string;
	optionTypes: string | string[];
};

type ValidatedQuizData = {
	content: string;
	numQuestions: number;
	difficulty: string;
	optionTypes: string[];
};

declare module 'express-serve-static-core' {
	interface Request {
		validatedQuizData?: ValidatedQuizData;
	}
}

function validateQuizRequest(req: Request, res: Response, next: NextFunction) {
	const { content, numQuestions, difficulty, optionTypes } =
		req.body as QuizRequestBody;

	if (!content || !numQuestions || !difficulty || !optionTypes) {
		return res.status(400).json({ error: 'Missing required field.' });
	}

	const parsedNumQuestions = parseInt(numQuestions);
	if (isNaN(parsedNumQuestions) || parsedNumQuestions < 3) {
		return res.status(400).json({ error: 'Invalid number of questions.' });
	}

	const validDifficulties = ['easy', 'medium', 'hard', 'expert'];
	if (!validDifficulties.includes(difficulty.toLowerCase())) {
		return res.status(400).json({ error: 'Invalid difficulty level.' });
	}

	const validOptionTypes = ['multiple_choice', 'true_false'];
	const selectedOptionTypes = Array.isArray(optionTypes)
		? optionTypes
		: [optionTypes];

	const hasInvalidOptions = selectedOptionTypes.some(
		(option: string) => !validOptionTypes.includes(option)
	);

	if (hasInvalidOptions) {
		return res.status(400).json({ error: 'Invalid option types selected.' });
	}

	req.validatedQuizData = {
		content: content,
		numQuestions: parsedNumQuestions,
		difficulty: difficulty,
		optionTypes: selectedOptionTypes,
	};

	next();
}

export default validateQuizRequest;
