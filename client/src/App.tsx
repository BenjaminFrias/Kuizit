import { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import Inputpage from './pages/InputPage';
import type {
	answerOptionsType,
	pageOptionsType,
	numberQuestionsType,
} from './types';

function App() {
	const [currentPage, setCurrentPage] = useState('home');
	const [selectedInputType, setSelectedInputType] = useState(1);
	const [selectedDifficulty, setSelectedDifficulty] = useState(1);
	const [answerOption, setAnswerOption] =
		useState<answerOptionsType>('multiple_choice');
	const [numberQuestions, setNumberQuestions] =
		useState<numberQuestionsType>(10);

	const handleInputTypeChange = (id: number) => {
		setSelectedInputType(id);
	};

	const handleDifficultyChange = (id: number) => {
		setSelectedDifficulty(id);
	};

	const handleAnswerOptionChange = (option: answerOptionsType) => {
		setAnswerOption(option);
	};

	const handleNumberQuestionsChange = (
		numberOfQuestions: numberQuestionsType
	) => {
		setNumberQuestions(numberOfQuestions);
	};

	const handlePageChange = (pageName: pageOptionsType) => {
		setCurrentPage(pageName);
	};

	switch (currentPage) {
		case 'home':
			return <HomePage onPageChange={handlePageChange} />;
		case 'input':
			return (
				<Inputpage
					onPageChange={handlePageChange}
					onInputTypeChange={handleInputTypeChange}
					onDifficultyChange={handleDifficultyChange}
					onAnswerOptionChange={handleAnswerOptionChange}
					onNumberQuestionsChange={handleNumberQuestionsChange}
					inputType={selectedInputType}
					difficulty={selectedDifficulty}
					answerOption={answerOption}
					numberQuestions={numberQuestions}
				/>
			);
		default:
			return <HomePage onPageChange={handlePageChange} />;
	}
}

export default App;
