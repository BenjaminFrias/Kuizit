import { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import Inputpage from './pages/InputPage';
import LoadingAnimation from './pages/QuizLoadingPage';
import type {
	AnswerOptions,
	Page,
	NumberQuestions,
	QuizRequestBody,
	InputOption,
	Difficulty,
} from './types';

function App() {
	const [currentPage, setCurrentPage] = useState('home');
	const [isQuizLoading, setIsQuizLoading] = useState(false);
	const [quizContent, setQuizContent] = useState('');
	const [quizInputType, setSelectedInputType] = useState<InputOption>('prompt');
	const [quizDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
	const [quizAnswerOptions, setQuizAnswerOptions] =
		useState<AnswerOptions>('multiple_choice');
	const [quizNumberQuestions, setNumberQuestions] =
		useState<NumberQuestions>(10);
	const [files, setFiles] = useState<File[]>([]);

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
		setIsQuizLoading(true);
		const contentToSend = quizInputType === 'file' ? files[0] : quizContent;

		const quizData: QuizRequestBody = {
			quizInputType: quizInputType,
			content: contentToSend,
			numQuestions: quizNumberQuestions,
			difficulty: quizDifficulty,
			optionTypes: quizAnswerOptions,
		};

		try {
			const generatedQuizData = await getGeneratedQuiz(quizData);
			console.log(generatedQuizData);

			handlePageChange('home');
		} catch (error) {
			console.log('Error bro sorry: ', error);
		} finally {
			setIsQuizLoading(false);
		}
	};

	const handlePageChange = (pageName: Page) => {
		setCurrentPage(pageName);
	};

	if (isQuizLoading) {
		return <LoadingAnimation />;
	}

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
					quizFiles={files}
					quizInputType={quizInputType}
					quizContent={quizContent}
					quizDifficulty={quizDifficulty}
					quizAnswerOptions={quizAnswerOptions}
					quizNumberQuestions={quizNumberQuestions}
				/>
			);
		default:
			return <HomePage onPageChange={handlePageChange} />;
	}
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

		response = await fetch('http://localhost:3001/api/generate-quiz', {
			method: 'POST',
			body: formData,
		});
	} else {
		response = await fetch('http://localhost:3001/api/generate-quiz', {
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
		throw new Error('Failed to generate quiz. Please try again.');
	}
}

export default App;
