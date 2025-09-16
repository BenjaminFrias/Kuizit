import { FileUploadDropZone } from '@/components/FileUploadDropZone';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import type {
	AnswerOptions,
	Difficulty,
	InputOption,
	NumberQuestions,
	Page,
} from '@/types';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type inputPageParams = {
	onPageChange: (pageName: Page) => void;
	onInputTypeChange: (inputName: InputOption) => void;
	onDifficultyChange: (diffName: Difficulty) => void;
	onAnswerOptionsChange: (optionName: AnswerOptions) => void;
	onNumberQuestionsChange: (numberQuestions: NumberQuestions) => void;
	onContentChange: (content: string) => void;
	setFiles: (files: File[]) => void;
	onQuizSubmit: () => void;
	quizFiles: File[];
	quizInputType: InputOption;
	quizContent: string;
	quizDifficulty: Difficulty;
	quizAnswerOptions: AnswerOptions;
	quizNumberQuestions: NumberQuestions;
};

export default function Inputpage({
	onPageChange,
	onInputTypeChange,
	onDifficultyChange,
	onAnswerOptionsChange,
	onContentChange,
	onNumberQuestionsChange,
	setFiles,
	onQuizSubmit,
	quizInputType,
	quizFiles,
	quizContent,
	quizDifficulty,
	quizAnswerOptions,
	quizNumberQuestions,
}: inputPageParams) {
	return (
		<div className="min-h-screen min-w-screen w-screen h-screen px-3 py-5 flex flex-col items-center justify-around overflow-hidden bg-custom-white">
			<h2 className="flex center font-logo text-custom-green text-lg uppercase">
				Kuizit
			</h2>

			<div className="flex flex-col w-full max-w-[600px] items-center gap-5">
				<h1 className="font-primary font-regular text-custom-gray text-[2.7rem]">
					Generate Quiz
				</h1>
				<div className="input-types flex gap-2 w-full justify-center items-center">
					<Button
						className="flex-1"
						size="md"
						variant={`${quizInputType === 'prompt' ? 'green' : 'minimal'}`}
						onClick={() => {
							onInputTypeChange('prompt');
							onContentChange('');
						}}
					>
						Prompt
					</Button>
					<Button
						className="flex-1"
						size="md"
						variant={`${quizInputType === 'file' ? 'green' : 'minimal'}`}
						onClick={() => onInputTypeChange('file')}
					>
						File
					</Button>
					<Button
						className="flex-1"
						size="md"
						variant={`${
							quizInputType === 'youtube_link' ? 'green' : 'minimal'
						}`}
						onClick={() => {
							onInputTypeChange('youtube_link');
							onContentChange('');
						}}
					>
						Link
					</Button>
				</div>

				{/* If input is Prompt or link use textarea if not, use file upload input */}
				{quizInputType === 'prompt' || quizInputType === 'youtube_link' ? (
					<Textarea
						className="resize-none"
						placeholder={`${
							quizInputType === 'prompt'
								? 'Create a quiz about the solar system...'
								: 'Paste YouTube link...'
						}`}
						value={quizContent}
						onChange={(e) => onContentChange(e.target.value)}
					/>
				) : (
					<FileUploadDropZone files={quizFiles} setFiles={setFiles} />
				)}

				<div className="flex flex-col w-full justify-center gap-2">
					<div className=" w-full">
						<h3 className="text-center font-primary text-custom-light-gray font-medium">
							Difficulty
						</h3>
						<div className="flex gap-2 mt-2 w-full">
							<Button
								className="flex-1"
								size="sm"
								variant={`${quizDifficulty === 'easy' ? 'green' : 'minimal'}`}
								onClick={() => onDifficultyChange('easy')}
							>
								Easy
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${quizDifficulty === 'medium' ? 'green' : 'minimal'}`}
								onClick={() => onDifficultyChange('medium')}
							>
								Medium
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${quizDifficulty === 'hard' ? 'green' : 'minimal'}`}
								onClick={() => onDifficultyChange('hard')}
							>
								Hard
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${quizDifficulty === 'expert' ? 'green' : 'minimal'}`}
								onClick={() => onDifficultyChange('expert')}
							>
								Expert
							</Button>
						</div>
					</div>

					<div className="w-full">
						<h3 className="text-center font-primary text-custom-light-gray font-medium">
							Type of answers
						</h3>
						<div className="flex gap-2 mt-2 w-full">
							<Button
								className="flex-1"
								size="sm"
								variant={`${
									quizAnswerOptions === 'multiple_choice' ? 'green' : 'minimal'
								}`}
								onClick={() => onAnswerOptionsChange('multiple_choice')}
							>
								Multiple choice
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${
									quizAnswerOptions === 'true_false' ? 'green' : 'minimal'
								}`}
								onClick={() => onAnswerOptionsChange('true_false')}
							>
								True or False
							</Button>
						</div>
					</div>

					<div className="w-full">
						<h3 className="text-center font-primary text-custom-light-gray font-medium">
							Number of questions
						</h3>
						<div className="flex gap-2 mt-2 w-full">
							<Button
								className="flex-1"
								size="sm"
								variant={`${quizNumberQuestions === 5 ? 'green' : 'minimal'}`}
								onClick={() => onNumberQuestionsChange(5)}
							>
								5
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${quizNumberQuestions === 10 ? 'green' : 'minimal'}`}
								onClick={() => onNumberQuestionsChange(10)}
							>
								10
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${quizNumberQuestions === 15 ? 'green' : 'minimal'}`}
								onClick={() => onNumberQuestionsChange(15)}
							>
								15
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${quizNumberQuestions === 20 ? 'green' : 'minimal'}`}
								onClick={() => onNumberQuestionsChange(20)}
							>
								20
							</Button>
						</div>
					</div>
				</div>
			</div>

			<Button
				className="mb-4"
				size="md"
				variant="green"
				onClick={() => {
					onPageChange('home');
					onQuizSubmit();
				}}
			>
				Generate quiz
				<FontAwesomeIcon icon={faWandMagicSparkles} />
			</Button>
		</div>
	);
}
