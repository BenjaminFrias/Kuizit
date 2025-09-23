import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import type { Translations } from '../types/translations';
import enTranslations from '../translations/en.json';
import esTranslations from '../translations/es.json';

const translations: Record<string, Translations> = {
	en: enTranslations as Translations,
	es: esTranslations as Translations,
};

export const useTranslation = (): Translations => {
	const { language } = useContext(LanguageContext);
	return translations[language] || translations['en'];
};
