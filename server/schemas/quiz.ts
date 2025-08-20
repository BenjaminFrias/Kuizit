import { z } from 'zod';

export const QuizOptionSchema = z.object({
	optionText: z.string(),
	answer: z.boolean(),
});

export const QuizQuestionSchema = z.object({
	type: z.string(),
	question: z.string(),
	correctAnswerIndex: z.number(),
	options: z.array(QuizOptionSchema),
	explanation: z.string(),
});

export const QuizResultSchema = z.array(QuizQuestionSchema);

export type QuizResult = z.infer<typeof QuizResultSchema>;
