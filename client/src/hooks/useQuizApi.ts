import type { QuizSettings } from '@/schemas/QuizSchema';
import type { QuizData } from '@/types';
import { useState } from 'react';

async function fetchGeneratedQuiz(
	quizData: QuizSettings,
	API_BASE_URL: string
): Promise<QuizData> {
	let response;

	if (quizData.quizInputType === 'file') {
		const formData = new FormData();
		formData.append('quizInputType', quizData.quizInputType);
		formData.append('numQuestions', quizData.numQuestions.toString());
		formData.append('difficulty', quizData.difficulty);
		formData.append('optionTypes', quizData.optionTypes);
		formData.append('quizFile', quizData.content as File);

		response = await fetch(`${API_BASE_URL}/api/generate-quiz`, {
			method: 'POST',
			body: formData,
		});
	} else {
		response = await fetch(`${API_BASE_URL}/api/generate-quiz`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify(quizData),
		});
	}

	if (response.ok) {
		const result: QuizData = await response.json();
		return result;
	} else {
		const result = await response
			.json()
			.catch(async () => ({ message: response.text() }));

		throw new Error(result.error || result.message || 'Unknown error');
	}
}

const API_BASE_URL: string =
	import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const useQuizApi = () => {
	const [apiError, setApiError] = useState<string | null>(null);

	const generateQuiz = async (
		quizSettings: QuizSettings
	): Promise<QuizData> => {
		setApiError(null);

		try {
			const generatedQuizData = await fetchGeneratedQuiz(
				quizSettings,
				API_BASE_URL
			);
			return generatedQuizData;
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error('Error in API hook: ', error.message);
			} else {
				console.log('An unexpected error occurred in API hook: ', error);
			}
			throw error;
		}
	};

	return { apiError, setApiError, generateQuiz };
};
