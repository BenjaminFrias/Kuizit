import { useCallback, useEffect, useState } from 'react';
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
	content: '',
	numQuestions: 10,
	difficulty: 'easy',
	optionTypes: 'multiple_choice',
};

function App() {
	const [currentPage, setCurrentPage] = useState<Page>('home');
	const [quizData, setQuizData] = useState<QuizData>([]);
	const [isQuizLoading, setIsQuizLoading] = useState(false);
	const [files, setFiles] = useState<File[]>([]);
	const [quizResultData, setQuizResultData] = useState<QuizResult>([]);
	const t = useTranslation();
	const [quizSettings, setQuizSettings] = useState<QuizSettings>({
		...DEFAULT_QUIZ_SETTINGS,
	});

	const { generateQuiz, apiError, setApiError } = useQuizApi();

	const handleGenerateQuiz = async (newSettings: QuizSettings) => {
		setApiError(null);
		setQuizSettings(newSettings);

		const contentToSend =
			newSettings.quizInputType === 'file' ? files[0] : newSettings.content;

		const inputQuizData: QuizSettings = {
			...newSettings,
			content: contentToSend,
		};

		try {
			setIsQuizLoading(true);

			const generatedQuizData = await generateQuiz(inputQuizData);
			setQuizData(generatedQuizData);
			handlePageChange('quiz');
		} catch (error: unknown) {
			const errorMessage =
				apiError || (error instanceof Error ? error.message : t.unexpectedErr);

			console.error('Error while fetching quiz in App: ', errorMessage);

			let finalErrorMessage = `${t.unexpectedErr}, ${t.pleaseTryAgain}.`;

			if (error instanceof Error) {
				finalErrorMessage = `${error.message}, ${t.pleaseTryAgain}.`;
			} else if (apiError) {
				finalErrorMessage = `${t.unexpectedErr}, ${t.pleaseTryAgain}.`;
			}

			setApiError(finalErrorMessage);
			handlePageChange('input');
		} finally {
			setIsQuizLoading(false);
		}
	};

	const handleOptionSubmittion = (quizData: QuizResult) => {
		setQuizResultData(quizData);
	};

	const handlePageChange = (pageName: Page) => {
		setCurrentPage(pageName);
	};

	const resetQuizStates = useCallback(() => {
		setQuizSettings({ ...DEFAULT_QUIZ_SETTINGS });
		setFiles([]);
		setQuizResultData([]);
	}, [setFiles, setQuizSettings, setQuizResultData]);

	useEffect(() => {
		if (currentPage === 'input') {
			resetQuizStates();
		}
	}, [currentPage, resetQuizStates]);

	if (isQuizLoading) {
		return <QuizLoadingPage />;
	}

	const renderPage = () => {
		switch (currentPage) {
			case 'home':
				return <HomePage onPageChange={handlePageChange} />;
			case 'input':
				return (
					<Inputpage
						onQuizSubmit={handleGenerateQuiz}
						initialSettings={quizSettings}
						setFiles={setFiles}
						setApiError={setApiError}
						quizFiles={files}
						apiError={apiError}
					/>
				);
			case 'quiz':
				return (
					<QuizPage
						onPageChange={handlePageChange}
						quizData={quizData}
						quizResultData={quizResultData}
						onAnswerSubmittion={handleOptionSubmittion}
					/>
				);
			case 'results':
				return (
					<QuizResultsPage
						quizResults={quizResultData}
						onPageChange={handlePageChange}
					/>
				);
			case 'review':
				return (
					<QuizReviewPage
						quizData={quizData}
						quizResults={quizResultData}
						onPageChange={handlePageChange}
					/>
				);
			default:
				return <HomePage onPageChange={handlePageChange} />;
		}
	};

	return renderPage();
}

export default App;
