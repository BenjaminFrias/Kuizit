import App from '@/App';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import enTranslations from '../translations/en.json';
import type { QuizData } from '@/types';
import { MemoryRouter } from 'react-router';

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
	it('Should display home page when app is mounted', async () => {
		render(
			<MemoryRouter initialEntries={['/']}>
				<App />
			</MemoryRouter>
		);

		const homepage = await screen.findByTestId('home-page');
		expect(homepage).toBeVisible();
	});

	it('Should display quiz loading page while the quiz data is being fetched', async () => {
		render(
			<MemoryRouter initialEntries={['/input']}>
				<App />
			</MemoryRouter>
		);

		const user = userEvent.setup();

		let resolveMockPromise: (value: QuizData) => void;
		const controlledPromise = new Promise<QuizData>((resolve) => {
			resolveMockPromise = resolve;
		});

		mockGenerateQuiz.mockReturnValue(controlledPromise);

		// Enter prompt
		const textarea = await screen.findByPlaceholderText(
			enTranslations.quizPromptPlaceholder
		);

		await user.type(textarea, 'create quiz about programming');

		// Click generate quiz
		const generateQuizBtn = await screen.findByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		await user.click(generateQuizBtn);

		// Check for quiz loading page being shown
		const QuizLoadingPage = await screen.findByTestId('loading-page');
		expect(QuizLoadingPage).toBeVisible();

		// Solve generated quiz promise to stop loading page
		resolveMockPromise!(mockQuizData);

		// Check if loading page disappears after promise is resolved
		await waitForElementToBeRemoved(() => screen.queryByTestId('loading-page'));

		expect(QuizLoadingPage).not.toBeVisible();
	});
});
