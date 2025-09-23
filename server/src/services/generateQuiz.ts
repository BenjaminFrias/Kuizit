import {
	GoogleGenAI,
	HarmBlockThreshold,
	HarmCategory,
	Type,
	Part,
	FinishReason,
} from '@google/genai';
import { ValidatedQuizData } from '../types/quiz';

const API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateQuiz({
	quizInputType,
	quizContent,
	numQuestions,
	difficulty,
	optionTypes,
}: ValidatedQuizData) {
	const safetySettings = [
		{
			category: HarmCategory.HARM_CATEGORY_HARASSMENT,
			threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
		},
		{
			category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
			threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
		},
		{
			category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
			threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
		},
		{
			category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
			threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
		},
	];

	const configAI = {
		systemInstruction: `
        You are an expert quiz question generator. Your task is to create quiz questions based on provided content.
		Create the quiz based on the language from the provided content. So, if the content is in spanish for example,
		create the questions and options in spanish.
        Adhere strictly to the following rules:
        - Generate exactly ${numQuestions} questions.
        - The difficulty level for all questions must be ${difficulty}.
        - Questions should be concise, ideally under 20 words.
        - Options should be brief and clear.
        - Randomly mix question types from the provided array:${optionTypes}.
        - For 'multiple_choice' questions:
            - Provide exactly 4 options.
            - Ensure only ONE option has 'answer: true'. The other three must be plausible distractors with 'answer: false'.
        - For 'true_false' questions:
            - Provide exactly 2 options: one for 'True' and one for 'False'.
            - Ensure only ONE option has 'answer: true'.
        - The response MUST strictly follow the provided JSON schema.
        - You should provide a longer explanation of the answer, ideally between 20 and 50 words.
		- If the content does not met the safety settings return an empty array
        `,
		safetySettings: safetySettings,
		responseMimeType: 'application/json',
		responseSchema: {
			type: Type.ARRAY,
			items: {
				type: Type.OBJECT,
				properties: {
					type: {
						type: Type.STRING,
						enum: optionTypes,
					},
					question: {
						type: Type.STRING,
					},
					correctAnswerIndex: {
						type: Type.NUMBER,
					},
					options: {
						type: Type.ARRAY,
						items: {
							type: Type.OBJECT,
							properties: {
								optionText: {
									type: Type.STRING,
								},
								answer: {
									type: Type.BOOLEAN,
								},
							},
						},
					},
					explanation: {
						type: Type.STRING,
					},
				},
				propertyOrdering: [
					'type',
					'correctAnswerIndex',
					'question',
					'options',
					'explanation',
				],
			},
		},
	};

	try {
		const parts: Part[] = [];

		// Quiz content can be either the quiz prompt, youtube link or file

		// Push correct content type to parts depending on quiz type
		if (typeof quizContent === 'string') {
			switch (quizInputType) {
				case 'prompt':
					parts.push({
						text: quizContent,
					});
					break;
				case 'youtube_link':
					parts.push({
						fileData: {
							fileUri: quizContent as string,
						},
					});
					break;
			}
		} else if (quizInputType === 'file') {
			const filePart = await getContentFromFile(
				quizContent as Express.Multer.File
			);
			if (filePart) {
				parts.push(filePart as Part);
			}
		}

		const response = await ai.models.generateContent({
			model: 'gemini-2.5-flash',
			contents: [{ role: 'user', parts: parts }],
			config: configAI,
		});

		if (response.promptFeedback?.blockReason) {
			throw new Error(
				`Content generation failed: Prompt blocked (reason: ${response.promptFeedback.blockReason})`
			);
		}

		// Check for response blockage
		if (!response.candidates || response.candidates.length === 0) {
			throw new Error('Content generation failed: No candidates returned.');
		}

		const firstCandidate = response.candidates[0];

		// Check for finish reasons other than STOP
		if (
			firstCandidate.finishReason &&
			firstCandidate.finishReason !== FinishReason.STOP
		) {
			if (firstCandidate.finishReason === FinishReason.SAFETY) {
				throw new Error(
					'Content generation failed: Response blocked due to safety settings.'
				);
			} else {
				throw new Error(
					`Content generation failed: Stopped due to ${firstCandidate.finishReason}.`
				);
			}
		}

		const responseText = response?.candidates?.[0]?.content?.parts?.[0]?.text;

		if (typeof responseText !== 'string' || responseText.length === 0) {
			throw new Error('AI returned no text content.');
		}

		const quizData = JSON.parse(responseText);

		if (Array.isArray(quizData) && quizData.length > 0) {
			return quizData;
		} else {
			throw new Error('Parsed data is empty due to invalid content.');
		}
	} catch (error) {
		console.error('Failed to generate quiz: ', error);
		throw error;
	}
}

async function getContentFromFile(file: Express.Multer.File) {
	const { buffer, mimetype } = file;

	try {
		const arrayBuffer = new Uint8Array(buffer).buffer;
		const fileBlob = new Blob([arrayBuffer], { type: mimetype });

		// Pass the Blob object to the upload method
		const uploadedFile = await ai.files.upload({
			file: fileBlob,
		});

		return {
			fileData: {
				fileUri: uploadedFile.uri,
				mimeType: uploadedFile.mimeType,
			},
		};
	} catch (error) {
		console.error('Error processing file with Gemini:', error);
		throw error;
	}
}
