import { Request, Response, NextFunction } from 'express';
import type {
	FileRequest,
	QuizRequestBody,
	ValidatedQuizData,
} from '../types/quiz';

declare module 'express-serve-static-core' {
	interface Request {
		validatedQuizData?: ValidatedQuizData;
	}
}

function validateQuizRequest(req: Request, res: Response, next: NextFunction) {
	const { quizInputType, numQuestions, difficulty, optionTypes } =
		req.body as QuizRequestBody;

	if (
		!quizInputType ||
		quizInputType.trim() === '' ||
		!numQuestions ||
		!difficulty ||
		difficulty.trim() === '' ||
		!optionTypes
	) {
		return res.status(400).json({ error: 'Missing required field.' });
	}

	// Validate Quiz input type
	const validQuizInputTypes = ['prompt', 'file'];
	if (!validQuizInputTypes.includes(quizInputType)) {
		return res.status(400).json({ error: 'Invalid input type.' });
	}

	let quizContent;
	if (quizInputType === 'prompt') {
		if (!req.body.content || req.body.content.trim() === '') {
			return res.status(400).json({ error: 'Please write your quiz prompt.' });
		}

		quizContent = req.body.content;
	} else if (quizInputType === 'file') {
		const fileReq = req as FileRequest;
		if (!fileReq.file) {
			return res.status(400).json({ error: 'No file uploaded.' });
		}

		const allowedMimeTypes = [
			'application/pdf',
			'text/plain',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'text/markdown',
		];
		if (!allowedMimeTypes.includes(fileReq.file.mimetype)) {
			return res.status(400).json({
				error: 'Invalid file type. Please upload a PDF or a text file.',
			});
		}

		quizContent = fileReq.file;
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

	const validQuizData: ValidatedQuizData = {
		quizInputType: quizInputType,
		quizContent: quizContent,
		numQuestions: parsedNumQuestions,
		difficulty: difficulty,
		optionTypes: selectedOptionTypes,
	};

	req.validatedQuizData = validQuizData;

	next();
}

export default validateQuizRequest;
