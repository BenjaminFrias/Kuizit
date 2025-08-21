import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer, { memoryStorage } from 'multer';
dotenv.config();
import { generateQuiz } from './services/generateQuiz';
import validateQuizRequest from './middlewares/validateQuizRequest';
import { ValidatedQuizData } from './types/quiz';
import { QuizResultSchema } from './schemas/quiz';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const upload = multer({ storage: memoryStorage() });

app.post(
	'/api/generate-quiz',
	upload.single('quizFile'),
	validateQuizRequest,
	async (req: Request, res: Response) => {
		if (!req.validatedQuizData) {
			return res
				.status(500)
				.json({ error: 'Internal server error: Quiz data is invalid.' });
		}

		const {
			quizInputType,
			quizContent,
			numQuestions,
			difficulty,
			optionTypes,
		}: ValidatedQuizData = req.validatedQuizData;

		try {
			const quizResult = await generateQuiz(
				quizInputType,
				quizContent,
				numQuestions,
				difficulty,
				optionTypes
			);

			const validatedQuizData = QuizResultSchema.parse(quizResult);

			res.status(200).json(validatedQuizData);
		} catch (error: any) {
			console.error('Quiz generation failed: ', error);
			res.status(500).json({ error: 'Internal server error.' });
		}
	}
);

app.listen(PORT, () => {
	console.log('Server listening on port: ', PORT);
});
