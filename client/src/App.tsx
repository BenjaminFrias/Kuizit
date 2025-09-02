import './App.css';
import BlurryShape from './components/blurryShape';

function App() {
	return (
		<>
			<div className="min-h-screen min-w-screen p-8 flex flex-col items-center justify-center bg-custom-gray overflow-hidden">
				<div className="flex flex-col items-center justify-center z-3">
					<h2 className=" text-white text-2xl">Quizify</h2>
					<h1 className="font-primary font-medium text-white text-center w-full text-8xl max-w-200">
						Instantly create quizzes with AI
					</h1>
					<p className="font-primary text-white text-lg text-center max-w-120 mt-8">
						Turn any text, YouTube video, or content into an interactive quiz in
						seconds!
					</p>
				</div>
				<div className="absolute -bottom-0 -top-10 -right-100 w-300 h-300">
					<BlurryShape />
				</div>
				<div className="absolute -top-100 -left-90 w-200 h-200 opacity-70">
					<BlurryShape />
				</div>
			</div>
		</>
	);
}

export default App;
