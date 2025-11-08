import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InputPage from '@/pages/InputPage';
import type { InputPageParams } from '@/types';
import enTranslations from '../translations/en.json';
import type { Translations as TranslationType } from '@/types/translations';
import userEvent from '@testing-library/user-event';
import { renderPageCustom } from './utils';

const defaultInputPageProps: InputPageParams = {
	setApiError: vi.fn(),
	onQuizSubmit: vi.fn(),
	resetQuizStates: vi.fn(),
	apiError: null,
	initialSettings: {
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

beforeEach(() => {
	renderPageCustom({
		pageProps: defaultInputPageProps,
		initialEntry: '/input',
	});
});

// TESTS
describe('Initial render', () => {
	it('should render the Logo component', () => {
		const logoComponent = screen.getByRole('img', {
			name: /Kuizit logo/i,
		});

		expect(logoComponent).toBeVisible();
	});

	it('should display the main page title', () => {
		expect(screen.getByText(enTranslations.titleInputPage)).toBeVisible();
	});

	it('should render all 3 quiz input type buttons', () => {
		const inputOptionNames = [
			enTranslations.promptOption,
			enTranslations.fileOption,
			enTranslations.linkOption,
		];

		const inputOptionRegex = new RegExp(inputOptionNames.join('|'), 'i');

		const inputOptionBtns = screen.getAllByRole('radio', {
			name: inputOptionRegex,
		});

		expect(inputOptionBtns).toHaveLength(3);
	});

	it('should display all section titles', () => {
		const difficultyTitle = screen.getByText(enTranslations.difficultyTitle);
		const typeAnswersTitle = screen.getByText(enTranslations.typeAnswersTitle);
		const numQuestionsTitle = screen.getByText(
			enTranslations.numberQuestionsTitle
		);

		expect(difficultyTitle).toBeVisible();
		expect(typeAnswersTitle).toBeVisible();
		expect(numQuestionsTitle).toBeVisible();
	});

	it('should render all difficulty mode buttons', () => {
		const difficultyNames = [
			enTranslations.easyOption,
			enTranslations.mediumOption,
			enTranslations.hardOption,
			enTranslations.expertOption,
		];

		const difficultyRegex = new RegExp(difficultyNames.join('|'), 'i');

		const difficultyBtns = screen.getAllByRole('radio', {
			name: difficultyRegex,
		});

		expect(difficultyBtns).toHaveLength(4);
	});

	it('should render all answer type buttons', () => {
		const answerOptionsNames = [
			enTranslations.multipleChoiceOption,
			enTranslations.trueFalseOption,
		];

		const answersRegex = new RegExp(answerOptionsNames.join('|'), 'i');

		const answerOptionsBtns = screen.getAllByRole('radio', {
			name: answersRegex,
		});

		expect(answerOptionsBtns).toHaveLength(2);
	});

	it('should render generate quiz button', () => {
		const generateBtnRegex = new RegExp(enTranslations.generateQuizBtn, 'i');

		const generateQuizBtn = screen.getByRole('button', {
			name: generateBtnRegex,
		});

		expect(generateQuizBtn).toBeVisible();
	});
});

describe('Conditional rendering', () => {
	it('should display correct textarea when prompt option selected', () => {
		const promptTextarea = screen.getByPlaceholderText(
			enTranslations.quizPromptPlaceholder
		);
		expect(promptTextarea).toBeVisible();
	});

	it('should display correct textarea when link option selected', async () => {
		const user = userEvent.setup();
		const linkOptionBtn = screen.getByRole('radio', {
			name: new RegExp(enTranslations.linkOption, 'i'),
		});

		await user.click(linkOptionBtn);

		const ytLinkTextarea = screen.getByPlaceholderText(
			enTranslations.quizLinkPlaceholder
		);

		expect(ytLinkTextarea).toBeInTheDocument();
	});

	it('should render file upload component when file option is selected', async () => {
		const user = userEvent.setup();
		const fileOptionBtn = screen.getByRole('radio', {
			name: new RegExp(enTranslations.fileOption, 'i'),
		});

		await user.click(fileOptionBtn);

		const fileUploadComponent = screen.getByText(enTranslations.dragAndDrop);
		expect(fileUploadComponent).toBeInTheDocument();
	});

	it('should not render file upload component when prompt option is selected', () => {
		const fileUploadComponent = screen.queryByText(enTranslations.dragAndDrop);
		expect(fileUploadComponent).toBeNull();
	});

	it('should not render file upload component when link option is selected', async () => {
		const user = userEvent.setup();
		const linkOptionBtn = screen.getByRole('radio', {
			name: new RegExp(enTranslations.linkOption, 'i'),
		});

		await user.click(linkOptionBtn);

		const fileUploadComponent = screen.queryByText(enTranslations.dragAndDrop);
		expect(fileUploadComponent).toBeNull();
	});

	it('should render file component after uploading file', async () => {
		const user = userEvent.setup();
		const file = new File(['mock content'], 'quizFile.pdf', {
			type: 'application/pdf',
		});
		Object.defineProperty(file, 'size', { value: 1024 * 100 });
		const fileOptionBtn = screen.getByRole('radio', {
			name: new RegExp(enTranslations.fileOption, 'i'),
		});
		await user.click(fileOptionBtn);
		const fileInput = screen.getByLabelText('File upload', {
			selector: 'input[type="file"]',
		});
		await user.upload(fileInput, file);
		const fileUploadComponent = screen.getByText('quizFile.pdf');
		expect(fileUploadComponent).toBeInTheDocument();
	});

	it('should display error when there is an apiError in props', async () => {
		const apiErrorMessage = 'Invalid prompt';
		render(<InputPage {...defaultInputPageProps} apiError={apiErrorMessage} />);
		const errorElement = screen.getByRole('alert');
		expect(errorElement).toBeVisible();
	});

	it('should reset settings when input page is mounted', () => {
		const mockResetQuizStates = defaultInputPageProps.resetQuizStates;
		render(<InputPage {...defaultInputPageProps} />);

		expect(mockResetQuizStates).toBeCalled();
	});
});

describe('Interaction and states', () => {
	type TranslationKeys = keyof TranslationType;

	// Test cases objects
	const inputOptionTestCases: Array<TranslationKeys> = [
		'promptOption',
		'fileOption',
		'linkOption',
	];
	const difficultyOptionTestCases: Array<TranslationKeys> = [
		'easyOption',
		'mediumOption',
		'hardOption',
		'expertOption',
	];
	const answerOptionTestCases: Array<TranslationKeys> = [
		'multipleChoiceOption',
		'trueFalseOption',
	];

	const numberQuestionTestCases = [5, 10, 15, 20];
	// Tests
	it.each(inputOptionTestCases)(
		'should have bg-primary class when the $nameKey button is clicked',
		async (nameKey) => {
			const user = userEvent.setup();

			const buttonName = enTranslations[nameKey];
			const optionBtn = screen.getByRole('radio', {
				name: new RegExp(buttonName, 'i'),
			});

			await user.click(optionBtn);

			expect(optionBtn).toHaveClass('bg-primary');
		}
	);

	it.each(difficultyOptionTestCases)(
		'should have bg-primary class when the $nameKey button is clicked',
		async (nameKey) => {
			const user = userEvent.setup();

			const buttonName = enTranslations[nameKey];
			const optionBtn = screen.getByRole('radio', {
				name: new RegExp(buttonName, 'i'),
			});

			await user.click(optionBtn);

			expect(optionBtn).toHaveClass('bg-primary');
		}
	);

	it.each(answerOptionTestCases)(
		'should have bg-primary class when the $nameKey button is clicked',
		async (nameKey) => {
			const user = userEvent.setup();

			const buttonName = enTranslations[nameKey];
			const optionBtn = screen.getByRole('radio', {
				name: new RegExp(buttonName, 'i'),
			});

			await user.click(optionBtn);

			expect(optionBtn).toHaveClass('bg-primary');
		}
	);

	it.each(numberQuestionTestCases)(
		'should have bg-primary class when the "%d" button is clicked',
		async (number) => {
			const user = userEvent.setup();

			const buttonName = String(number);
			const optionBtn = screen.getByRole('radio', {
				name: new RegExp(`\\b${buttonName}\\b`, 'i'),
			});

			await user.click(optionBtn);

			expect(optionBtn).toHaveClass('bg-primary');
		}
	);

	it('should display text correctly in textarea when user type text (prompt option)', async () => {
		const user = userEvent.setup();

		const textarea = screen.getByPlaceholderText(
			enTranslations.quizPromptPlaceholder
		);

		await user.type(textarea, 'create quiz about programming');

		const inputTextarea = screen.getByText('create quiz about programming');
		expect(inputTextarea).toBeVisible();
	});

	it('should display text correctly in textarea when user type link (link option)', async () => {
		const user = userEvent.setup();

		const linkOptionBtn = screen.getByRole('radio', {
			name: new RegExp(enTranslations.linkOption, 'i'),
		});

		await user.click(linkOptionBtn);

		const textarea = screen.getByPlaceholderText(
			enTranslations.quizLinkPlaceholder
		);

		await user.type(textarea, 'https://www.youtube.com/watch?v=4qGdPFIVVQU');

		const textareaWithLink = screen.getByText(
			'https://www.youtube.com/watch?v=4qGdPFIVVQU'
		);

		expect(textareaWithLink).toBeVisible();
	});

	it('should display error when generate quiz button is clicked without content', async () => {
		const user = userEvent.setup();

		const generateBtnRegex = new RegExp(enTranslations.generateQuizBtn, 'i');

		const generateQuizBtn = screen.getByRole('button', {
			name: generateBtnRegex,
		});

		await user.click(generateQuizBtn);

		const errorMessage = screen.getByTestId('input-error');
		expect(errorMessage).toBeVisible();
	});

	it('should call onQuizSubmit when generate quiz button is clicked with correct data', async () => {
		const user = userEvent.setup();
		const mockOnQuizSubmit = defaultInputPageProps.onQuizSubmit;

		const generateBtnRegex = new RegExp(enTranslations.generateQuizBtn, 'i');

		const generateQuizBtn = screen.getByRole('button', {
			name: generateBtnRegex,
		});

		const textarea = screen.getByPlaceholderText(
			enTranslations.quizPromptPlaceholder
		);

		await user.type(textarea, 'create quiz about programming');

		await user.click(generateQuizBtn);

		expect(mockOnQuizSubmit).toBeCalledTimes(1);
	});
});
