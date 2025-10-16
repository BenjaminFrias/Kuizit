import { useCallback, useEffect, useState, type ReactElement } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import Inputpage from './pages/InputPage';
import QuizLoadingPage from './pages/QuizLoadingPage';
import type { Page, QuizSettings, QuizData, QuizResult } from './types';
import { QuizPage } from './pages/Quiz';
import { QuizResultsPage } from './pages/QuizResultsPage';
import { QuizReviewPage } from './pages/QuizReviewPage';
import { useTranslation } from './hooks/useTranslation';
import { useQuizApi } from './hooks/useQuizApi';

const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
	quizInputType: 'prompt',
	content: undefined,
	numQuestions: 10,
	difficulty: 'easy',
	optionTypes: 'multiple_choice',
};

function App() {
	const [currentPage, setCurrentPage] = useState<Page>('home');
	const [quizData, setQuizData] = useState<QuizData>([]);
	const [isQuizLoading, setIsQuizLoading] = useState(false);
	const [quizResultData, setQuizResultData] = useState<QuizResult>([]);
	const t = useTranslation();
	const [quizSettings, setQuizSettings] = useState<QuizSettings>({
		...DEFAULT_QUIZ_SETTINGS,
	});

	const { generateQuiz, apiError, setApiError } = useQuizApi();

	const handleGenerateQuiz = async (newSettings: QuizSettings) => {
		setApiError(null);
		setQuizSettings(newSettings);

		const inputQuizData: QuizSettings = {
			...newSettings,
		};

		try {
			setIsQuizLoading(true);

			const generatedQuizData = await generateQuiz(inputQuizData);
			setQuizData(generatedQuizData);
			handlePageChange('quiz');
		} catch (error: unknown) {
			const baseErrorMsg =
				apiError || (error instanceof Error ? error.message : t.unexpectedErr);

			const finalErrorMessage = `${baseErrorMsg}, ${t.pleaseTryAgain}`;

			setApiError(finalErrorMessage);
			handlePageChange('input');
		} finally {
			setIsQuizLoading(false);
		}
	};

	const handleOptionSubmittion = (quizResults: QuizResult) => {
		setQuizResultData(quizResults);
	};

	const handlePageChange = (pageName: Page) => {
		setCurrentPage(pageName);
	};

	const resetQuizStates = useCallback(() => {
		setQuizSettings({ ...DEFAULT_QUIZ_SETTINGS });
		setQuizResultData([]);
	}, [setQuizSettings, setQuizResultData]);

	useEffect(() => {
		if (currentPage === 'input') {
			resetQuizStates();
		}
	}, [currentPage, resetQuizStates]);

	if (isQuizLoading) {
		return <QuizLoadingPage />;
	}

	type PageComponentsMap = Record<Page, ReactElement>;
	const pageComponents: PageComponentsMap = {
		home: <HomePage onPageChange={handlePageChange} />,
		input: (
			<Inputpage
				onQuizSubmit={handleGenerateQuiz}
				initialSettings={quizSettings}
				setApiError={setApiError}
				apiError={apiError}
			/>
		),
		quiz: (
			<QuizPage
				onPageChange={handlePageChange}
				quizData={quizData}
				onQuizSubmittion={handleOptionSubmittion}
			/>
		),
		results: (
			<QuizResultsPage
				quizResults={quizResultData}
				onPageChange={handlePageChange}
			/>
		),
		review: (
			<QuizReviewPage
				quizData={quizData}
				quizResults={quizResultData}
				onPageChange={handlePageChange}
			/>
		),
	};

	const renderPage = () => {
		return pageComponents[currentPage];
	};

	return renderPage();
}

export default App;
