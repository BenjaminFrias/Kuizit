import type { QuizRequestBody } from '@/types';

type ValidationMessages = {
	fileNotFoundErr: string;
	fileTypeErr: string;
	invalidPromptErr: string;
	invalidYoutubeLinkErr: string;
};

type validateQuizParams = {
	quizData: QuizRequestBody;
	quizFile: File | File[];
	validationMessages: ValidationMessages;
};

export default function validateQuizContent({
	quizData,
	quizFile,
	validationMessages,
}: validateQuizParams) {
	const inputType = quizData.quizInputType;
	const quizContent = quizData.content;

	if (inputType === 'file') {
		if (!quizFile) {
			throw new Error(validationMessages.fileNotFoundErr);
		}

		if (Array.isArray(quizFile)) {
			if (quizFile.length === 0) {
				throw new Error(validationMessages.fileNotFoundErr);
			}

			if (!validateFileType(quizFile[0])) {
				throw new Error(validationMessages.fileTypeErr);
			}
		}
	}

	if (typeof quizContent === 'string') {
		if (!quizContent || quizContent.trim() === '') {
			throw new Error(validationMessages.invalidPromptErr);
		}

		if (inputType === 'youtube_link') {
			if (!isYoutubeLink(inputType)) {
				throw new Error(validationMessages.invalidYoutubeLinkErr);
			}
		}
	}
}

function isYoutubeLink(link: string) {
	const regex =
		/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})(&.*)?$/;

	return regex.test(link);
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
