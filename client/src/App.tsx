import { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import Inputpage from './pages/InputPage';
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

	const handlePageChange = (pageName: Page) => {
		setCurrentPage(pageName);
	};

	const quizData: QuizRequestBody = {
		quizInputType: quizInputType,
		content: files.length > 0 ? files : quizContent,
		numQuestions: quizNumberQuestions,
		difficulty: quizDifficulty,
		optionTypes: quizAnswerOptions,
	};

	console.log(quizData);

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

export default App;
