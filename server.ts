import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
	console.error('GEMINI_API_KEY is not set in the .env file.');
	process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function main() {
	const response = await ai.models.generateContent({
		model: 'gemini-2.5-flash',
		contents:
			'Explain how to become a senior dev from scratch, in basic and short words.',
	});
	return response;
}

app.get('/', async (req, res) => {
	const aiPromise = main();
	console.log('GETTING DATA...');

	aiPromise
		.then((response) => {
			console.log('DATA RETRIEVED SUCCESSFULLY');
			res.send(response.text);
		})
		.catch((error) => {
			console.log('DATA RETRIEVED FAILED: ', error);
			res.send('error');
		});
});

app.listen(PORT, () => {
	console.log('Server listening on port: ', PORT);
});
