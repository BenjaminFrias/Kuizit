import { describe, it, expect, vi, beforeEach } from 'vitest';
import enTranslations from '../translations/en.json';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizLoadingPage from '@/pages/QuizLoadingPage';

vi.mock('@/hooks/useTranslation', () => ({
	useTranslation: () => enTranslations,
}));

beforeEach(() => {
	render(<QuizLoadingPage />);
});

describe('Loading component', () => {
	it('should render main text correctly', () => {
		expect(
			screen.getByText(`${enTranslations.generating}...`)
		).toBeInTheDocument();
	});

	it('should render spinner icon correctly', () => {
		const iconElement = screen.getByTestId('loadingIcon');
		expect(iconElement).toBeInTheDocument();
	});
});
