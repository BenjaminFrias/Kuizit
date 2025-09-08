import { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import Inputpage from './pages/InputPage';

function App() {
	const [currentPage, setcurrentPage] = useState('home');

	const handlePageChange = (pageName: string) => {
		setcurrentPage(pageName);
	};

	switch (currentPage) {
		case 'home':
			return <HomePage onPageChange={handlePageChange} />;
		case 'input':
			return <Inputpage onPageChange={handlePageChange} />;
		default:
			return <HomePage onPageChange={handlePageChange} />;
	}
}

export default App;
