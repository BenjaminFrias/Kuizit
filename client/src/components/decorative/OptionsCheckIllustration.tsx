import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function OptionsCheckIllustration() {
	return (
		<div className="w-55 h-70 flex flex-col justify-between gap-2 p-7 bg-black/60 rounded-4xl drop-shadow-[13px_11px_8px_rgba(0,0,0,1)] inset-shadow-md inset-shadow-primary/15">
			<div className="w-full flex justify-center items-center flex-1 bg-primary rounded-full">
				<FontAwesomeIcon className="text-[#caebcc] text-2xl" icon={faCheck} />
			</div>
			<div className="w-full flex justify-center items-center flex-1 bg-white/10 rounded-full"></div>
			<div className="w-full flex justify-center items-center flex-1 bg-white/10 rounded-full"></div>
			<div className="w-full flex justify-center items-center flex-1 bg-white/10 rounded-full"></div>
		</div>
	);
}
