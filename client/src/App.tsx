import { useEffect, useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import Inputpage from './pages/InputPage';
import LoadingAnimation from './pages/QuizLoadingPage';
import validateQuizContent from './validation/inputValidation';
import type {
	AnswerOptions,
	Page,
	NumberQuestions,
	QuizRequestBody,
	InputOption,
	Difficulty,
	QuizData,
	QuizResult,
} from './types';
import { QuizPage } from './pages/Quiz';
import { QuizResultsPage } from './pages/QuizResultsPage';
import { QuizReviewPage } from './pages/QuizReviewPage';
import { useTranslation } from './hooks/useTranslation';

const API_BASE_URL: string = import.meta.env.VITE_API_URL;

function App() {
	const [currentPage, setCurrentPage] = useState('home');
	const [quizData, setQuizData] = useState<QuizData>([]);
	const [isQuizLoading, setIsQuizLoading] = useState(false);
	const [quizContent, setQuizContent] = useState('');
	const [quizInputType, setSelectedInputType] = useState<InputOption>('prompt');
	const [quizDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
	const [quizAnswerOptions, setQuizAnswerOptions] =
		useState<AnswerOptions>('multiple_choice');
	const [quizNumberQuestions, setNumberQuestions] =
		useState<NumberQuestions>(10);
	const [files, setFiles] = useState<File[]>([]);
	const [quizResultData, setQuizResultData] = useState<QuizResult>([]);
	const [apiError, setApiError] = useState<string | null>(null);

	const t = useTranslation();

	const handleContentChange = (newContent: string) => {
		setQuizContent(newContent);
	};

	const handleInputTypeChange = (inputTypeName: InputOption) => {
		setSelectedInputType(inputTypeName);
	};

	const handleDifficultyChange = (diffName: Difficulty) => {
		setSelectedDifficulty(diffName);
	};

	const handleAnswerOptionsChange = (option: AnswerOptions) => {
		setQuizAnswerOptions(option);
	};

	const handleNumberQuestionsChange = (numberOfQuestions: NumberQuestions) => {
		setNumberQuestions(numberOfQuestions);
	};

	const handleGenerateQuiz = async () => {
		setApiError(null);
		const contentToSend = quizInputType === 'file' ? files[0] : quizContent;

		const inputQuizData: QuizRequestBody = {
			quizInputType: quizInputType,
			content: contentToSend,
			numQuestions: quizNumberQuestions,
			difficulty: quizDifficulty,
			optionTypes: quizAnswerOptions,
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
			const generatedQuizData = await getGeneratedQuiz(inputQuizData);
			setQuizData(generatedQuizData);
			handlePageChange('quiz');
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error('Error while getting quiz from API: ', error.message);
				setApiError(`${error.message}. ${t.pleaseTryAgain}`);
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
		setQuizContent('');
		setSelectedInputType('prompt');
		setSelectedDifficulty('easy');
		setQuizAnswerOptions('multiple_choice');
		setNumberQuestions(10);
		setFiles([]);
		setQuizData([]);
		setQuizResultData([]);
	};

	useEffect(() => {
		if (currentPage === 'input' || currentPage === 'home') {
			resetQuizStates();
		}
	}, [currentPage]);

	if (isQuizLoading) {
		return <LoadingAnimation />;
	}

	const renderPage = () => {
		switch (currentPage) {
			case 'home':
				return <HomePage onPageChange={handlePageChange} />;
			case 'input':
				return (
					<Inputpage
						onPageChange={handlePageChange}
						onInputTypeChange={handleInputTypeChange}
						onDifficultyChange={handleDifficultyChange}
						onAnswerOptionsChange={handleAnswerOptionsChange}
						onNumberQuestionsChange={handleNumberQuestionsChange}
						onContentChange={handleContentChange}
						onQuizSubmit={handleGenerateQuiz}
						setFiles={setFiles}
						setApiError={setApiError}
						quizFiles={files}
						quizInputType={quizInputType}
						quizContent={quizContent}
						quizDifficulty={quizDifficulty}
						quizAnswerOptions={quizAnswerOptions}
						quizNumberQuestions={quizNumberQuestions}
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

async function getGeneratedQuiz(quizData: QuizRequestBody) {
	let response;

	if (quizData.quizInputType === 'file') {
		const formData = new FormData();
		formData.append('quizInputType', quizData.quizInputType);
		formData.append('numQuestions', quizData.numQuestions.toString());
		formData.append('difficulty', quizData.difficulty);
		formData.append('optionTypes', quizData.optionTypes);
		formData.append('quizFile', quizData.content as File);

		response = await fetch(`${API_BASE_URL}/api/generate-quiz`, {
			method: 'POST',
			body: formData,
		});
	} else {
		response = await fetch(`${API_BASE_URL}/api/generate-quiz`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify(quizData),
		});
	}

	if (response.ok) {
		const result = await response.json();
		return result;
	} else {
		const errorText = await response.text();
		console.error('API Error:', errorText);
		throw new Error(errorText);
	}
}

export default App;
