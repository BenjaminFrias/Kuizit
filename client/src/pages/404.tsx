import BlurryShape from '@/components/decorative/BlurryShape';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router';

export default function Page404() {
	const t = useTranslation();
	return (
		<div
			className="relative min-h-screen min-w-screen p-6 md:p-8 flex flex-col items-center justify-center overflow-hidden bg-custom-gray"
			data-testid="home-page"
		>
			<div className="absolute flex flex-col items-center w-full h-full z-999">
				<div className="flex justify-center items-center gap-2 shortFadeIn absolute z-999 top-5 center">
					<Logo width="40" height="40" />
				</div>

				<div className="flex flex-col items-center justify-center flex-grow px-8 md:mt-14">
					<h1
						className="
						shortFadeIn font-primary font-medium text-white text-shadow-title text-center w-full text-6xl
						md:text-3 mt-3 tracking-wide max-w-200"
					>
						{t.title404}
					</h1>
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
