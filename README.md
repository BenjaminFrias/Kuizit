# Kuizit

This is a full-stack web app that generates quizzes using AI.
Users can input text, a YouTube video URL, or a topic, and the application will create a quiz with different question types.

## Features

- Multiple Input Options: Generate quizzes from text, YouTube videos, or a simple topic.

- Diverse Question Types: Supports multiple-choice, true/false and others.

- Interactive Interface: A user-friendly front end.

- Secure Backend: The application uses a Node.js Express server to securely handle API calls to the AI model.

## Technologies Used

**Frontend**: React, TypeScript, Vite, Tailwind CSS

**Backend**: Node.js, Express, TypeScript

**AI**: Google Gemini API

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository

**Bash**

```
git clone https://github.com/BenjaminFrias/Kuizit
cd Kuizit
```

2. Set up the Backend
   Navigate to the server directory, install the dependencies, and create a .env file to store your API key.

**Bash**

```
cd server
npm install
```

Create a .env file with your Google Gemini API key:
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
Then, start the server:

**Bash**

```
npm run dev
The server will run on http://localhost:3001.
```

3. Set up the Frontend
   Open a new terminal, navigate to the client directory, and install its dependencies.

**Bash**

```
cd ../client
npm install
```

Now, start the frontend development server:

**Bash**

```
npm run dev
```

The React app will open in your browser, typically at http://localhost:5173.
