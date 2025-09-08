import BlurryShape from '@/components/decorative/BlurryShape';
import MagicTextIllustration from '@/components/decorative/MagicTextIllustration';
import OptionsCheckIllustration from '@/components/decorative/OptionsCheckIllustration';
import { Button } from '@/components/ui/button';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function HomePage() {
	return (
		<div className="min-h-screen min-w-screen p-8 flex flex-col items-center justify-center overflow-hidden bg-custom-gray">
			<div className="absolute flex flex-col items-center w-full h-full z-999">
				<h2 className="absolute top-10 center font-logo text-white text-lg uppercase">
					Kuizit
				</h2>

				<div className="flex flex-col items-center justify-center flex-grow mt-14">
					<h1
						className="
						font-primary font-medium text-white text-shadow-title text-center w-full text-[6.5rem] tracking-wide max-w-200"
					>
						Instantly create quizzes with AI
					</h1>

					<p className="font-primary text-white text-lg text-center max-w-120 mt-8">
						Turn any text, YouTube video, or content into an interactive quiz in
						seconds!
					</p>
					<Button className="mt-12" size="lg" variant="green">
						Generate quiz
						<FontAwesomeIcon icon={faWandMagicSparkles} />
					</Button>

					<div className="absolute -bottom-20 left-30 -rotate-12">
						<OptionsCheckIllustration />
					</div>

					<div className="absolute -bottom-20 right-30 rotate-12 z-2">
						<MagicTextIllustration />
					</div>

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
	);
}
