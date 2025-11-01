import { FileUploadDropZone } from '@/components/FileUploadDropZone';
import Logo from '@/components/Logo';
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

						<div className="input-types flex gap-2 w-full justify-center items-center">
							<Button
								className="flex-1"
								size="md"
								type="button"
								variant={`${quizInputType === 'prompt' ? 'green' : 'minimal'}`}
								onClick={() => {
									handleSettingsChange('quizInputType', 'prompt');
									resetAfterErrors();
								}}
							>
								{t.promptOption}
							</Button>
							<Button
								className="flex-1"
								size="md"
								type="button"
								variant={`${quizInputType === 'file' ? 'green' : 'minimal'}`}
								onClick={() => {
									handleSettingsChange('quizInputType', 'file');
									resetAfterErrors();
								}}
							>
								{t.fileOption}
							</Button>
							<Button
								className="flex-1"
								size="md"
								type="button"
								variant={`${
									quizInputType === 'youtube_link' ? 'green' : 'minimal'
								}`}
								onClick={() => {
									handleSettingsChange('quizInputType', 'youtube_link');
									resetAfterErrors();
								}}
							>
								{t.linkOption}
							</Button>
						</div>
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
								<p>{localError || apiError}</p>
							</div>
						) : null}
					</fieldset>

					<fieldset>
						<legend className="sr-only">Quiz details</legend>

						<div className="flex flex-col w-full justify-center gap-2">
							<div className=" w-full">
								<fieldset>
									<legend className="text-center font-primary text-custom-light-gray font-medium">
										{t.difficultyTitle}
									</legend>
									<div className="flex gap-2 mt-2 w-full" role="radiogroup">
										<Button
											className="flex-1"
											size="sm"
											type="button"
											variant={`${difficulty === 'easy' ? 'green' : 'minimal'}`}
											onClick={() => handleSettingsChange('difficulty', 'easy')}
										>
											{t.easyOption}
										</Button>
										<Button
											className="flex-1"
											size="sm"
											type="button"
											variant={`${
												difficulty === 'medium' ? 'green' : 'minimal'
											}`}
											onClick={() =>
												handleSettingsChange('difficulty', 'medium')
											}
										>
											{t.mediumOption}
										</Button>
										<Button
											className="flex-1"
											size="sm"
											type="button"
											variant={`${difficulty === 'hard' ? 'green' : 'minimal'}`}
											onClick={() => handleSettingsChange('difficulty', 'hard')}
										>
											{t.hardOption}
										</Button>
										<Button
											className="flex-1"
											size="sm"
											type="button"
											variant={`${
												difficulty === 'expert' ? 'green' : 'minimal'
											}`}
											onClick={() =>
												handleSettingsChange('difficulty', 'expert')
											}
										>
											{t.expertOption}
										</Button>
									</div>
								</fieldset>
							</div>
							<div className="w-full">
								<fieldset>
									<legend className="text-center font-primary text-custom-light-gray font-medium">
										{t.typeAnswersTitle}
									</legend>
									<div className="flex gap-2 mt-2 w-full">
										<Button
											className="flex-1"
											size="sm"
											type="button"
											variant={`${
												optionTypes === 'multiple_choice' ? 'green' : 'minimal'
											}`}
											onClick={() =>
												handleSettingsChange('optionTypes', 'multiple_choice')
											}
										>
											{t.multipleChoiceOption}
										</Button>
										<Button
											className="flex-1"
											size="sm"
											type="button"
											variant={`${
												optionTypes === 'true_false' ? 'green' : 'minimal'
											}`}
											onClick={() =>
												handleSettingsChange('optionTypes', 'true_false')
											}
										>
											{t.trueFalseOption}
										</Button>
									</div>
								</fieldset>
							</div>
							<div className="w-full">
								<fieldset>
									<legend className="text-center font-primary text-custom-light-gray font-medium">
										{t.numberQuestionsTitle}
									</legend>
									<div className="flex gap-2 mt-2 w-full">
										<Button
											className="flex-1"
											size="sm"
											type="button"
											variant={`${numQuestions === 5 ? 'green' : 'minimal'}`}
											onClick={() => handleSettingsChange('numQuestions', 5)}
										>
											5
										</Button>
										<Button
											className="flex-1"
											size="sm"
											type="button"
											variant={`${numQuestions === 10 ? 'green' : 'minimal'}`}
											onClick={() => handleSettingsChange('numQuestions', 10)}
										>
											10
										</Button>
										<Button
											className="flex-1"
											size="sm"
											type="button"
											variant={`${numQuestions === 15 ? 'green' : 'minimal'}`}
											onClick={() => handleSettingsChange('numQuestions', 15)}
										>
											15
										</Button>
										<Button
											className="flex-1"
											size="sm"
											type="button"
											variant={`${numQuestions === 20 ? 'green' : 'minimal'}`}
											onClick={() => handleSettingsChange('numQuestions', 20)}
										>
											20
										</Button>
									</div>
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
