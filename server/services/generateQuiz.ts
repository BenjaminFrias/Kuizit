import { GoogleGenAI, Type } from '@google/genai';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
	console.error('GEMINI_API_KEY is not set in the .env file.');
	throw new Error();
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateQuiz(
	userContent: string,
	numQuestions: number,
	difficulty: string,
	optionTypes: string[]
) {
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
        `,

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

	const result = await ai.models.generateContent({
		model: 'gemini-2.5-flash',
		contents: userContent,
		config: configAI,
	});

	const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

	if (typeof responseText === 'string' && responseText.length > 0) {
		const quizData = JSON.parse(responseText);
		return quizData;
	} else {
		console.log('AI response was not valid: ', responseText);
		throw new Error('AI did not return valid quiz data.');
	}
}
