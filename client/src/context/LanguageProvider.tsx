import { useEffect, useState, type ReactNode } from 'react';
import { LanguageContext } from './LanguageContext';

interface LanguageProviderProps {
	children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
	children,
}) => {
	const [language, setLanguage] = useState<string>('en');

	useEffect(() => {
		const browserLanguage = navigator.language.split('-')[0];
		setLanguage(browserLanguage);
	}, []);

	return (
		<LanguageContext.Provider value={{ language, setLanguage }}>
			{children}
		</LanguageContext.Provider>
	);
};
