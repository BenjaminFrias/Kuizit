import App from '@/App';
import {
	fireEvent,
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import enTranslations from '../translations/en.json';
import type { QuizData } from '@/types';

const mockGenerateQuiz = vi.fn();
vi.mock('../hooks/useQuizApi', () => {
	return {
		useQuizApi: () => ({
			generateQuiz: mockGenerateQuiz,
			apiError: null,
			setApiError: vi.fn(),
		}),
	};
});

const mockQuizData: QuizData = [
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
];

describe('App tests', () => {
	it('Should display home page when app is mounted', () => {
		render(<App />);

		const homepage = screen.getByTestId('home-page');
		expect(homepage).toBeVisible();
	});

	it('Should display input page after generate quiz homepage button is clicked', async () => {
		const user = userEvent.setup();
		render(<App />);

		// Click generate button in homepage
		const generateQuizBtn = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(generateQuizBtn);

		const inputPage = screen.getByTestId('input-page');
		expect(inputPage).toBeVisible();
	});

	it('Should display quiz loading page while the quiz data is being fetched', async () => {
		const user = userEvent.setup();

		let resolveMockPromise: (value: QuizData) => void;
		const controlledPromise = new Promise<QuizData>((resolve) => {
			resolveMockPromise = resolve;
		});

		mockGenerateQuiz.mockReturnValue(controlledPromise);

		render(<App />);

		// Go to input page
		const btnToInputPage = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(btnToInputPage);

		// Enter prompt
		const textarea = screen.getByPlaceholderText(
			enTranslations.quizPromptPlaceholder
		);

		await user.type(textarea, 'create quiz about programming');

		// Click generate quiz
		const generateQuizBtn = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(generateQuizBtn);

		// Check for quiz loading page being shown
		const QuizLoadingPage = screen.getByTestId('loading-page');
		expect(QuizLoadingPage).toBeVisible();

		// Solve generated quiz promise to stop loading page
		resolveMockPromise!(mockQuizData);

		// Check if loading page disappears after promise is resolved
		await waitForElementToBeRemoved(() => screen.queryByTestId('loading-page'));

		const question1Title = screen.getByText('Question 1');
		expect(question1Title).toBeVisible();
	});

	it('Should display quiz page when generate quiz btn in Input page is clicked', async () => {
		const user = userEvent.setup();

		let resolveMockPromise: (value: QuizData) => void;
		const controlledPromise = new Promise<QuizData>((resolve) => {
			resolveMockPromise = resolve;
		});

		mockGenerateQuiz.mockReturnValue(controlledPromise);

		render(<App />);

		// Go to input page
		const btnToInputPage = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(btnToInputPage);

		// Enter prompt
		const textarea = screen.getByPlaceholderText(
			enTranslations.quizPromptPlaceholder
		);

		await user.type(textarea, 'create quiz about programming');

		// Click generate quiz
		const generateQuizBtn = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(generateQuizBtn);

		// Check for quiz loading page being shown
		const QuizLoadingPage = screen.getByTestId('loading-page');
		expect(QuizLoadingPage).toBeVisible();

		// Solve generated quiz promise to stop loading page
		resolveMockPromise!(mockQuizData);

		// Check if loading page disappears after promise is resolved
		await waitForElementToBeRemoved(() => screen.queryByTestId('loading-page'));

		const question1Title = screen.getByText('Question 1');
		expect(question1Title).toBeVisible();

		const answer1Text = screen.getByText('A superset of Javascript');
		expect(answer1Text).toBeVisible();
	});

	it('Should display quiz results page after completing quiz', async () => {
		const user = userEvent.setup();

		let resolveMockPromise: (value: QuizData) => void;
		const controlledPromise = new Promise<QuizData>((resolve) => {
			resolveMockPromise = resolve;
		});

		mockGenerateQuiz.mockReturnValue(controlledPromise);

		render(<App />);

		// Go to input page
		const btnToInputPage = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(btnToInputPage);

		// Enter prompt
		const textarea = screen.getByPlaceholderText(
			enTranslations.quizPromptPlaceholder
		);

		await user.type(textarea, 'create quiz about programming');

		// Click generate quiz
		const generateQuizBtn = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(generateQuizBtn);

		resolveMockPromise!(mockQuizData);

		// Check if loading page disappears after promise is resolved
		await waitForElementToBeRemoved(() => screen.queryByTestId('loading-page'));

		// Select correct option in question 1
		const correctOptionBtn1 = screen.getByRole('button', {
			name: new RegExp('A superset of Javascript'),
		});

		await user.click(correctOptionBtn1);

		// Click next question btn
		const nextQuestionBtn = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn);
		fireEvent.transitionEnd(correctOptionBtn1);

		// Select wrong option final question
		const wrongOptionBtn2 = await screen.findByRole('button', {
			name: new RegExp('Automatic memory management'),
		});

		expect(wrongOptionBtn2).toBeVisible();
		await user.click(wrongOptionBtn2);

		const nextQuestionBtn2 = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn2);
		fireEvent.transitionEnd(wrongOptionBtn2);

		const quizResultsText = screen.getByTestId('results-page');
		expect(quizResultsText).toBeVisible();
	});

	it('Should display quiz review page when review answers btn is clicked', async () => {
		const user = userEvent.setup();

		let resolveMockPromise: (value: QuizData) => void;
		const controlledPromise = new Promise<QuizData>((resolve) => {
			resolveMockPromise = resolve;
		});

		mockGenerateQuiz.mockReturnValue(controlledPromise);

		render(<App />);

		// Go to input page
		const btnToInputPage = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(btnToInputPage);

		// Enter prompt
		const textarea = screen.getByPlaceholderText(
			enTranslations.quizPromptPlaceholder
		);

		await user.type(textarea, 'create quiz about programming');

		// Click generate quiz
		const generateQuizBtn = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(generateQuizBtn);

		// Solve generated quiz promise to stop loading page
		resolveMockPromise!(mockQuizData);

		// Check if loading page disappears after promise is resolved
		await waitForElementToBeRemoved(() => screen.queryByTestId('loading-page'));

		// Select correct option in question 1
		const correctOptionBtn1 = screen.getByRole('button', {
			name: new RegExp('A superset of Javascript'),
		});

		await user.click(correctOptionBtn1);

		// Click next question btn
		const nextQuestionBtn = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn);
		fireEvent.transitionEnd(correctOptionBtn1);

		// Select wrong option final question
		const wrongOptionBtn2 = await screen.findByRole('button', {
			name: new RegExp('Automatic memory management'),
		});

		await user.click(wrongOptionBtn2);

		const nextQuestionBtn2 = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn2);
		fireEvent.transitionEnd(wrongOptionBtn2);

		const reviewAnswersBtn = screen.getByRole('button', {
			name: new RegExp(enTranslations.reviewAnswers, 'i'),
		});

		await user.click(reviewAnswersBtn);

		const reviewPage = screen.getByTestId('review-page');
		expect(reviewPage).toBeVisible();
	});

	it('Should display quiz results page when x button in quiz review page is clicked', async () => {
		const user = userEvent.setup();

		let resolveMockPromise: (value: QuizData) => void;
		const controlledPromise = new Promise<QuizData>((resolve) => {
			resolveMockPromise = resolve;
		});

		mockGenerateQuiz.mockReturnValue(controlledPromise);

		render(<App />);

		// Go to input page
		const btnToInputPage = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(btnToInputPage);

		// Enter prompt
		const textarea = screen.getByPlaceholderText(
			enTranslations.quizPromptPlaceholder
		);

		await user.type(textarea, 'create quiz about programming');

		// Click generate quiz
		const generateQuizBtn = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(generateQuizBtn);

		// Solve generated quiz promise to stop loading page
		resolveMockPromise!(mockQuizData);

		// Check if loading page disappears after promise is resolved
		await waitForElementToBeRemoved(() => screen.queryByTestId('loading-page'));

		// Select correct option in question 1
		const correctOptionBtn1 = screen.getByRole('button', {
			name: new RegExp('A superset of Javascript'),
		});

		await user.click(correctOptionBtn1);

		// Click next question btn
		const nextQuestionBtn = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn);
		fireEvent.transitionEnd(correctOptionBtn1);

		// Select wrong option final question
		const wrongOptionBtn2 = await screen.findByRole('button', {
			name: new RegExp('Automatic memory management'),
		});

		await user.click(wrongOptionBtn2);

		const nextQuestionBtn2 = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn2);
		fireEvent.transitionEnd(wrongOptionBtn2);

		const reviewPage = screen.getByTestId('results-page');
		expect(reviewPage).toBeVisible();

		const reviewAnswersBtn = screen.getByRole('button', {
			name: new RegExp(enTranslations.reviewAnswers, 'i'),
		});

		await user.click(reviewAnswersBtn);

		// Click x button
		const closeReviewAnswerBtn = screen.getByLabelText('end review');
		await user.click(closeReviewAnswerBtn);

		const quizResultsPage = screen.getByTestId('results-page');
		expect(quizResultsPage).toBeVisible();
	});

	it('Should display input page when generate quiz button in quiz results page is clicked', async () => {
		const user = userEvent.setup();

		let resolveMockPromise: (value: QuizData) => void;
		const controlledPromise = new Promise<QuizData>((resolve) => {
			resolveMockPromise = resolve;
		});

		mockGenerateQuiz.mockReturnValue(controlledPromise);

		render(<App />);

		// Go to input page
		const btnToInputPage = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(btnToInputPage);

		// Enter prompt
		const textarea = screen.getByPlaceholderText(
			enTranslations.quizPromptPlaceholder
		);

		await user.type(textarea, 'create quiz about programming');

		// Click generate quiz
		const generateQuizBtn = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(generateQuizBtn);

		// Solve generated quiz promise to stop loading page
		resolveMockPromise!(mockQuizData);

		// Check if loading page disappears after promise is resolved
		await waitForElementToBeRemoved(() => screen.queryByTestId('loading-page'));

		// Select correct option in question 1
		const correctOptionBtn1 = screen.getByRole('button', {
			name: new RegExp('A superset of Javascript'),
		});

		await user.click(correctOptionBtn1);

		// Click next question btn
		const nextQuestionBtn = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn);
		fireEvent.transitionEnd(correctOptionBtn1);

		// Select wrong option final question
		const wrongOptionBtn2 = await screen.findByRole('button', {
			name: new RegExp('Automatic memory management'),
		});

		await user.click(wrongOptionBtn2);

		const nextQuestionBtn2 = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn2);
		fireEvent.transitionEnd(wrongOptionBtn2);

		const generateQuizBtnResults = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});
		await user.click(generateQuizBtnResults);

		const inputPage = screen.getByTestId('input-page');
		expect(inputPage).toBeVisible();
	});
	it('Should reset quiz settings when generate quiz btn(results page) is clicked', async () => {
		const user = userEvent.setup();

		let resolveMockPromise: (value: QuizData) => void;
		const controlledPromise = new Promise<QuizData>((resolve) => {
			resolveMockPromise = resolve;
		});

		mockGenerateQuiz.mockReturnValue(controlledPromise);

		render(<App />);

		// Go to input page
		const btnToInputPage = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(btnToInputPage);

		// Enter prompt
		const textarea = screen.getByPlaceholderText(
			enTranslations.quizPromptPlaceholder
		);

		await user.type(textarea, 'create quiz about programming');

		// Click generate quiz
		const generateQuizBtn = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(generateQuizBtn);

		// Solve generated quiz promise to stop loading page
		resolveMockPromise!(mockQuizData);

		// Check if loading page disappears after promise is resolved
		await waitForElementToBeRemoved(() => screen.queryByTestId('loading-page'));

		// Select correct option in question 1
		const correctOptionBtn1 = screen.getByRole('button', {
			name: new RegExp('A superset of Javascript'),
		});

		await user.click(correctOptionBtn1);

		// Click next question btn
		const nextQuestionBtn = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn);
		fireEvent.transitionEnd(correctOptionBtn1);

		// Select wrong option final question
		const wrongOptionBtn2 = await screen.findByRole('button', {
			name: new RegExp('Automatic memory management'),
		});

		await user.click(wrongOptionBtn2);

		const nextQuestionBtn2 = screen.getByRole('button', {
			name: /^next question$/i,
		});

		await user.click(nextQuestionBtn2);
		fireEvent.transitionEnd(wrongOptionBtn2);

		const generateQuizBtnResults = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});
		await user.click(generateQuizBtnResults);

		const textareaAfterSubmittion = screen.getByPlaceholderText(
			enTranslations.quizPromptPlaceholder
		);

		expect(textareaAfterSubmittion.textContent).toBe('');
	});
});
