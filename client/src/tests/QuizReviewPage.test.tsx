import { QuizReviewPage } from '@/pages/QuizReviewPage';
import type { QuizReviewPageParams } from '@/types';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, it, expect, beforeEach } from 'vitest';
import { MockResultsPage } from './utils';

const defaultQuizReviewParams: QuizReviewPageParams = {
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

beforeEach(() => {
	render(
		<MemoryRouter initialEntries={['/review']}>
			<Routes>
				<Route
					path="/review"
					element={<QuizReviewPage {...defaultQuizReviewParams} />}
				/>
				<Route path="/results" element={<MockResultsPage />} />
			</Routes>
		</MemoryRouter>
	);
});

describe('Initial render', () => {
	it('should render question 1 text', () => {
		const questionNumberTitle = screen.getByText('Question 1');
		expect(questionNumberTitle).toBeVisible();
	});

	it('should render first question title correctly', () => {
		const questionTitle = screen.getByText('What is TypeScript?');
		expect(questionTitle).toBeVisible();
	});

	it('should render decorative blurry shape', () => {
		const blurryShape = screen.getByTestId('blurry-shape');
		expect(blurryShape).toBeVisible();
	});

	it('should render progress bar', () => {
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
			const buttonName = testCase;

			const answerBtn = screen.getByRole('button', {
				name: new RegExp(buttonName, 'i'),
			});

			expect(answerBtn).toBeVisible();
		}
	);

	it('should render close(x) button', () => {
		const endReviewBtn = screen.getByRole('button', {
			name: /end review/i,
		});

		expect(endReviewBtn).toBeVisible();
	});

	it('should render explanation button', () => {
		const explanationBtn = screen.getByRole('button', {
			name: /explanation/i,
		});

		expect(explanationBtn).toBeVisible();
	});

	it('should render next answered question button', () => {
		const endReviewBtn = screen.getByRole('button', {
			name: /next question/i,
		});

		expect(endReviewBtn).toBeVisible();
	});

	it('should not render previous answered question button in first question', () => {
		const endReviewBtn = screen.queryByRole('button', {
			name: /previous question/i,
		});

		expect(endReviewBtn).not.toBeInTheDocument();
	});
});

describe('Conditional render', () => {
	it('should render previous answered question button after first question', async () => {
		const user = userEvent.setup();
		const nextQuestionBtn = screen.getByRole('button', {
			name: /next question/i,
		});

		await user.click(nextQuestionBtn);
		const questionTitle = screen.getByLabelText('question-title');
		fireEvent.transitionEnd(questionTitle);

		const previousQuestionBtn = await screen.findByRole('button', {
			name: /previous question/i,
		});

		expect(previousQuestionBtn).toBeVisible();
	});

	it('should redirect to results page when clicking end review button (x)', async () => {
		const user = userEvent.setup();
		const endReviewBtn = screen.getByRole('button', {
			name: /end review/i,
		});

		await user.click(endReviewBtn);

		expect(screen.getByText('Results page'));
	});

	it('should redirect to results after clicking next answered button in the final question ', async () => {
		const user = userEvent.setup();
		const nextQuestionBtn = screen.getByRole('button', {
			name: /next question/i,
		});

		await user.click(nextQuestionBtn);
		const questionTitle = screen.getByLabelText('question-title');
		fireEvent.transitionEnd(questionTitle);

		const finalNextQuestionBtn = screen.getByRole('button', {
			name: /next question/i,
		});

		await user.click(finalNextQuestionBtn);

		expect(screen.getByText('Results page'));
	});
});
