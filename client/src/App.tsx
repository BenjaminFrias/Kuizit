import { useEffect, useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import Inputpage from './pages/InputPage';
import QuizLoadingPage from './pages/QuizLoadingPage';
import validateQuizContent from './validation/inputValidation';
import type { Page, QuizSettings, QuizData, QuizResult } from './types';
import { QuizPage } from './pages/Quiz';
import { QuizResultsPage } from './pages/QuizResultsPage';
import { QuizReviewPage } from './pages/QuizReviewPage';
import { useTranslation } from './hooks/useTranslation';
import { useQuizApi } from './hooks/useQuizApi';

function App() {
	const [currentPage, setCurrentPage] = useState('home');
	const [quizData, setQuizData] = useState<QuizData>([]);
	const [isQuizLoading, setIsQuizLoading] = useState(false);
	const [files, setFiles] = useState<File[]>([]);
	const [quizResultData, setQuizResultData] = useState<QuizResult>([]);
	const t = useTranslation();
	const [quizSettings, setQuizSettings] = useState<QuizSettings>({
		quizInputType: 'prompt',
		content: '',
		numQuestions: 10,
		difficulty: 'easy',
		optionTypes: 'multiple_choice',
	});

	const handleSettingsChange = <K extends keyof QuizSettings>(
		key: K,
		value: QuizSettings[K]
	) => {
		setQuizSettings((prevSettings) => ({
			...prevSettings,
			[key]: value,
		}));
	};

	const { generateQuiz, apiError, setApiError } = useQuizApi();

	const handleGenerateQuiz = async () => {
		setApiError(null);
		const contentToSend =
			quizSettings.quizInputType === 'file' ? files[0] : quizSettings.content;

		const inputQuizData: QuizSettings = {
			...quizSettings,
			content: contentToSend,
		};

		try {
			const validationMessages = {
				fileNotFoundErr: t.fileNotFoundErr,
				fileTypeErr: t.fileTypeErr,
				invalidPromptErr: t.invalidPromptErr,
				invalidYoutubeLinkErr: t.invalidYoutubeLinkErr,
			};

			validateQuizContent({
				quizData: inputQuizData,
				quizFile: files,
				validationMessages,
			}); // throw error when invalid data

			setIsQuizLoading(true);

			const generatedQuizData = await generateQuiz(inputQuizData);
			setQuizData(generatedQuizData);
			handlePageChange('quiz');
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error('Error while getting quiz from API: ', error.message);
				setApiError(`${error.message}. ${t.pleaseTryAgain}.`);
			} else {
				console.error('An unknown error occurred:', error);
				setApiError(`${t.unexpectedErr}. ${t.pleaseTryAgain}.`);
			}
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

	const resetQuizStates = () => {
		setFiles([]);
		setQuizSettings({
			quizInputType: 'prompt',
			content: '',
			numQuestions: 10,
			difficulty: 'easy',
			optionTypes: 'multiple_choice',
		});
		setQuizData([]);
		setQuizResultData([]);
	};

	useEffect(() => {
		if (currentPage === 'input' || currentPage === 'home') {
			resetQuizStates();
		}
	}, [currentPage]);

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
						onPageChange={handlePageChange}
						onQuizSubmit={handleGenerateQuiz}
						onQuizSettingsChange={handleSettingsChange}
						quizSettings={quizSettings}
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
