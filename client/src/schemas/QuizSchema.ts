import { z } from 'zod';
import { type Translations } from '@/types/translations';
import { isYoutubeLink, validateFileType } from '@/utils/utilities';

const InputOptionSchema = z.enum(['prompt', 'youtube_link', 'file']);
const AnswerOptionsSchema = z.enum(['multiple_choice', 'true_false']);
const DifficultySchema = z.enum(['easy', 'medium', 'hard', 'expert']);
const NumberQuestionsSchema = z.union([
	z.literal(5),
	z.literal(10),
	z.literal(15),
	z.literal(20),
]);

const BaseQuizSettingsSchema = z.object({
	quizInputType: InputOptionSchema,
	content: z.union([z.string(), z.instanceof(File), z.undefined()]),
	numQuestions: NumberQuestionsSchema,
	difficulty: DifficultySchema,
	optionTypes: AnswerOptionsSchema,
});

export type QuizSettings = z.infer<typeof BaseQuizSettingsSchema>;

export const createSubmissionSettingsSchema = (translation: Translations) => {
	const SubmissionQuizSchema = BaseQuizSettingsSchema.superRefine(
		(data, ctx) => {
			// if content is undefined, add error depending on input type
			if (data.content === undefined) {
				let errorMsg = translation.invalidPromptErr;

				if (data.quizInputType === 'file') {
					errorMsg = translation.fileNotFoundErr;
				}

				ctx.addIssue({
					code: 'custom',
					message: errorMsg,
					path: ['content'],
					fatal: true,
				});
			}

			if (typeof data.content === 'string') {
				if (data.content.trim().length < 1) {
					ctx.addIssue({
						code: 'custom',
						message: translation.invalidPromptErr,
						path: ['content'],
						fatal: true,
					});
				}
			}

			if (
				data.quizInputType === 'youtube_link' &&
				typeof data.content === 'string'
			) {
				if (!isYoutubeLink(data.content)) {
					ctx.addIssue({
						code: 'custom',
						message: translation.invalidYoutubeLinkErr,
						path: ['content'],
						fatal: true,
					});
				}
			}

			if (data.quizInputType === 'file' && data.content instanceof File) {
				if (!validateFileType(data.content)) {
					ctx.addIssue({
						code: 'custom',
						message: translation.fileTypeErr,
						path: ['content'],
						fatal: true,
					});
				}
			}
		}
	);
	return SubmissionQuizSchema;
};

type QuizSettingsSubmittionSchemaType = ReturnType<
	typeof createSubmissionSettingsSchema
>;
export type QuizSubmittionType = z.infer<QuizSettingsSubmittionSchemaType>;
