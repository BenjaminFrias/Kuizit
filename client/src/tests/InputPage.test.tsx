import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, type Mock } from 'vitest';
import Inputpage from '@/pages/InputPage';
import type {
	InputOption,
	Difficulty,
	AnswerOptions,
	NumberQuestions,
	Page,
} from '@/types';
import enTranslations from '../translations/en.json';
import type { Translations as TranslationType } from '@/types/translations';
import userEvent from '@testing-library/user-event';

// MOCKS
type inputPageParams = {
	onPageChange: (pageName: Page) => void;
	onInputTypeChange: (inputName: InputOption) => void;
	onDifficultyChange: (diffName: Difficulty) => void;
	onAnswerOptionsChange: (optionName: AnswerOptions) => void;
	onNumberQuestionsChange: (numberQuestions: NumberQuestions) => void;
	onContentChange: (content: string) => void;
	setFiles: (files: File[]) => void;
	setApiError: (error: string | null) => void;
	onQuizSubmit: () => void;
	quizFiles: File[];
	quizInputType: InputOption;
	quizContent: string;
	quizDifficulty: Difficulty;
	quizAnswerOptions: AnswerOptions;
	quizNumberQuestions: NumberQuestions;
	apiError: string | null;
};

const defaultInputPageProps: inputPageParams = {
	onPageChange: vi.fn(),
	onInputTypeChange: vi.fn(),
	onDifficultyChange: vi.fn(),
	onAnswerOptionsChange: vi.fn(),
	onNumberQuestionsChange: vi.fn(),
	onContentChange: vi.fn(),
	setFiles: vi.fn(),
	setApiError: vi.fn(),
	onQuizSubmit: vi.fn(),
	quizFiles: [],
	quizInputType: 'prompt',
	quizContent: '',
	quizDifficulty: 'easy',
	quizAnswerOptions: 'multiple_choice',
	quizNumberQuestions: 10,
	apiError: null,
};

vi.mock('@/hooks/useTranslation', () => ({
	useTranslation: () => enTranslations,
}));

// TESTS
describe('Initial render', () => {
	it('should render the Logo component', () => {
		render(<Inputpage {...defaultInputPageProps} />);
		const logoComponent = screen.getByRole('img', {
			name: /Kuizit logo/i,
		});

		expect(logoComponent).toBeInTheDocument();
	});

	it('should display the main page title', () => {
		render(<Inputpage {...defaultInputPageProps} />);
		expect(screen.getByText(enTranslations.titleInputPage)).toBeInTheDocument();
	});

	it('should render all 3 quiz input type buttons', () => {
		render(<Inputpage {...defaultInputPageProps} />);

		const inputOptionNames = [
			enTranslations.promptOption,
			enTranslations.fileOption,
			enTranslations.linkOption,
		];

		const inputOptionRegex = new RegExp(inputOptionNames.join('|'), 'i');

		const inputOptionBtns = screen.getAllByRole('button', {
			name: inputOptionRegex,
		});

		expect(inputOptionBtns).toHaveLength(3);
	});

	it('should display all section titles', () => {
		render(<Inputpage {...defaultInputPageProps} />);

		const difficultyTitle = screen.getByText(enTranslations.difficultyTitle);
		const typeAnswersTitle = screen.getByText(enTranslations.typeAnswersTitle);
		const numQuestionsTitle = screen.getByText(
			enTranslations.numberQuestionsTitle
		);

		expect(difficultyTitle).toBeInTheDocument();
		expect(typeAnswersTitle).toBeInTheDocument();
		expect(numQuestionsTitle).toBeInTheDocument();
	});

	it('should render all difficulty mode buttons', () => {
		render(<Inputpage {...defaultInputPageProps} />);

		const difficultyNames = [
			enTranslations.easyOption,
			enTranslations.mediumOption,
			enTranslations.hardOption,
			enTranslations.expertOption,
		];

		const difficultyRegex = new RegExp(difficultyNames.join('|'), 'i');

		const difficultyBtns = screen.getAllByRole('button', {
			name: difficultyRegex,
		});

		expect(difficultyBtns).toHaveLength(4);
	});

	it('should render all answer type buttons', () => {
		render(<Inputpage {...defaultInputPageProps} />);

		const answerOptionsNames = [
			enTranslations.multipleChoiceOption,
			enTranslations.trueFalseOption,
		];

		const answersRegex = new RegExp(answerOptionsNames.join('|'), 'i');

		const answerOptionsBtns = screen.getAllByRole('button', {
			name: answersRegex,
		});

		expect(answerOptionsBtns).toHaveLength(2);
	});

	it('should render generate quiz button', () => {
		render(<Inputpage {...defaultInputPageProps} />);

		const generateBtnRegex = new RegExp(enTranslations.generateQuizBtn, 'i');

		const generateQuizBtn = screen.getByRole('button', {
			name: generateBtnRegex,
		});

		expect(generateQuizBtn).toBeInTheDocument();
	});
});

describe('Conditional rendering', () => {
	it('should display correct textarea when prompt option selected', () => {
		render(<Inputpage {...defaultInputPageProps} />);

		const promptTextarea = screen.getByPlaceholderText(
			enTranslations.quizPromptPlaceholder
		);

		expect(promptTextarea).toBeInTheDocument();
	});

	it('should display correct textarea when link option selected', () => {
		render(
			<Inputpage
				{...{
					...defaultInputPageProps,
					...{ quizInputType: 'youtube_link' },
				}}
			/>
		);

		const ytLinkTextarea = screen.getByPlaceholderText(
			enTranslations.quizLinkPlaceholder
		);

		expect(ytLinkTextarea).toBeInTheDocument();
	});

	it('should render file upload component when file option is selected', () => {
		render(
			<Inputpage
				{...{ ...defaultInputPageProps, ...{ quizInputType: 'file' } }}
			/>
		);

		const fileUploadComponent = screen.getByText(enTranslations.dragAndDrop);
		expect(fileUploadComponent).toBeInTheDocument();
	});

	it('should not render file upload component when prompt option is selected', () => {
		render(
			<Inputpage
				{...{ ...defaultInputPageProps, ...{ quizInputType: 'prompt' } }}
			/>
		);

		const fileUploadComponent = screen.queryByText(enTranslations.dragAndDrop);
		expect(fileUploadComponent).toBeNull();
	});

	it('should not render file upload component when link option is selected', () => {
		render(
			<Inputpage
				{...{ ...defaultInputPageProps, ...{ quizInputType: 'prompt' } }}
			/>
		);

		const fileUploadComponent = screen.queryByText(enTranslations.dragAndDrop);
		expect(fileUploadComponent).toBeNull();
	});

	it('should render file component after uploading file', async () => {
		const file = new File(['mock content'], 'quizFile.pdf', {
			type: 'application/pdf',
		});
		Object.defineProperty(file, 'size', { value: 1024 * 100 });

		render(
			<Inputpage
				{...{
					...defaultInputPageProps,
					...{ quizFiles: [file] },
					...{ quizInputType: 'file' },
				}}
			/>
		);

		const fileUploadComponent = screen.getByText('quizFile.pdf');
		expect(fileUploadComponent).toBeInTheDocument();
	});

	it('should display error when there is an apiError in props', async () => {
		const apiErrorMessage = 'Invalid prompt. Please try again';
		render(<Inputpage {...defaultInputPageProps} apiError={apiErrorMessage} />);

		const errorElement = screen.getByText(apiErrorMessage);

		expect(errorElement).toBeVisible();
	});
});

describe('Interaction and states', () => {
	type TranslationKeys = keyof TranslationType;
	type TestCase = Array<{
		nameKey: TranslationKeys;
		expectedValue: string;
	}>;

	// Test cases objects
	const inputOptionTestCases: TestCase = [
		{ nameKey: 'promptOption', expectedValue: 'prompt' },
		{ nameKey: 'fileOption', expectedValue: 'file' },
		{ nameKey: 'linkOption', expectedValue: 'youtube_link' },
	];

	const difficultyOptionTestCases: TestCase = [
		{ nameKey: 'easyOption', expectedValue: 'easy' },
		{ nameKey: 'mediumOption', expectedValue: 'medium' },
		{ nameKey: 'hardOption', expectedValue: 'hard' },
		{ nameKey: 'expertOption', expectedValue: 'expert' },
	];

	const answerOptionTestCases: TestCase = [
		{ nameKey: 'multipleChoiceOption', expectedValue: 'multiple_choice' },
		{ nameKey: 'trueFalseOption', expectedValue: 'true_false' },
	];

	const numberQuestionTestCases = [5, 10, 15, 20];
	// Tests
	it.each(inputOptionTestCases)(
		'should call onInputTypeChange with $expectedValue when the $nameKey button is clicked',
		async ({ nameKey, expectedValue }) => {
			const user = userEvent.setup();
			const mockOnInputTypeChange = defaultInputPageProps.onInputTypeChange;
			render(<Inputpage {...defaultInputPageProps} />);

			const buttonName = enTranslations[nameKey];
			const optionBtn = screen.getByRole('button', {
				name: new RegExp(buttonName, 'i'),
			});

			await user.click(optionBtn);

			expect(mockOnInputTypeChange).toHaveBeenCalledWith(expectedValue);
		}
	);

	it.each(difficultyOptionTestCases)(
		'should call onDifficultyChange with $expectedValue when the $nameKey button is clicked',
		async ({ nameKey, expectedValue }) => {
			const user = userEvent.setup();
			const mockOnDifficultyChange = defaultInputPageProps.onDifficultyChange;
			render(<Inputpage {...defaultInputPageProps} />);

			const buttonName = enTranslations[nameKey];
			const optionBtn = screen.getByRole('button', {
				name: new RegExp(buttonName, 'i'),
			});

			await user.click(optionBtn);

			expect(mockOnDifficultyChange).toHaveBeenCalledWith(expectedValue);
		}
	);

	it.each(answerOptionTestCases)(
		'should call onAnswerOptionsChange with $expectedValue when the $nameKey button is clicked',
		async ({ nameKey, expectedValue }) => {
			const user = userEvent.setup();
			const mockOnAnswerOptionsChange =
				defaultInputPageProps.onAnswerOptionsChange;
			render(<Inputpage {...defaultInputPageProps} />);

			const buttonName = enTranslations[nameKey];
			const optionBtn = screen.getByRole('button', {
				name: new RegExp(buttonName, 'i'),
			});

			await user.click(optionBtn);

			expect(mockOnAnswerOptionsChange).toHaveBeenCalledWith(expectedValue);
		}
	);

	it.each(numberQuestionTestCases)(
		'should call onNumberQuestionsChange with %d when the button is clicked',
		async (number) => {
			const user = userEvent.setup();
			const mockOnNumberQuestionsChange =
				defaultInputPageProps.onNumberQuestionsChange;
			render(<Inputpage {...defaultInputPageProps} />);

			const buttonName = String(number);
			const optionBtn = screen.getByRole('button', {
				name: new RegExp(`\\b${buttonName}\\b`, 'i'),
			});

			await user.click(optionBtn);

			expect(mockOnNumberQuestionsChange).toHaveBeenCalledWith(number);
		}
	);

	it('should call onContentChange correctly for input in textarea (prompt option)', async () => {
		const user = userEvent.setup();

		const mockOnContentChange = defaultInputPageProps.onContentChange as Mock;
		render(<Inputpage {...defaultInputPageProps} />);

		const textarea = screen.getByPlaceholderText(
			enTranslations.quizPromptPlaceholder
		);

		mockOnContentChange.mockClear();
		await user.type(textarea, 'create');

		expect(mockOnContentChange).toHaveBeenCalledTimes(6);

		// onContentChange is meant to receive the full, accumulated content of the textarea, not last character
		// todo: The last argument is 'e' instead of 'create', fix bug and test onContentChange correctly
		expect(mockOnContentChange).toHaveBeenLastCalledWith('e');
	});

	it('should call onContentChange correctly for input in textarea (link option)', async () => {
		const user = userEvent.setup();

		const mockOnContentChange = defaultInputPageProps.onContentChange as Mock;
		render(
			<Inputpage {...defaultInputPageProps} quizInputType="youtube_link" />
		);

		const textarea = screen.getByPlaceholderText(
			enTranslations.quizLinkPlaceholder
		);

		mockOnContentChange.mockClear();
		await user.type(textarea, 'https://www.youtube.com/watch?v=4qGdPFIVVQU');

		expect(mockOnContentChange).toHaveBeenCalledTimes(43);

		// onContentChange is meant to receive the full, accumulated content of the textarea, not last character
		// todo: The last argument is 'e' instead of 'create', fix bug and test onContentChange correctly
		expect(mockOnContentChange).toHaveBeenLastCalledWith('U');
	});

	it('should call onPageChange with home and onQuizSubmit when generate quiz button is clicked', async () => {
		const user = userEvent.setup();
		render(<Inputpage {...defaultInputPageProps} />);
		const mockOnPageChange = defaultInputPageProps.onPageChange;
		const mockOnQuizSubmit = defaultInputPageProps.onQuizSubmit;

		const generateBtnRegex = new RegExp(enTranslations.generateQuizBtn, 'i');

		const generateQuizBtn = screen.getByRole('button', {
			name: generateBtnRegex,
		});

		await user.click(generateQuizBtn);

		expect(mockOnPageChange).toBeCalledTimes(1);
		expect(mockOnQuizSubmit).toBeCalledTimes(1);
	});
});
