import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';

import { LanguageProvider } from './context/LanguageProvider.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<LanguageProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</LanguageProvider>
	</StrictMode>
);
