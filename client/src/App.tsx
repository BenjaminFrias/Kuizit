import { ChevronRightIcon } from 'lucide-react';
import './App.css';
import BlurryShape from './components/blurryShape';
import { Button } from '@/components/ui/button';

function App() {
	return (
		<>
			<div className="min-h-screen min-w-screen p-8 flex flex-col items-center justify-center overflow-hidden bg-custom-gray">
				<div className="absolute flex flex-col items-center w-full h-full z-999">
					<h2 className="absolute top-10 center text-white text-2xl">
						Quizify
					</h2>

					<div className="flex flex-col items-center justify-center flex-grow mt-14">
						<h1
							className="
						font-primary font-medium text-[#f8f8f7e1] text-shadow-title text-center w-full text-[6.5rem] tracking-wide max-w-200"
						>
							Instantly create quizzes with AI
						</h1>

						<p className="font-primary text-white text-lg text-center max-w-120 mt-8">
							Turn any text, YouTube video, or content into an interactive quiz
							in seconds!
						</p>
						<Button className="mt-12" size="lg" variant="green">
							Generate quiz
							<ChevronRightIcon />
						</Button>

						{/* Blurry shapes for blurry effect on h1 */}
						<div className="absolute -top-100 -left-110 w-200 h-200 opacity-80">
							<BlurryShape />
						</div>

						<div className="absolute -bottom-0 -top-10 -right-190 w-300 h-300">
							<BlurryShape />
						</div>
					</div>
				</div>
				<div className="z-1">
					<div className="absolute -bottom-0 -top-10 -right-100 w-300 h-300 -z-2">
						<BlurryShape />
					</div>
					<div className="absolute -top-100 -left-90 w-200 h-200 opacity-80 -z-2">
						<BlurryShape />
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
