import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, type Mock } from 'vitest';
import { QuizPage } from '@/pages/Quiz';
import enTranslations from '../translations/en.json';
import type { Page, QuizData, QuizResult } from '@/types';
import userEvent from '@testing-library/user-event';

vi.mock('@/hooks/useTranslation', () => ({
	useTranslation: () => enTranslations,
}));

type QuizPageParams = {
	onPageChange: (pageName: Page) => void;
	onAnswerSubmittion: (newQuizResult: QuizResult) => void;
	quizData: QuizData;
	quizResultData: QuizResult;
};

const defaultQuizPageProps: QuizPageParams = {
	onPageChange: vi.fn(),
	onAnswerSubmittion: vi.fn(),
	quizData: [
		{
			type: 'multiple_choice',
			question: 'What is TypeScript?',
			correctAnswerIndex: 0,
			options: [
				{ optionText: 'A superset of Javascript', answer: true },
				{ optionText: 'A frontend framework', answer: false },
				{ optionText: 'A python superset', answer: false },
				{ optionText: 'A runtime environment', answer: false },
			],
			explanation:
				'Typescript is a superset of Javascript, which means that any Javascript code is valid Typescript code',
		},
		{
			type: 'multiple_choice',
			question: 'What is the main feature TypeScript adds to JavaScript?',
			correctAnswerIndex: 2,
			options: [
				{ optionText: 'Asynchronous data fetching', answer: false },
				{ optionText: 'Component-based architecture', answer: false },
				{ optionText: 'Static typing', answer: true },
				{ optionText: 'Automatic memory management', answer: false },
			],
			explanation:
				"TypeScript's primary feature is introducing static typing, which allows developers to catch type-related errors during compilation (before the code runs).",
		},
	],
	quizResultData: [],
};

describe('Initial render', () => {
	it('should render question 1 subtitle', () => {
		render(<QuizPage {...defaultQuizPageProps} />);

		const questionNumberTitle = screen.getByText('Question 1');
		expect(questionNumberTitle).toBeInTheDocument();
	});

	it('should render first question title correctly', () => {
		render(<QuizPage {...defaultQuizPageProps} />);

		const questionTitle = screen.getByText('What is TypeScript?');
		expect(questionTitle).toBeInTheDocument();
	});

	it('should render decorative blurry shape', () => {
		render(<QuizPage {...defaultQuizPageProps} />);

		const blurryShape = screen.getByTestId('blurry-shape');
		expect(blurryShape).toBeInTheDocument();
	});

	it('should render progress bar', () => {
		render(<QuizPage {...defaultQuizPageProps} />);

		const progressBar = screen.getByTestId('progress-bar');
		expect(progressBar).toBeInTheDocument();
	});

	const answerOptionsTestCases = [
		'A superset of Javascript',
		'A frontend framework',
		'A python superset',
		'A runtime environment',
	];

	it.each(answerOptionsTestCases)(
		'should render the "%s" answer option button',
		(testCase) => {
			render(<QuizPage {...defaultQuizPageProps} />);
			const buttonName = testCase;

			const answerBtn = screen.getByRole('button', {
				name: new RegExp(buttonName, 'i'),
			});

			expect(answerBtn).toBeInTheDocument();
		}
	);

	it('should render next question blocked button', () => {
		render(<QuizPage {...defaultQuizPageProps} />);

		const blockedNextQuestionBtn = screen.getByRole('button', {
			name: /next question blocked/i,
		});

		expect(blockedNextQuestionBtn).toBeInTheDocument();
	});
});

describe('Conditional rendering', () => {
	it('should display the correct option in green when clicking the correct one', async () => {
		const user = userEvent.setup();
		render(<QuizPage {...defaultQuizPageProps} />);

		const correctOptionBtn = screen.getByRole('button', {
			name: new RegExp('A superset of Javascript', 'i'),
		});

		await user.click(correctOptionBtn);

		expect(correctOptionBtn).toHaveClass('bg-correct');
	});

	it('should display the correct answer in green and the wrong answer in red when clicking a wrong option', async () => {
		const user = userEvent.setup();
		render(<QuizPage {...defaultQuizPageProps} />);

		const wrongOptionBtn = screen.getByRole('button', {
			name: new RegExp('A python superset'),
		});

		const correctOptionBtn = screen.getByRole('button', {
			name: new RegExp('A superset of Javascript', 'i'),
		});

		await user.click(wrongOptionBtn);

		expect(wrongOptionBtn).toHaveClass('bg-wrong');
		expect(correctOptionBtn).toHaveClass('bg-correct');
	});

	it('should unlock next question button after answering', async () => {
		const user = userEvent.setup();
		render(<QuizPage {...defaultQuizPageProps} />);

		const correctOptionBtn = screen.getByRole('button', {
			name: new RegExp('A superset of Javascript', 'i'),
		});

		const nextQuestionHiddenBtn = screen.queryByRole('button', {
			name: /^next question$/i,
		});

		expect(nextQuestionHiddenBtn).not.toBeInTheDocument();

		await user.click(correctOptionBtn);

		const nextQuestionBtn = screen.queryByRole('button', {
			name: /^next question$/i,
		});

		expect(nextQuestionBtn).toBeInTheDocument();
	});

	it('should call onAnswerSubmittion after clicking option', async () => {
		const user = userEvent.setup();
		render(<QuizPage {...defaultQuizPageProps} />);

		const mockOnAnswerSubmittion =
			defaultQuizPageProps.onAnswerSubmittion as Mock;

		const correctOptionBtn = screen.getByRole('button', {
			name: new RegExp('A superset of Javascript', 'i'),
		});

		mockOnAnswerSubmittion.mockClear();

		expect(mockOnAnswerSubmittion).not.toBeCalled();

		await user.click(correctOptionBtn);
		expect(mockOnAnswerSubmittion).toBeCalled();
	});
});

describe('UI Integration tests', () => {
	it('should call onPageChange after clicking next question button with last question index', async () => {
		const user = userEvent.setup();
		render(<QuizPage {...defaultQuizPageProps} />);
		const mockOnPageChange = defaultQuizPageProps.onPageChange;

		const correctOptionBtn = screen.getByRole('button', {
			name: new RegExp('A superset of Javascript', 'i'),
		});

		await user.click(correctOptionBtn);

		const nextQuestionBtn = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn);

		const nextQuestionWrongOption = await screen.findByRole('button', {
			name: new RegExp('Automatic memory management', 'i'),
		});

		expect(nextQuestionWrongOption).toBeInTheDocument();

		await user.click(nextQuestionWrongOption);

		const nextQuestionBtn2 = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn2);

		// Wait for timeout to call onPageChange
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve(true);
			}, 500);
		});

		expect(mockOnPageChange).toHaveBeenCalled();
	});

	it('verify quizResultData after completing quiz', async () => {
		const user = userEvent.setup();
		render(<QuizPage {...defaultQuizPageProps} />);
		const mockOnAnswerSubmittion =
			defaultQuizPageProps.onAnswerSubmittion as Mock;
		const mockOnPageChange = defaultQuizPageProps.onPageChange as Mock;

		const expectedQuizResults: QuizResult = [
			{
				selectedIndex: 0,
				isCorrect: true,
			},
			{
				selectedIndex: 3,
				isCorrect: false,
			},
		];

		const correctOptionBtn = screen.getByRole('button', {
			name: new RegExp('A superset of Javascript', 'i'),
		});

		mockOnAnswerSubmittion.mockClear();
		await user.click(correctOptionBtn);

		const nextQuestionBtn = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn);

		// Verify that onAnswerSubmittion has been called with correct data
		expect(mockOnAnswerSubmittion).toHaveBeenCalledTimes(1);
		expect(mockOnAnswerSubmittion).toHaveBeenCalledWith([
			expectedQuizResults[0],
		]);

		const nextQuestionWrongOption = await screen.findByRole('button', {
			name: new RegExp('Automatic memory management', 'i'),
		});

		// Verify existence of next question option button
		expect(nextQuestionWrongOption).toBeInTheDocument();

		mockOnAnswerSubmittion.mockClear();
		await user.click(nextQuestionWrongOption);
		expect(mockOnAnswerSubmittion).toHaveBeenCalledTimes(1);
		expect(mockOnAnswerSubmittion).toHaveBeenCalledWith([
			expectedQuizResults[1],
		]);

		const nextQuestionBtn2 = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn2);

		// Wait for timeout to call onPageChange
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve(true);
			}, 500);
		});

		expect(mockOnPageChange).toHaveBeenCalled();
	});
});
