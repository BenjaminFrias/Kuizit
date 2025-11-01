export function isYoutubeLink(link: string): boolean {
	const youtubeRegex =
		/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|shorts\/)?([a-zA-Z0-9_-]{11})(&.*)?$/;

	return youtubeRegex.test(link);
}

export function validateFileType(file: File): boolean {
	const allowedMimeTypes = [
		'application/pdf',
		'text/plain',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'text/markdown',
	];

	return allowedMimeTypes.includes(file.type);
}
