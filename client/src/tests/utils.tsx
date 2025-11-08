import HomePage from '@/pages/HomePage';
import InputPage from '@/pages/InputPage';
import { QuizPage } from '@/pages/Quiz';
import { QuizResultsPage } from '@/pages/QuizResultsPage';
import type {
	InputPageParams,
	QuizPageParams,
	QuizResultsPageParams,
} from '@/types';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

export const MockInputPage = () => <h1>Input page</h1>;
export const MockQuizPage = () => <h1>Quiz page</h1>;
export const MockResultsPage = () => <h1>Results page</h1>;
export const MockReviewPage = () => <h1>Review page</h1>;

type RenderPageCustomProps = {
	pageProps?:
		| InputPageParams
		| QuizPageParams
		| QuizResultsPageParams
		| Record<string, never>;
	initialEntry: string;
};

export function renderPageCustom(props: {
	pageProps: InputPageParams;
	initialEntry: '/input';
}): ReturnType<typeof render>;

export function renderPageCustom(props: {
	pageProps: QuizPageParams;
	initialEntry: '/quiz';
}): ReturnType<typeof render>;

export function renderPageCustom(props: {
	pageProps: QuizResultsPageParams;
	initialEntry: '/results';
}): ReturnType<typeof render>;

export function renderPageCustom(props: {
	pageProps?: Record<string, never>;
	initialEntry: '/';
}): ReturnType<typeof render>;

// eslint-disable-next-line react-refresh/only-export-components
export function renderPageCustom({
	pageProps,
	initialEntry,
}: RenderPageCustomProps) {
	return render(
		<MemoryRouter initialEntries={[initialEntry]}>
			<Routes>
				<Route path="/" element={<HomePage />} />

				<Route
					path="/input"
					element={<InputPage {...(pageProps as InputPageParams)} />}
				/>

				<Route
					path="/quiz"
					element={<QuizPage {...(pageProps as QuizPageParams)} />}
				/>

				<Route
					path="/results"
					element={
						<QuizResultsPage {...(pageProps as QuizResultsPageParams)} />
					}
				/>
			</Routes>
		</MemoryRouter>
	);
}
