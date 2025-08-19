import { Request, Response, NextFunction } from 'express';

type QuizRequestBody = {
	quizInputType: string;
	content: string;
	numQuestions: string;
	difficulty: string;
	optionTypes: string | string[];
};

type ValidatedQuizData = {
	quizInputType: string;
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

interface FileRequest extends Request {
	file: Express.Multer.File;
}

function validateQuizRequest(req: Request, res: Response, next: NextFunction) {
	const { quizInputType, content, numQuestions, difficulty, optionTypes } =
		req.body as QuizRequestBody;

	if (
		!quizInputType ||
		!content ||
		!numQuestions ||
		!difficulty ||
		!optionTypes
	) {
		return res.status(400).json({ error: 'Missing required field.' });
	}

	// Validate Quiz input type
	const validQuizInputTypes = ['prompt', 'file'];
	if (!validQuizInputTypes.includes(quizInputType)) {
		return res.status(400).json({ error: 'Invalid input type.' });
	}

	if (quizInputType === 'file') {
		const fileReq = req as FileRequest;
		if (!fileReq.file) {
			return res.status(400).json({ error: 'No file uploaded.' });
		}
	}

	// Validate number of questions
	const parsedNumQuestions = parseInt(numQuestions);
	if (isNaN(parsedNumQuestions) || parsedNumQuestions < 3) {
		return res.status(400).json({ error: 'Invalid number of questions.' });
	}

	// Validate difficulty option
	const validDifficulties = ['easy', 'medium', 'hard', 'expert'];
	if (!validDifficulties.includes(difficulty.toLowerCase())) {
		return res.status(400).json({ error: 'Invalid difficulty level.' });
	}

	// Validate answer option types
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
		quizInputType: quizInputType,
		content: content,
		numQuestions: parsedNumQuestions,
		difficulty: difficulty,
		optionTypes: selectedOptionTypes,
	};

	next();
}

export default validateQuizRequest;
