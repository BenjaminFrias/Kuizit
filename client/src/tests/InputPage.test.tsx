import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, type Mock } from 'vitest';
import Inputpage from '@/pages/InputPage';
import type { InputPageParams } from '@/types';
import enTranslations from '../translations/en.json';
import type { Translations as TranslationType } from '@/types/translations';
import userEvent from '@testing-library/user-event';

const defaultInputPageProps: InputPageParams = {
	onPageChange: vi.fn(),
	setFiles: vi.fn(),
	onQuizSettingsChange: vi.fn(),
	setApiError: vi.fn(),
	onQuizSubmit: vi.fn(),
	quizFiles: [],
	apiError: null,
	quizSettings: {
		quizInputType: 'prompt',
		content: '',
		numQuestions: 10,
		difficulty: 'easy',
		optionTypes: 'multiple_choice',
	},
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
					quizSettings: {
						...defaultInputPageProps.quizSettings,
						quizInputType: 'youtube_link',
					},
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
				{...{
					...defaultInputPageProps,
					quizSettings: {
						...defaultInputPageProps.quizSettings,
						quizInputType: 'file',
					},
				}}
			/>
		);

		const fileUploadComponent = screen.getByText(enTranslations.dragAndDrop);
		expect(fileUploadComponent).toBeInTheDocument();
	});

	it('should not render file upload component when prompt option is selected', () => {
		render(
			<Inputpage
				{...{
					...defaultInputPageProps,
					quizSettings: {
						...defaultInputPageProps.quizSettings,
						quizInputType: 'prompt',
					},
				}}
			/>
		);

		const fileUploadComponent = screen.queryByText(enTranslations.dragAndDrop);
		expect(fileUploadComponent).toBeNull();
	});

	it('should not render file upload component when link option is selected', () => {
		render(
			<Inputpage
				{...{
					...defaultInputPageProps,
					quizSettings: {
						...defaultInputPageProps.quizSettings,
						quizInputType: 'youtube_link',
					},
				}}
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
					quizSettings: {
						...defaultInputPageProps.quizSettings,
						quizInputType: 'file',
					},
				}}
				quizFiles={[file]}
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

	const mockOnQuizSettingsChange = defaultInputPageProps.onQuizSettingsChange;

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
		'should call onQuizSettingsChange with $expectedValue when the $nameKey button is clicked',
		async ({ nameKey, expectedValue }) => {
			const user = userEvent.setup();
			render(<Inputpage {...defaultInputPageProps} />);

			const buttonName = enTranslations[nameKey];
			const optionBtn = screen.getByRole('button', {
				name: new RegExp(buttonName, 'i'),
			});

			await user.click(optionBtn);

			expect(mockOnQuizSettingsChange).toHaveBeenCalledWith(
				'quizInputType',
				expectedValue
			);
		}
	);

	it.each(difficultyOptionTestCases)(
		'should call onQuizSettingsChange with $expectedValue when the $nameKey button is clicked',
		async ({ nameKey, expectedValue }) => {
			const user = userEvent.setup();
			render(<Inputpage {...defaultInputPageProps} />);

			const buttonName = enTranslations[nameKey];
			const optionBtn = screen.getByRole('button', {
				name: new RegExp(buttonName, 'i'),
			});

			await user.click(optionBtn);

			expect(mockOnQuizSettingsChange).toHaveBeenCalledWith(
				'difficulty',
				expectedValue
			);
		}
	);

	it.each(answerOptionTestCases)(
		'should call onQuizSettingsChange with $expectedValue when the $nameKey button is clicked',
		async ({ nameKey, expectedValue }) => {
			const user = userEvent.setup();
			render(<Inputpage {...defaultInputPageProps} />);

			const buttonName = enTranslations[nameKey];
			const optionBtn = screen.getByRole('button', {
				name: new RegExp(buttonName, 'i'),
			});

			await user.click(optionBtn);

			expect(mockOnQuizSettingsChange).toHaveBeenCalledWith(
				'optionTypes',
				expectedValue
			);
		}
	);
	it.each(numberQuestionTestCases)(
		'should call onQuizSettingsChange with %d when the button is clicked',
		async (number) => {
			const user = userEvent.setup();
			render(<Inputpage {...defaultInputPageProps} />);

			const buttonName = String(number);
			const optionBtn = screen.getByRole('button', {
				name: new RegExp(`\\b${buttonName}\\b`, 'i'),
			});

			await user.click(optionBtn);

			expect(mockOnQuizSettingsChange).toHaveBeenCalledWith(
				'numQuestions',
				number
			);
		}
	);

	it('should call onQuizSettingsChange correctly for input in textarea (prompt option)', async () => {
		const user = userEvent.setup();

		render(<Inputpage {...defaultInputPageProps} />);

		const textarea = screen.getByPlaceholderText(
			enTranslations.quizPromptPlaceholder
		);

		(mockOnQuizSettingsChange as Mock).mockClear();
		await user.type(textarea, 'create');

		expect(mockOnQuizSettingsChange).toHaveBeenCalledTimes(6);

		expect(mockOnQuizSettingsChange).toHaveBeenLastCalledWith('content', 'e');
	});

	it('should call onQuizSettingsChange correctly for input in textarea (link option)', async () => {
		const user = userEvent.setup();

		render(
			<Inputpage
				{...{
					...defaultInputPageProps,
					quizSettings: {
						...defaultInputPageProps.quizSettings,
						quizInputType: 'youtube_link',
					},
				}}
			/>
		);

		const textarea = screen.getByPlaceholderText(
			enTranslations.quizLinkPlaceholder
		);

		(mockOnQuizSettingsChange as Mock).mockClear();
		await user.type(textarea, 'https://www.youtube.com/watch?v=4qGdPFIVVQU');

		expect(mockOnQuizSettingsChange).toHaveBeenCalledTimes(43);
		expect(mockOnQuizSettingsChange).toHaveBeenLastCalledWith('content', 'U');
	});

	it('should call onQuizSettingsChange with home and onQuizSubmit when generate quiz button is clicked', async () => {
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
