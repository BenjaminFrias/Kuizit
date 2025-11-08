import App from '@/App';
import {
	fireEvent,
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import enTranslations from '../translations/en.json';
import type { QuizData } from '@/types';
import { MemoryRouter, Route, Routes } from 'react-router';
import { MockQuizPage } from './utils';

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

beforeEach(() => {
	render(
		<MemoryRouter initialEntries={['/']}>
			<Routes>
				<Route path="*" element={<App />} />
			</Routes>
		</MemoryRouter>
	);
});

describe('App tests', () => {
	it('Should display home page when app is mounted', () => {
		const homepage = screen.getByTestId('home-page');
		expect(homepage).toBeVisible();
	});

	it('Should display input page after generate quiz homepage button is clicked', async () => {
		const user = userEvent.setup();

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

		expect(QuizLoadingPage).not.toBeVisible();
	});
});
