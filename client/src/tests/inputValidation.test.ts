import validateQuizContent from '@/validation/inputValidation';
import { describe, expect, it } from 'vitest';
import t from '@/translations/en.json';
import type { QuizSettings } from '@/types';

const validationMessages = {
	fileNotFoundErr: t.fileNotFoundErr,
	fileTypeErr: t.fileTypeErr,
	invalidPromptErr: t.invalidPromptErr,
	invalidYoutubeLinkErr: t.invalidYoutubeLinkErr,
};

const base: QuizSettings = {
	quizInputType: 'prompt',
	content: undefined,
	numQuestions: 10,
	difficulty: 'easy',
	optionTypes: 'multiple_choice',
};

const correctFile = new File(['mock content'], 'quizFile.pdf', {
	type: 'application/pdf',
});

const badFile = new File(['mock content'], 'quizFile.png', {
	type: 'image/png',
});

describe('validateQuizContent', () => {
	it('throws fileNotFoundErr when file not passed', () => {
		expect(() => {
			validateQuizContent({
				quizData: { ...base, quizInputType: 'file' },
				validationMessages: validationMessages,
			});
		}).toThrow(validationMessages.fileNotFoundErr);
	});

	it('throws fileTypeErr when passing invalid file', () => {
		expect(() => {
			validateQuizContent({
				quizData: { ...base, quizInputType: 'file', content: badFile },
				validationMessages: validationMessages,
			});
		}).toThrow(validationMessages.fileTypeErr);
	});

	it('throws invalidPromptErr when content is empty', () => {
		expect(() => {
			validateQuizContent({
				quizData: { ...base, quizInputType: 'prompt', content: '' },
				validationMessages: validationMessages,
			});
		}).toThrow(validationMessages.invalidPromptErr);
	});

	it('throws invalidYoutubeLinkErr when invalid youtube link', () => {
		expect(() => {
			validateQuizContent({
				quizData: {
					...base,
					quizInputType: 'youtube_link',
					content: 'https://wikipedia.org/wiki/Main_Page',
				},
				validationMessages: validationMessages,
			});
		}).toThrow(validationMessages.invalidYoutubeLinkErr);
	});

	it('returns undefined when passing correct file', () => {
		expect(() => {
			validateQuizContent({
				quizData: { ...base, quizInputType: 'file', content: correctFile },
				validationMessages: validationMessages,
			});
		}).not.toThrow();
	});

	it('returns undefined when content(prompt) is correct', () => {
		expect(() => {
			validateQuizContent({
				quizData: {
					...base,
					quizInputType: 'prompt',
					content: 'Create a quiz about history',
				},
				validationMessages: validationMessages,
			});
		}).not.toThrow();
	});

	it('returns undefined when valid youtube link is passed', () => {
		expect(() => {
			validateQuizContent({
				quizData: {
					...base,
					quizInputType: 'youtube_link',
					content: 'https://www.youtube.com/watch?v=zMyVN0MUjAw',
				},
				validationMessages: validationMessages,
			});
		}).not.toThrow(validationMessages.invalidYoutubeLinkErr);
	});
});
