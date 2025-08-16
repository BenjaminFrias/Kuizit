import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { generateQuiz } from './services/generateQuiz';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
	const content = 'Create a quiz about typescript';
	const numQuestions = 3;
	const difficulty = 'Easy/Beginner';
	const optionTypes = ['multiple_choices'];

	try {
		const quiz = await generateQuiz(
			content,
			numQuestions,
			difficulty,
			optionTypes
		);
		res.status(200).send(quiz);
	} catch (error: any) {
		console.error('Quiz generation failed: ', error);
		res.status(400).json({ error: error.message });
	}
});

app.listen(PORT, () => {
	console.log('Server listening on port: ', PORT);
});
