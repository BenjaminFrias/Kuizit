import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type {
	answerOptionsType,
	numberQuestionsType,
	pageOptionsType,
} from '@/types';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type inputPageParameters = {
	onPageChange: (pageName: pageOptionsType) => void;
	onInputTypeChange: (inputId: number) => void;
	onDifficultyChange: (inputId: number) => void;
	onAnswerOptionChange: (optionName: answerOptionsType) => void;
	onNumberQuestionsChange: (numberQuestions: numberQuestionsType) => void;
	inputType: number;
	difficulty: number;
	answerOption: answerOptionsType;
	numberQuestions: numberQuestionsType;
};

export default function Inputpage({
	onPageChange,
	onInputTypeChange,
	onDifficultyChange,
	onAnswerOptionChange,
	onNumberQuestionsChange,
	inputType,
	difficulty,
	answerOption,
	numberQuestions,
}: inputPageParameters) {
	return (
		<div className="min-h-screen min-w-screen px-8 py-5 flex flex-col items-center justify-between overflow-hidden bg-custom-white">
			<h2 className="flex center font-logo text-custom-green text-lg uppercase">
				Kuizit
			</h2>

			<div className="flex flex-col items-center gap-6">
				<h1 className="font-primary font-regular text-custom-gray text-[2.7rem]">
					Generate Quiz
				</h1>
				<div className="input-types flex gap-2 w-full justify-center items-center">
					<Button
						className="flex-1"
						size="md"
						variant={`${inputType === 1 ? 'green' : 'minimal'}`}
						onClick={() => onInputTypeChange(1)}
					>
						Prompt
					</Button>
					<Button
						className="flex-1"
						size="md"
						variant={`${inputType === 2 ? 'green' : 'minimal'}`}
						onClick={() => onInputTypeChange(2)}
					>
						File
					</Button>
					<Button
						className="flex-1"
						size="md"
						variant={`${inputType === 3 ? 'green' : 'minimal'}`}
						onClick={() => onInputTypeChange(3)}
					>
						Link
					</Button>
				</div>

				{inputType === 1 || inputType === 3 ? (
					<Textarea
						className="resize-none"
						placeholder="Create a quiz about the solar system..."
					/>
				) : null}

				<div className="flex flex-col justify-center gap-3">
					<div className=" w-full">
						<h3 className="text-center font-primary text-custom-light-gray font-medium">
							Difficulty
						</h3>
						<div className="flex gap-2 mt-2 w-full">
							<Button
								className="flex-1"
								size="sm"
								variant={`${difficulty === 1 ? 'green' : 'minimal'}`}
								onClick={() => onDifficultyChange(1)}
							>
								Easy
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${difficulty === 2 ? 'green' : 'minimal'}`}
								onClick={() => onDifficultyChange(2)}
							>
								Medium
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${difficulty === 3 ? 'green' : 'minimal'}`}
								onClick={() => onDifficultyChange(3)}
							>
								Hard
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${difficulty === 4 ? 'green' : 'minimal'}`}
								onClick={() => onDifficultyChange(4)}
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
									answerOption === 'multiple_choice' ? 'green' : 'minimal'
								}`}
								onClick={() => onAnswerOptionChange('multiple_choice')}
							>
								Multiple choice
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${
									answerOption === 'true_false' ? 'green' : 'minimal'
								}`}
								onClick={() => onAnswerOptionChange('true_false')}
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
								variant={`${numberQuestions === 5 ? 'green' : 'minimal'}`}
								onClick={() => onNumberQuestionsChange(5)}
							>
								5
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${numberQuestions === 10 ? 'green' : 'minimal'}`}
								onClick={() => onNumberQuestionsChange(10)}
							>
								10
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${numberQuestions === 15 ? 'green' : 'minimal'}`}
								onClick={() => onNumberQuestionsChange(15)}
							>
								15
							</Button>
							<Button
								className="flex-1"
								size="sm"
								variant={`${numberQuestions === 20 ? 'green' : 'minimal'}`}
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
				onClick={() => onPageChange('home')}
			>
				Generate quiz
				<FontAwesomeIcon icon={faWandMagicSparkles} />
			</Button>
		</div>
	);
}
