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
	QuizData,
	QuizResult,
} from './types';
import { QuizPage } from './pages/Quiz';

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

		const inputQuizData: QuizRequestBody = {
			quizInputType: quizInputType,
			content: contentToSend,
			numQuestions: quizNumberQuestions,
			difficulty: quizDifficulty,
			optionTypes: quizAnswerOptions,
		};

		try {
			const generatedQuizData = await getGeneratedQuiz(inputQuizData);
			setQuizData(generatedQuizData);
			handlePageChange('quiz');
		} catch (error) {
			console.log('Error bro sorry: ', error);
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

	if (isQuizLoading) {
		return <LoadingAnimation />;
	}

	// mock data
	const quizResultMock = [
		{
			isCorrect: false,
			selectedIndex: 0,
		},
		{
			isCorrect: false,
			selectedIndex: 1,
		},
		{
			isCorrect: true,
			selectedIndex: 1,
		},
		{
			isCorrect: false,
			selectedIndex: 2,
		},
		{
			isCorrect: false,
			selectedIndex: 3,
		},
	];

	const quizMock = [
		{
			type: 'multiple_choice',
			question: 'What is Typescript?',
			correctAnswerIndex: 1,
			options: [
				{
					optionText: 'A new programming language',
					answer: false,
				},
				{
					optionText: 'A superset of JavaScript',
					answer: true,
				},
				{
					optionText: 'A database language',
					answer: false,
				},
				{
					optionText: 'A styling language',
					answer: false,
				},
			],
			explanation:
				'TypeScript extends JavaScript by adding static type definitions, meaning all valid JavaScript code is also valid TypeScript code. It builds upon JavaScript, adding new features.',
		},
		{
			type: 'multiple_choice',
			question: 'Which company developed TypeScript?',
			correctAnswerIndex: 2,
			options: [
				{
					optionText: 'Google',
					answer: false,
				},
				{
					optionText: 'Apple',
					answer: false,
				},
				{
					optionText: 'Microsoft',
					answer: true,
				},
				{
					optionText: 'Facebook',
					answer: false,
				},
			],
			explanation:
				'TypeScript was developed by Microsoft and first released in 2012. It was designed to improve JavaScript development for large-scale applications by providing static typing.',
		},
		{
			type: 'multiple_choice',
			question: 'What key feature does TypeScript add to JavaScript?',
			correctAnswerIndex: 1,
			options: [
				{
					optionText: 'Dynamic typing',
					answer: false,
				},
				{
					optionText: 'Static typing',
					answer: true,
				},
				{
					optionText: 'No typing',
					answer: false,
				},
				{
					optionText: 'Optional callbacks',
					answer: false,
				},
			],
			explanation:
				'Static typing allows developers to define types for variables, function parameters, and return values. This helps catch potential type-related errors during development, before the code runs.',
		},
		{
			type: 'multiple_choice',
			question: 'What file extension is typically used for TypeScript files?',
			correctAnswerIndex: 1,
			options: [
				{
					optionText: '.js',
					answer: false,
				},
				{
					optionText: '.ts',
					answer: true,
				},
				{
					optionText: '.html',
					answer: false,
				},
				{
					optionText: '.css',
					answer: false,
				},
			],
			explanation:
				'TypeScript source code files are saved with the .ts extension. These files are then compiled into standard JavaScript files, which have the familiar .js extension.',
		},
		{
			type: 'multiple_choice',
			question: 'What process converts TypeScript code into JavaScript?',
			correctAnswerIndex: 1,
			options: [
				{
					optionText: 'Interpreting',
					answer: false,
				},
				{
					optionText: 'Compiling',
					answer: true,
				},
				{
					optionText: 'Debugging',
					answer: false,
				},
				{
					optionText: 'Executing',
					answer: false,
				},
			],
			explanation:
				'TypeScript code needs to be compiled into plain JavaScript before it can be run by web browsers or Node.js, as these environments only natively understand JavaScript.',
		},
		{
			type: 'multiple_choice',
			question:
				'Can valid JavaScript code be used directly in a TypeScript file?',
			correctAnswerIndex: 2,
			options: [
				{
					optionText: 'No, never',
					answer: false,
				},
				{
					optionText: 'Only with special comments',
					answer: false,
				},
				{
					optionText: 'Yes, always',
					answer: true,
				},
				{
					optionText: "Only if it's ES5",
					answer: false,
				},
			],
			explanation:
				'Since TypeScript is a superset of JavaScript, any valid JavaScript code is also valid TypeScript code. This means you can integrate existing JavaScript projects easily into a TypeScript workflow.',
		},
		{
			type: 'multiple_choice',
			question: "What is the primary purpose of an 'interface' in TypeScript?",
			correctAnswerIndex: 2,
			options: [
				{
					optionText: 'To define visual styles',
					answer: false,
				},
				{
					optionText: 'To create new instances of objects',
					answer: false,
				},
				{
					optionText: 'To define the shape of an object',
					answer: true,
				},
				{
					optionText: 'To handle user input',
					answer: false,
				},
			],
			explanation:
				'Interfaces in TypeScript are used to define contracts for the shape of objects. They ensure that objects adhere to a specific structure, providing type-checking for object properties and methods.',
		},
		{
			type: 'multiple_choice',
			question:
				'Which syntax correctly declares a variable `name` as a `string`?',
			correctAnswerIndex: 0,
			options: [
				{
					optionText: 'let name: string;',
					answer: true,
				},
				{
					optionText: 'name = string;',
					answer: false,
				},
				{
					optionText: 'string name;',
					answer: false,
				},
				{
					optionText: 'name as string;',
					answer: false,
				},
			],
			explanation:
				"In TypeScript, you declare a variable's type using a colon followed by the type name after the variable identifier, such as `let myVariable: TypeName;`. This is called a type annotation.",
		},
		{
			type: 'multiple_choice',
			question:
				'What is the resulting output file type after TypeScript compilation?',
			correctAnswerIndex: 2,
			options: [
				{
					optionText: '.jsx',
					answer: false,
				},
				{
					optionText: '.html',
					answer: false,
				},
				{
					optionText: '.js',
					answer: true,
				},
				{
					optionText: '.d.ts',
					answer: false,
				},
			],
			explanation:
				'The TypeScript compiler (tsc) transpiles TypeScript code (.ts files) into standard JavaScript (.js files). These JavaScript files can then be executed by any JavaScript engine.',
		},
		{
			type: 'multiple_choice',
			question:
				'Does TypeScript support object-oriented features like classes?',
			correctAnswerIndex: 1,
			options: [
				{
					optionText: 'No, only interfaces',
					answer: false,
				},
				{
					optionText: 'Yes, fully',
					answer: true,
				},
				{
					optionText: 'Partially, only for types',
					answer: false,
				},
				{
					optionText: 'Only in older versions',
					answer: false,
				},
			],
			explanation:
				'TypeScript fully supports object-oriented programming concepts, including classes, interfaces, inheritance, and access modifiers. This makes it a powerful language for building scalable applications.',
		},
	];

	console.log(quizData);
	console.log(quizResultMock);

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
		case 'quiz':
			return (
				<QuizPage
					onPageChange={handlePageChange}
					quizData={quizMock}
					quizResultData={quizResultData}
					onAnswerSubmittion={handleOptionSubmittion}
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
