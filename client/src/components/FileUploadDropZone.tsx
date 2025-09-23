'use client';

import { CloudUpload, X } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
	FileUpload,
	FileUploadDropzone,
	FileUploadItem,
	FileUploadItemDelete,
	FileUploadItemMetadata,
	FileUploadItemPreview,
	FileUploadItemProgress,
	FileUploadList,
	type FileUploadProps,
	FileUploadTrigger,
} from '@/components/ui/file-upload';

type FileUploadType = {
	files: File[];
	setFiles: (files: File[]) => void;
};

export function FileUploadDropZone({ files, setFiles }: FileUploadType) {
	// const [files, setFiles] = React.useState<File[]>([]);

	const onUpload: NonNullable<FileUploadProps['onUpload']> = React.useCallback(
		async (files, { onProgress, onSuccess, onError }) => {
			try {
				// Process each file individually
				const uploadPromises = files.map(async (file) => {
					try {
						// Simulate file upload with progress
						const totalChunks = 10;
						let uploadedChunks = 0;

						// Simulate chunk upload with delays
						for (let i = 0; i < totalChunks; i++) {
							// Simulate network delay (100-300ms per chunk)
							await new Promise((resolve) =>
								setTimeout(resolve, Math.random() * 200 + 100)
							);

							// Update progress for this specific file
							uploadedChunks++;
							const progress = (uploadedChunks / totalChunks) * 100;
							onProgress(file, progress);
						}

						// Simulate server processing delay
						await new Promise((resolve) => setTimeout(resolve, 500));
						onSuccess(file);
					} catch (error) {
						onError(
							file,
							error instanceof Error ? error : new Error('Upload failed')
						);
					}
				});

				// Wait for all uploads to complete
				await Promise.all(uploadPromises);
			} catch (error) {
				// This handles any error that might occur outside the individual upload processes
				console.error('Unexpected error during upload:', error);
			}
		},
		[]
	);

	return (
		<FileUpload
			value={files}
			onValueChange={setFiles}
			onUpload={onUpload}
			maxFiles={1}
			className="w-full"
			multiple={false}
		>
			{files.length > 0 ? (
				<FileUploadList>
					{files.map((file, index) => (
						<FileUploadItem key={index} value={file} className="flex-col">
							<div className="flex w-full items-center gap-2">
								<FileUploadItemPreview />
								<FileUploadItemMetadata />
								<FileUploadItemDelete asChild>
									<Button variant="ghost" size="icon" className="size-5">
										<X />
									</Button>
								</FileUploadItemDelete>
							</div>
							<FileUploadItemProgress />
						</FileUploadItem>
					))}
				</FileUploadList>
			) : (
				<FileUploadDropzone className="flex-row flex-wrap border-dotted border-2 text-custom-gray border-custom-light-gray text-center">
					<CloudUpload className="size-4" />
					Drag and drop or
					<FileUploadTrigger asChild>
						<Button variant="link" size="sm" className="p-0">
							choose files
						</Button>
					</FileUploadTrigger>
					to upload
				</FileUploadDropzone>
			)}
		</FileUpload>
	);
}
