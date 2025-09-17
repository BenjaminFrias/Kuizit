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

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3001';

app.use(cors({ origin: corsOrigin }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const upload = multer({ storage: memoryStorage() });

app.post(
	'/api/generate-quiz',
	upload.single('quizFile'),
	validateQuizRequest,
	async (req: Request, res: Response) => {
		// Validate if quiz data from user is valid
		if (!req.validatedQuizData) {
			return res
				.status(500)
				.json({ error: 'Internal server error: Quiz data is invalid.' });
		}

		const quizData: ValidatedQuizData = req.validatedQuizData;

		try {
			const quizResult = await generateQuiz(quizData);

			// Validate quiz result data from generateQuiz
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
