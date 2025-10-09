import { FileUploadDropZone } from '@/components/FileUploadDropZone';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';
import type { InputPageParams } from '@/types';
import {
	faCircleExclamation,
	faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Inputpage({
	onPageChange,
	onQuizSettingsChange,
	setFiles,
	setApiError,
	onQuizSubmit,
	quizFiles,
	quizSettings,
	apiError,
}: InputPageParams) {
	const t = useTranslation();

	const { quizInputType, content, difficulty, optionTypes, numQuestions } =
		quizSettings;

	return (
		<div
			className="relative min-h-screen min-w-screen w-screen max-w-screen px-3 py-5 flex flex-col items-center
		justify-between gap-10 bg-custom-white"
		>
			<div className="longFadeIn">
				<Logo width="50" height="50" color="#569d5b" />
			</div>

			<div className="flex flex-col max-w-[600px] w-full self-center md:w-400 md:max-h-screen justify-self-center items-center gap-5 longFadeIn">
				<h1 className="font-primary font-regular text-custom-gray text-center text-[2.7rem]">
					{t.titleInputPage}
				</h1>
				<div className="input-types flex gap-2 w-full justify-center items-center">
					<Button
						className="flex-1"
						size="md"
						variant={`${quizInputType === 'prompt' ? 'green' : 'minimal'}`}
						onClick={() => {
							onQuizSettingsChange('quizInputType', 'prompt');
							onQuizSettingsChange('content', '');
							setApiError(null);
						}}
					>
						{t.promptOption}
					</Button>
					<Button
						className="flex-1"
						size="md"
						variant={`${quizInputType === 'file' ? 'green' : 'minimal'}`}
						onClick={() => {
							setApiError(null);
							onQuizSettingsChange('quizInputType', 'file');
						}}
					>
						{t.fileOption}
					</Button>
					<Button
						className="flex-1"
						size="md"
						variant={`${
							quizInputType === 'youtube_link' ? 'green' : 'minimal'
						}`}
						onClick={() => {
							setApiError(null);
							onQuizSettingsChange('quizInputType', 'youtube_link');
							onQuizSettingsChange('content', '');
						}}
					>
						{t.linkOption}
					</Button>
				</div>

				{/* If input is Prompt or link use textarea if not, use file upload input */}
				{quizInputType === 'prompt' || quizInputType === 'youtube_link' ? (
					<Textarea
						className="resize-none"
						placeholder={`${
							quizInputType === 'prompt'
								? t.quizPromptPlaceholder
								: t.quizLinkPlaceholder
						}`}
						value={typeof content === 'string' ? content : ''}
						onChange={(e) => onQuizSettingsChange('content', e.target.value)}
					/>
				) : (
					<FileUploadDropZone files={quizFiles} setFiles={setFiles} />
				)}

				{apiError ? (
					<div className="flex gap-3 items-center w-full bg-red-200 border-1 font-medium border-red-500 rounded-2xl p-3">
						<FontAwesomeIcon
							icon={faCircleExclamation}
							className="text-red-500"
						/>
						<p>{apiError}</p>
					</div>
				) : null}

				<div className="flex flex-col w-full justify-center gap-2">
					<div className=" w-full">
						<h3 className="text-center font-primary text-custom-light-gray font-medium">
							{t.difficultyTitle}
						</h3>
						<div className="flex gap-2 mt-2 w-full">
							<Button
								className="flex-1"
								size="sm"
								variant={`${difficulty === 'easy' ? 'green' : 'minimal'}`}
								onClick={() => onQuizSettingsChange('difficulty', 'easy')}
							>
								{t.easyOption}
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${difficulty === 'medium' ? 'green' : 'minimal'}`}
								onClick={() => onQuizSettingsChange('difficulty', 'medium')}
							>
								{t.mediumOption}
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${difficulty === 'hard' ? 'green' : 'minimal'}`}
								onClick={() => onQuizSettingsChange('difficulty', 'hard')}
							>
								{t.hardOption}
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${difficulty === 'expert' ? 'green' : 'minimal'}`}
								onClick={() => onQuizSettingsChange('difficulty', 'expert')}
							>
								{t.expertOption}
							</Button>
						</div>
					</div>

					<div className="w-full">
						<h3 className="text-center font-primary text-custom-light-gray font-medium">
							{t.typeAnswersTitle}
						</h3>
						<div className="flex gap-2 mt-2 w-full">
							<Button
								className="flex-1"
								size="sm"
								variant={`${
									optionTypes === 'multiple_choice' ? 'green' : 'minimal'
								}`}
								onClick={() =>
									onQuizSettingsChange('optionTypes', 'multiple_choice')
								}
							>
								{t.multipleChoiceOption}
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${
									optionTypes === 'true_false' ? 'green' : 'minimal'
								}`}
								onClick={() =>
									onQuizSettingsChange('optionTypes', 'true_false')
								}
							>
								{t.trueFalseOption}
							</Button>
						</div>
					</div>

					<div className="w-full">
						<h3 className="text-center font-primary text-custom-light-gray font-medium">
							{t.numberQuestionsTitle}
						</h3>
						<div className="flex gap-2 mt-2 w-full">
							<Button
								className="flex-1"
								size="sm"
								variant={`${numQuestions === 5 ? 'green' : 'minimal'}`}
								onClick={() => onQuizSettingsChange('numQuestions', 5)}
							>
								5
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${numQuestions === 10 ? 'green' : 'minimal'}`}
								onClick={() => onQuizSettingsChange('numQuestions', 10)}
							>
								10
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${numQuestions === 15 ? 'green' : 'minimal'}`}
								onClick={() => onQuizSettingsChange('numQuestions', 15)}
							>
								15
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${numQuestions === 20 ? 'green' : 'minimal'}`}
								onClick={() => onQuizSettingsChange('numQuestions', 20)}
							>
								20
							</Button>
						</div>
					</div>
				</div>
			</div>
			<Button
				className="longFadeIn mb-5"
				size="md"
				variant="green"
				onClick={() => {
					onPageChange('home');
					onQuizSubmit();
				}}
			>
				{t.generateQuizBtn}
				<FontAwesomeIcon icon={faWandMagicSparkles} />
			</Button>
		</div>
	);
}
