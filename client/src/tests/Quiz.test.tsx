import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { QuizPage } from '@/pages/Quiz';
import enTranslations from '../translations/en.json';
import type { QuizPageParams, QuizResult } from '@/types';
import userEvent from '@testing-library/user-event';

vi.mock('@/hooks/useTranslation', () => ({
	useTranslation: () => enTranslations,
}));

const defaultQuizPageProps: QuizPageParams = {
	onPageChange: vi.fn(),
	onQuizSubmittion: vi.fn(),
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
			name: /next question/i,
		});

		expect(blockedNextQuestionBtn).toHaveAttribute('disabled');
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

		const nextQuestionDisabledBtn = screen.queryByRole('button', {
			name: /^next question$/i,
		});

		expect(nextQuestionDisabledBtn).toHaveAttribute('disabled');

		await user.click(correctOptionBtn);

		const nextQuestionBtn = screen.queryByRole('button', {
			name: /^next question$/i,
		});

		expect(nextQuestionBtn).not.toHaveAttribute('disabled');
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

		const questionTitle = screen.getByLabelText('question-title');
		fireEvent.transitionEnd(questionTitle);

		const nextQuestionWrongOption = screen.getByRole('button', {
			name: new RegExp('Automatic memory management', 'i'),
		});

		expect(nextQuestionWrongOption).toBeInTheDocument();

		await user.click(nextQuestionWrongOption);

		const nextQuestionBtn2 = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn2);

		expect(mockOnPageChange).toHaveBeenCalled();
	});

	it('should call onAnswerSubmittion with correct data after completing quiz', async () => {
		const user = userEvent.setup();
		render(<QuizPage {...defaultQuizPageProps} />);
		const mockOnQuizSubmittion = defaultQuizPageProps.onQuizSubmittion;

		const correctOptionBtn = screen.getByRole('button', {
			name: new RegExp('A superset of Javascript', 'i'),
		});

		await user.click(correctOptionBtn);

		const nextQuestionBtn = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn);

		const questionTitle = screen.getByLabelText('question-title');
		fireEvent.transitionEnd(questionTitle);

		const nextQuestionWrongOption = screen.getByRole('button', {
			name: new RegExp('Automatic memory management', 'i'),
		});

		expect(nextQuestionWrongOption).toBeInTheDocument();

		await user.click(nextQuestionWrongOption);

		const nextQuestionBtn2 = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn2);
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

		expect(mockOnQuizSubmittion).toHaveBeenCalledWith(expectedQuizResults);
	});
});
