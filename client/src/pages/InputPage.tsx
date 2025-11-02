import { FileUploadDropZone } from '@/components/FileUploadDropZone';
import Logo from '@/components/Logo';
import { OptionGroup } from '@/components/OptionGroup';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';
import {
	createSubmissionSettingsSchema,
	type QuizSettings,
} from '@/schemas/QuizSchema';
import type { InputPageParams } from '@/types';
import {
	faCircleExclamation,
	faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

export default function InputPage({
	setApiError,
	onQuizSubmit,
	initialSettings,
	apiError,
}: InputPageParams) {
	const t = useTranslation();
	const [localError, setLocalError] = useState<null | string>(apiError);
	const [files, setFiles] = useState<File[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [quizSettings, setQuizSettings] = useState<QuizSettings>({
		...initialSettings,
	});

	useEffect(() => {
		setQuizSettings({ ...initialSettings });
		setLocalError(apiError);
	}, [initialSettings, apiError]);

	const handleSettingsChange = <K extends keyof QuizSettings>(
		key: K,
		value: QuizSettings[K]
	) => {
		setQuizSettings((prevSettings: QuizSettings) => ({
			...prevSettings,
			[key]: value,
		}));
	};

	const handleLocalSubmit = () => {
		setLocalError(null);
		setIsSubmitting(true);

		let newSettings: QuizSettings = quizSettings;

		// Set content to be file when file uploaded
		if (quizSettings.quizInputType === 'file' && files && files.length > 0) {
			newSettings = { ...quizSettings, content: files[0] };
		}

		const QuizSubmissionSchema = createSubmissionSettingsSchema(t);
		const result = QuizSubmissionSchema.safeParse(newSettings);

		if (result.success) {
			onQuizSubmit(newSettings);
		} else {
			setLocalError(result.error.issues[0].message);
		}
		setIsSubmitting(false);
	};

	const resetAfterErrors = () => {
		setApiError(null);
		setLocalError(null);
		handleSettingsChange('content', undefined);
	};

	const { quizInputType, content, difficulty, optionTypes, numQuestions } =
		quizSettings;

	return (
		<div
			className="relative min-h-screen min-w-screen w-screen max-w-screen px-3 py-5 flex flex-col items-center
			justify-center gap-10 bg-custom-white"
			data-testid="input-page"
		>
			<div className="longFadeIn">
				<Logo width="50" height="50" color="#569d5b" />
			</div>

			<div className="flex flex-col max-w-[600px] w-full self-center md:w-400 md:max-h-screen justify-self-center items-center gap-5 longFadeIn">
				<h1 className="font-primary font-regular text-custom-gray text-center text-[2.8rem] mb-5">
					{t.titleInputPage}
				</h1>

				<form
					className="flex flex-col w-full gap-3"
					onSubmit={(e) => {
						e.preventDefault();
						handleLocalSubmit();
					}}
				>
					<fieldset>
						<legend className="sr-only">Quiz input types</legend>

						<OptionGroup
							value={quizInputType}
							options={[
								{ value: 'prompt', label: t.promptOption },
								{ value: 'file', label: t.fileOption },
								{ value: 'youtube_link', label: t.linkOption },
							]}
							size="md"
							onChange={(value) => {
								handleSettingsChange('quizInputType', value);
								resetAfterErrors();
							}}
						/>
					</fieldset>

					<fieldset>
						<legend className="sr-only">Content for quiz generation</legend>

						{/* If input is Prompt or link use textarea if not, use file upload input */}
						{quizInputType === 'prompt' || quizInputType === 'youtube_link' ? (
							<Textarea
								className="resize-none mt-3"
								placeholder={`${
									quizInputType === 'prompt'
										? t.quizPromptPlaceholder
										: t.quizLinkPlaceholder
								}`}
								value={typeof content === 'string' ? content : ''}
								onChange={(e) =>
									handleSettingsChange('content', e.target.value)
								}
							/>
						) : (
							<FileUploadDropZone files={files} setFiles={setFiles} />
						)}
						{localError || apiError ? (
							<div
								className="flex gap-3 items-center w-full bg-red-200 border-1
						font-medium border-red-500 rounded-2xl p-3 mt-3"
								data-testid="input-error"
								role="alert"
							>
								<FontAwesomeIcon
									icon={faCircleExclamation}
									className="text-red-500"
								/>
								<p>
									{localError || apiError}, {t.pleaseTryAgain}.
								</p>
							</div>
						) : null}
					</fieldset>

					<fieldset>
						<legend className="sr-only">Quiz details</legend>

						<div className="flex flex-col w-full justify-center gap-2">
							<div className=" w-full">
								<fieldset>
									<legend>{t.difficultyTitle}</legend>

									<OptionGroup
										value={difficulty}
										options={[
											{ value: 'easy', label: t.easyOption },
											{ value: 'medium', label: t.mediumOption },
											{ value: 'hard', label: t.hardOption },
											{ value: 'expert', label: t.expertOption },
										]}
										size="sm"
										onChange={(value) => {
											handleSettingsChange('difficulty', value);
										}}
									/>
								</fieldset>
							</div>
							<div className="w-full">
								<fieldset>
									<legend>{t.typeAnswersTitle}</legend>

									<OptionGroup
										value={optionTypes}
										options={[
											{
												value: 'multiple_choice',
												label: t.multipleChoiceOption,
											},
											{ value: 'true_false', label: t.trueFalseOption },
										]}
										size="sm"
										onChange={(value) => {
											handleSettingsChange('optionTypes', value);
										}}
									/>
								</fieldset>
							</div>
							<div className="w-full">
								<fieldset>
									<legend>{t.numberQuestionsTitle}</legend>

									<OptionGroup
										value={numQuestions}
										options={[
											{ value: 5, label: 5 },
											{ value: 10, label: 10 },
											{ value: 15, label: 15 },
											{ value: 20, label: 20 },
										]}
										size="sm"
										onChange={(value) => {
											handleSettingsChange('numQuestions', value);
										}}
									/>
								</fieldset>
							</div>
						</div>
					</fieldset>
					<Button
						className="longFadeIn mt-6 max-w-[300px] self-center"
						size="md"
						variant="green"
						type="submit"
						disabled={isSubmitting}
					>
						{t.generateQuizBtn}
						<FontAwesomeIcon icon={faWandMagicSparkles} />
					</Button>
				</form>
			</div>
		</div>
	);
}
