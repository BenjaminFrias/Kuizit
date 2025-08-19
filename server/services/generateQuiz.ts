import {
	GoogleGenAI,
	HarmBlockThreshold,
	HarmCategory,
	Type,
} from '@google/genai';

const API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateQuiz(
	quizInputType: string,
	userContent: string,
	numQuestions: number,
	difficulty: string,
	optionTypes: string[]
) {
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
		const result = await ai.models.generateContent({
			model: 'gemini-2.5-flash',
			contents: userContent,
			config: configAI,
		});

		const responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

		if (typeof responseText !== 'string' || responseText.length === 0) {
			throw new Error('AI returned no text content.');
		}

		const quizData = JSON.parse(responseText);

		if (Array.isArray(quizData) && quizData.length > 0) {
			return quizData;
		} else {
			throw new Error('Parsed data is empty due to invalid content.');
		}
	} catch (error: any) {
		console.error('Failed to generate quiz: ', error);
		throw new Error('Could not generate quiz. Please try again.');
	}
}
