import { render, screen } from '@testing-library/react';
import HomePage from '@/pages/HomePage';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import enTranslations from '../translations/en.json';

const mockOnPageChange = vi.fn();
vi.mock('@/hooks/useTranslation', () => ({
	useTranslation: () => enTranslations,
}));

beforeEach(() => {
	render(<HomePage onPageChange={mockOnPageChange} />);
});

describe('Render HomePage components', () => {
	it('Renders Logo Component', () => {
		const logoComponent = screen.getByRole('img', {
			name: /Kuizit logo/i,
		});

		expect(logoComponent).toBeInTheDocument();
	});

	it('Renders Logo Text', () => {
		expect(screen.getByText('Kuizit')).toBeInTheDocument();
	});

	it('Renders main header', () => {
		expect(screen.getByText(enTranslations.titleHome)).toBeInTheDocument();
	});

	it('Renders tagline', () => {
		expect(screen.getByText(enTranslations.taglineHome)).toBeInTheDocument();
	});

	it('Renders generate quiz button', () => {
		const generateBtnRegex = new RegExp(enTranslations.generateQuizBtn, 'i');
		const generateQuizBtn = screen.getByRole('button', {
			name: generateBtnRegex,
		});
		expect(generateQuizBtn).toBeInTheDocument();
	});

	it('Renders decorative illustrations', () => {
		const magicTextIllustration = screen.getByTestId('magic-text-illustration');
		const optionsCheckIllustration = screen.getByTestId(
			'options-check-illustration'
		);

		expect(magicTextIllustration).toBeInTheDocument();
		expect(optionsCheckIllustration).toBeInTheDocument();
	});

	it('Renders blurry shapes in the background', () => {
		const blurryShapes = screen.getAllByTestId('blurry-shape');
		expect(blurryShapes).toHaveLength(4);
	});
});

describe('Interaction in HomePage', async () => {
	it('onPageChange called with generate quiz button', async () => {
		const user = userEvent.setup();

		const generateBtnRegex = new RegExp(enTranslations.generateQuizBtn, 'i');
		const generateQuizBtn = screen.getByRole('button', {
			name: generateBtnRegex,
		});

		await user.click(generateQuizBtn);

		expect(mockOnPageChange).toHaveBeenCalledTimes(1);
	});
});
