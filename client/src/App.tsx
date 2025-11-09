import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import './App.css';
import type { QuizData, QuizResult } from './types';
import type { QuizSettings } from './schemas/QuizSchema';
import { useTranslation } from './hooks/useTranslation';
import { useQuizApi } from './hooks/useQuizApi';
import { Routes, Route, useNavigate } from 'react-router';
import ProtectedRoutes from './utils/ProtectedRoutes';
import QuizLoadingPage from './pages/QuizLoadingPage';

const HomePage = lazy(() => import('./pages/HomePage'));
const InputPage = lazy(() => import('./pages/InputPage'));
const QuizPage = lazy(() => import('./pages/Quiz'));
const QuizResultsPage = lazy(() => import('./pages/QuizResultsPage'));
const QuizReviewPage = lazy(() => import('./pages/QuizReviewPage'));
const Page404 = lazy(() => import('./pages/404'));

const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
	quizInputType: 'prompt',
	content: undefined,
	numQuestions: 10,
	difficulty: 'easy',
	optionTypes: 'multiple_choice',
};

function App() {
	const [quizData, setQuizData] = useState<QuizData>([]);
	const [isQuizLoading, setIsQuizLoading] = useState(false);
	const [quizResultData, setQuizResultData] = useState<QuizResult>([]);
	const t = useTranslation();
	const [quizSettings, setQuizSettings] = useState<QuizSettings>({
		...DEFAULT_QUIZ_SETTINGS,
	});
	const { generateQuiz, apiError, setApiError } = useQuizApi();
	const navigate = useNavigate();

	const quizRouteAccess = useMemo(() => {
		return quizData && quizData.length > 0;
	}, [quizData]);

	const quizResultsRouteAccess = useMemo(() => {
		return quizResultData && quizResultData.length > 0;
	}, [quizResultData]);

	const handleGenerateQuiz = async (newSettings: QuizSettings) => {
		setApiError(null);
		setQuizSettings({ ...newSettings });

		const inputQuizData: QuizSettings = {
			...newSettings,
		};

		try {
			setIsQuizLoading(true);

			const generatedQuizData = await generateQuiz(inputQuizData);

			// Fallback for empty generated quiz data
			if (!generatedQuizData?.length) {
				throw new Error(t.pleaseTryAgain);
			}

			setQuizData(generatedQuizData);
			navigate('/quiz');
		} catch (error: unknown) {
			const baseErrorMsg =
				apiError || (error instanceof Error ? error.message : t.unexpectedErr);

			setApiError(baseErrorMsg);
			navigate('/input');
		} finally {
			setIsQuizLoading(false);
		}
	};

	const handleOptionSubmittion = (quizResults: QuizResult) => {
		setQuizResultData(quizResults);
	};

	const resetQuizStates = useCallback(() => {
		setQuizSettings({ ...DEFAULT_QUIZ_SETTINGS });
		setQuizResultData([]);
	}, [setQuizSettings, setQuizResultData]);

	if (isQuizLoading) return <QuizLoadingPage />;

	return (
		<Suspense fallback={null}>
			<Routes>
				<Route path="/" element={<HomePage />} />

				<Route
					path="/input"
					element={
						<InputPage
							onQuizSubmit={handleGenerateQuiz}
							initialSettings={quizSettings}
							setApiError={setApiError}
							apiError={apiError}
							resetQuizStates={resetQuizStates}
						/>
					}
				/>

				<Route element={<ProtectedRoutes canAccess={quizRouteAccess} />}>
					<Route
						path="/quiz"
						element={
							<QuizPage
								quizData={quizData}
								onQuizSubmittion={handleOptionSubmittion}
							/>
						}
					/>

					<Route
						element={<ProtectedRoutes canAccess={quizResultsRouteAccess} />}
					>
						<Route
							path="/results"
							element={<QuizResultsPage quizResults={quizResultData} />}
						/>

						<Route
							path="/review"
							element={
								<QuizReviewPage
									quizData={quizData}
									quizResults={quizResultData}
								/>
							}
						/>
					</Route>
				</Route>

				<Route path="*" element={<Page404 />} />
			</Routes>
		</Suspense>
	);
}

export default App;
