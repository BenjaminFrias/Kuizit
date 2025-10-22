import type { QuizSettings } from '@/types';

type ValidationMessages = {
	fileNotFoundErr: string;
	fileTypeErr: string;
	invalidPromptErr: string;
	invalidYoutubeLinkErr: string;
};

type validateQuizParams = {
	quizData: QuizSettings;
	validationMessages: ValidationMessages;
};

export default function validateQuizContent({
	quizData,
	validationMessages,
}: validateQuizParams) {
	const inputType = quizData.quizInputType;
	const quizContent = quizData.content;

	if (inputType === 'file') {
		if (!quizContent) {
			throw new Error(validationMessages.fileNotFoundErr);
		}

		if (quizContent instanceof File && !validateFileType(quizContent)) {
			throw new Error(validationMessages.fileTypeErr);
		}
	}

	if (!quizContent) {
		throw new Error(validationMessages.invalidPromptErr);
	}

	if (
		typeof quizContent === 'string' &&
		(inputType === 'prompt' || inputType === 'youtube_link')
	) {
		if (!quizContent || quizContent.trim() === '') {
			throw new Error(validationMessages.invalidPromptErr);
		}

		if (inputType === 'youtube_link') {
			if (!isYoutubeLink(quizContent)) {
				throw new Error(validationMessages.invalidYoutubeLinkErr);
			}
		}
	}
}

function isYoutubeLink(link: string) {
	const youtubeRegex =
		/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|shorts\/)?([a-zA-Z0-9_-]{11})(&.*)?$/;

	return youtubeRegex.test(link);
}

function validateFileType(file: File): boolean {
	const allowedMimeTypes = [
		'application/pdf',
		'text/plain',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'text/markdown',
	];

	return allowedMimeTypes.includes(file.type);
}
