import { QuizResultsPage } from '@/pages/QuizResultsPage';
import type { Page, QuizResult } from '@/types';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import enTranslations from '../translations/en.json';
import userEvent from '@testing-library/user-event';

vi.mock('@/hooks/useTranslation', () => ({
	useTranslation: () => enTranslations,
}));

type QuizResultsPageParams = {
	quizResults: QuizResult;
	onPageChange: (page: Page) => void;
};

const defaultQuizResultsPageProps: QuizResultsPageParams = {
	quizResults: [
		{
			isCorrect: true,
			selectedIndex: 0,
		},
		{
			isCorrect: false,
			selectedIndex: 2,
		},
		{
			isCorrect: true,
			selectedIndex: 1,
		},
	],
	onPageChange: vi.fn(),
};

beforeEach(() => {
	render(<QuizResultsPage {...defaultQuizResultsPageProps} />);
});

describe('Initial render', () => {
	it('should render quiz result title', () => {
		const quizResultTitle = screen.getByText(enTranslations.quizResultsTitle);
		expect(quizResultTitle).toBeVisible();
	});

	it('should render crown icon', () => {
		const crownIcon = screen.getByTestId('crown-icon');
		expect(crownIcon).toBeVisible();
	});

	it('should render congratulations text', () => {
		const congratulationsText = screen.getByText(
			enTranslations.congratulations
		);
		expect(congratulationsText).toBeVisible();
	});

	it("should render 'your score is...' text", () => {
		const yourScoreIsText = screen.getByText(
			enTranslations.yourScoreIs + '...'
		);
		expect(yourScoreIsText).toBeVisible();
	});

	it('should calculate and render correct score percentage', () => {
		const percentageScore = screen.getByText('66%');
		expect(percentageScore).toBeVisible();
	});

	it('should render correct score text', () => {
		const quizScoreText = screen.getByText(
			'You got 2 out of 3 questions correctly'
		);
		expect(quizScoreText).toBeVisible();
	});

	it('should render review answers button', () => {
		const reviewAnswersBtn = screen.getByRole('button', {
			name: new RegExp(enTranslations.reviewAnswers, 'i'),
		});

		expect(reviewAnswersBtn).toBeVisible();
	});

	it('should render generate quiz button', () => {
		const generateQuizBtn = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		expect(generateQuizBtn).toBeVisible();
	});

	it('Renders blurry shapes in the background', () => {
		const blurryShapes = screen.getAllByTestId('blurry-shape');
		expect(blurryShapes).toHaveLength(2);
	});
});

describe('UI interactions', () => {
	it('should call onPageChange with review when clicking review answers button', async () => {
		const user = userEvent.setup();
		const reviewAnswersBtn = screen.getByRole('button', {
			name: new RegExp(enTranslations.reviewAnswers),
		});

		const mockOnPageChange = defaultQuizResultsPageProps.onPageChange;

		await user.click(reviewAnswersBtn);

		expect(mockOnPageChange).toHaveBeenCalled();
		expect(mockOnPageChange).toHaveBeenCalledWith('review');
	});

	it('should call onPageChange with input when clicking generate quiz button', async () => {
		const user = userEvent.setup();
		const generateQuizBtn = screen.getByRole('button', {
			name: new RegExp(enTranslations.generateQuizBtn, 'i'),
		});

		const mockOnPageChange = defaultQuizResultsPageProps.onPageChange as Mock;

		mockOnPageChange.mockClear();
		await user.click(generateQuizBtn);

		expect(mockOnPageChange).toHaveBeenCalled();
		expect(mockOnPageChange).toHaveBeenCalledWith('input');
	});
});
