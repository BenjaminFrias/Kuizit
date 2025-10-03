import { QuizReviewPage } from '@/pages/QuizReviewPage';
import type { Page, QuizData, QuizResult } from '@/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, vi, it, expect } from 'vitest';

type QuizReviewPageParams = {
	quizData: QuizData;
	quizResults: QuizResult;
	onPageChange: (page: Page) => void;
};

const defaultQuizReviewParams: QuizReviewPageParams = {
	onPageChange: vi.fn(),
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
	quizResults: [
		{
			isCorrect: true,
			selectedIndex: 0,
		},
		{
			isCorrect: false,
			selectedIndex: 2,
		},
	],
};

describe('Initial render', () => {
	it('should render question 1 text', () => {
		render(<QuizReviewPage {...defaultQuizReviewParams} />);

		const questionNumberTitle = screen.getByText('Question 1');
		expect(questionNumberTitle).toBeVisible();
	});

	it('should render first question title correctly', () => {
		render(<QuizReviewPage {...defaultQuizReviewParams} />);

		const questionTitle = screen.getByText('What is TypeScript?');
		expect(questionTitle).toBeVisible();
	});

	it('should render decorative blurry shape', () => {
		render(<QuizReviewPage {...defaultQuizReviewParams} />);

		const blurryShape = screen.getByTestId('blurry-shape');
		expect(blurryShape).toBeVisible();
	});

	it('should render progress bar', () => {
		render(<QuizReviewPage {...defaultQuizReviewParams} />);

		const progressBar = screen.getByTestId('progress-bar');
		expect(progressBar).toBeVisible();
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
			render(<QuizReviewPage {...defaultQuizReviewParams} />);
			const buttonName = testCase;

			const answerBtn = screen.getByRole('button', {
				name: new RegExp(buttonName, 'i'),
			});

			expect(answerBtn).toBeVisible();
		}
	);

	it('should render close(x) button', () => {
		render(<QuizReviewPage {...defaultQuizReviewParams} />);

		const endReviewBtn = screen.getByRole('button', {
			name: /end review/i,
		});

		expect(endReviewBtn).toBeVisible();
	});

	it('should render explanation button', () => {
		render(<QuizReviewPage {...defaultQuizReviewParams} />);

		const explanationBtn = screen.getByRole('button', {
			name: /explanation/i,
		});

		expect(explanationBtn).toBeVisible();
	});

	it('should render next answered question button', () => {
		render(<QuizReviewPage {...defaultQuizReviewParams} />);

		const endReviewBtn = screen.getByRole('button', {
			name: /next question/i,
		});

		expect(endReviewBtn).toBeVisible();
	});

	it('should not render previous answered question button in first question', () => {
		render(<QuizReviewPage {...defaultQuizReviewParams} />);

		const endReviewBtn = screen.queryByRole('button', {
			name: /previous question/i,
		});

		expect(endReviewBtn).not.toBeInTheDocument();
	});
});

describe('Conditional render', () => {
	it('should render previous answered question button after first question', async () => {
		const user = userEvent.setup();
		render(<QuizReviewPage {...defaultQuizReviewParams} />);

		const nextQuestionBtn = screen.getByRole('button', {
			name: /next question/i,
		});

		await user.click(nextQuestionBtn);

		const previousQuestionBtn = await screen.findByRole('button', {
			name: /previous question/i,
		});

		expect(previousQuestionBtn).toBeVisible();
	});

	it('should call onPageChange when clicking end review button (x)', async () => {
		const user = userEvent.setup();
		render(<QuizReviewPage {...defaultQuizReviewParams} />);
		const mockOnPageChange = defaultQuizReviewParams.onPageChange;

		const endReviewBtn = screen.getByRole('button', {
			name: /end review/i,
		});

		await user.click(endReviewBtn);

		expect(mockOnPageChange).toHaveBeenCalled();
		expect(mockOnPageChange).toHaveBeenCalledWith('home');
	});

	it('should call onPageChange after clicking next answered button in the final question ', async () => {
		const user = userEvent.setup();
		render(<QuizReviewPage {...defaultQuizReviewParams} />);
		const mockOnPageChange = defaultQuizReviewParams.onPageChange;

		const nextQuestionBtn = screen.getByRole('button', {
			name: /next question/i,
		});

		await user.click(nextQuestionBtn);

		const finalNextQuestionBtn = await screen.findByRole('button', {
			name: /next question/i,
		});

		await user.click(finalNextQuestionBtn);

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve(true);
			}, 500);
		});

		expect(mockOnPageChange).toHaveBeenCalled();
	});
});
