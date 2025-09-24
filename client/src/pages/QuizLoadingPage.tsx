import { useTranslation } from '@/hooks/useTranslation';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LoadingAnimation = () => {
	const t = useTranslation();
	return (
		<div className="flex flex-col min-h-screen min-w-screen bg-custom-white items-center justify-center">
			<FontAwesomeIcon
				icon={faSpinner}
				className="animate-spin text-3xl text-custom-green"
			/>
			<p className="mt-4 text-custom-light-gray text-2xl font-medium font-primary">
				{t.generating}...
			</p>
		</div>
	);
};

export default LoadingAnimation;
