import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function MagicTextIllustration() {
	return (
		<div
			className="w-full h-full flex flex-col gap-8 p-8 bg-black/70 rounded-4xl
		drop-shadow-[13px_11px_8px_rgba(0,0,0,1)] inset-shadow-md inset-shadow-primary/50"
			data-testid="magic-text-illustration"
		>
			<div className="flex gap-4 justify-center items-center">
				<FontAwesomeIcon className="text-[#caebcc]/80 text-4xl" icon={faStar} />
				<div className="w-full h-5 bg-primary rounded-full"></div>
			</div>
			<div>
				<div className="w-full h-5 bg-primary rounded-full"></div>
			</div>
			<div className="flex gap-4 justify-center items-center">
				<div className="w-full h-5 bg-primary rounded-full"></div>
				<FontAwesomeIcon className="text-[#caebcc]/80 text-4xl" icon={faStar} />
			</div>
		</div>
	);
}
