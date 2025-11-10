import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './loading.css';

export default function QuestionLoadingIllustration() {
	return (
		<div
			className={`
                question-box relative
                w-[230px] py-4 px-7 flex gap-5 justify-center items-center font-primary text-center
                font-medium cursor-auto select-none
                rounded-full transition-all duration-300 bg-custom-green
            `}
			data-testid="question-loading-decorative"
		>
			<FontAwesomeIcon
				icon={faWandMagicSparkles}
				className="text-white text-2xl"
			/>
			<div className="w-full">
				<div className="question-text w-full h-2 bg-white rounded-2xl "></div>
			</div>
		</div>
	);
}
