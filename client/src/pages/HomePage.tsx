import BlurryShape from '@/components/decorative/BlurryShape';
import MagicTextIllustration from '@/components/decorative/MagicTextIllustration';
import OptionsCheckIllustration from '@/components/decorative/OptionsCheckIllustration';
import { Button } from '@/components/ui/button';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '@/hooks/useTranslation';
import Logo from '@/components/Logo';
import { Link } from 'react-router';

export default function HomePage() {
	const t = useTranslation();

	return (
		<div
			className="relative min-h-screen min-w-screen p-6 md:p-8 flex flex-col items-center justify-center overflow-hidden bg-custom-gray"
			data-testid="home-page"
		>
			<div className="absolute flex flex-col items-center w-full h-full z-999">
				<div className="flex justify-center items-center gap-2 shortFadeIn absolute z-999 top-5 center">
					<Logo width="40" height="40" />
					<h2 className=" font-primary text-white font-extrabold text-2xl uppercase">
						Kuizit
					</h2>
				</div>

				<div className="flex flex-col items-center justify-center flex-grow px-8 md:mt-14">
					<h1
						className="
						shortFadeIn font-primary font-medium text-white text-shadow-title text-center w-full text-6xl
						md:text-[6.5rem] mt-3 tracking-wide max-w-200"
					>
						{t.titleHome}
					</h1>

					<p className="shortFadeIn font-primary text-white text-lg text-center md:max-w-120 mt-8 z-999 md:z-1">
						{t.taglineHome}
					</p>
					<Link to="/input">
						<Button
							className="shortFadeIn mt-12 z-999"
							size="lg"
							variant="green"
						>
							{t.generateQuizBtn}
							<FontAwesomeIcon icon={faWandMagicSparkles} />
						</Button>
					</Link>

					<div
						className="longFadeIn absolute -bottom-30 left-10 w-35 h-60 lg:w-65 lg:h-80 -rotate-25
					md:w-55 md:h-70 md: md:-left-5 md:-rotate-12 lg:left-30 z-4"
					>
						<OptionsCheckIllustration />
					</div>

					<div
						className="longFadeIn absolute -bottom-30 right-10 w-35 h-60 rotate-25
					md:w-55 md:h-70 md:right-2 lg:right-30 lg:w-65 lg:h-80 md:rotate-12 z-4"
					>
						<MagicTextIllustration />
					</div>

					{/* Blurry shapes for blurry opacity effect on h1 */}
					<div
						className="absolute -top-50 w-90 h-90 -left-25 md:w-140
						md:h-140 md:-top-50 md:-left-70 lg:-top-100 lg:-left-110 lg:w-200 lg:h-200 opacity-80 z-3"
					>
						<BlurryShape />
					</div>

					<div
						className="absolute -bottom-45 -right-12 w-120 h-120 md:w-240 md:h-240 md:-bottom-0
						md:-top-10 md:-right-190 lg:w-300 lg:h-300 z-3"
					>
						<BlurryShape />
					</div>
				</div>
			</div>
			<div className="z-1">
				<div className="absolute -bottom-25 -right-32 w-120 h-120 md:-top-10 md:-right-100 md:w-300 md:h-300 -z-2">
					<BlurryShape />
				</div>
				<div className="absolute -top-55 w-90 h-90 -left-25 md:-top-100 md:-left-90 md:w-200 md:h-200 opacity-80 -z-2">
					<BlurryShape />
				</div>
			</div>
		</div>
	);
}
