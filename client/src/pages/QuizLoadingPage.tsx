import QuestionLoadingIllustration from '@/components/decorative/QuestionLoadingIllustration';
import { useTranslation } from '@/hooks/useTranslation';
import '../components/decorative/loading.css';

export default function QuizLoadingPage() {
	const t = useTranslation();

	return (
		<div
			className="flex flex-col gap-5 min-h-screen min-w-screen bg-custom-white items-center justify-center"
			data-testid="loading-page"
		>
			<QuestionLoadingIllustration />
			<p className="generating-text mt-2 mb-5 text-custom-light-gray text-3xl md:text-5xl font-medium font-primary">
				{t.generating}
			</p>
		</div>
	);
}
