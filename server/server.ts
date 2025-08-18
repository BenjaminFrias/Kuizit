import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { generateQuiz } from './services/generateQuiz';
import validateQuizRequest from './middlewares/validateQuizRequest';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/generate-quiz', validateQuizRequest, async (req, res) => {
	if (!req.validatedQuizData) {
		return res
			.status(500)
			.json({ error: 'Internal server error: Validated data not found.' });
	}

	const { content, numQuestions, difficulty, optionTypes } =
		req.validatedQuizData;

	try {
		const quizResult = await generateQuiz(
			content,
			numQuestions,
			difficulty,
			optionTypes
		);

		res.status(200).json(quizResult);
	} catch (error: any) {
		console.error('Quiz generation failed: ', error);
		res.status(500).json({ error: 'Internal server error.' });
	}
});

app.listen(PORT, () => {
	console.log('Server listening on port: ', PORT);
});
