# Copilot instructions for Kuizit

This file contains concise, actionable guidance for AI coding agents working on the Kuizit repository. Focus on concrete, discoverable facts and code patterns present in the codebase.

- Big picture

  - Kuizit is a full‑stack React + TypeScript (Vite) frontend and a Node.js + Express TypeScript backend that generates quizzes via Google Gemini (GenAI).
  - Frontend and backend are separated into `client/` and `server/`. The frontend calls the backend endpoint `POST /api/generate-quiz` to obtain quiz JSON.

- Important files / entry points

  - Backend server: `server/src/server.ts` (starts Express, mounts `/api/generate-quiz`).
  - Quiz generation logic (AI): `server/src/services/generateQuiz.ts` — builds the Gemini prompt, safetySettings, uploads files (if provided), and parses JSON responses.
  - Backend request validation + Zod schemas: `server/src/middlewares/validateQuizRequest.ts` and `server/src/schemas/quiz.ts` (response schema mirrored in `QuizResultSchema`).
  - Frontend API hook: `client/src/hooks/useQuizApi.ts` — sends either JSON or multipart/form-data depending on `quizInputType`.
  - App routing / page flow: `client/src/App.tsx` maps `home`, `input`, `quiz`, `results`, `review` pages and contains state reset behavior when navigating back to `input`.
  - Pages and UI lives under `client/src/pages/` and shared UI components under `client/src/components/`.

- Data flow and contracts

  - Frontend -> Backend: POST `/api/generate-quiz`.
    - If `quizInputType === 'file'` the hook sends a FormData with keys: `quizInputType`, `numQuestions`, `difficulty`, `optionTypes`, `quizFile` (File). See `client/src/hooks/useQuizApi.ts`.
    - Otherwise the hook sends JSON with the `QuizSettings` shape.
  - Backend -> AI: `generateQuiz` composes `parts` — accepts `prompt` (plain text), `youtube_link` (fileUri), or `file` (uploaded via `ai.files.upload`).
  - Expected backend response: JSON array of questions matching `server/src/schemas/quiz.ts`:
    - Each question: `{ type, question, correctAnswerIndex, options: [{ optionText, answer }], explanation }`.
    - The server validates the returned structure using `QuizResultSchema` before returning to client.

- Error and safety behavior to be aware of

  - `generateQuiz` enforces safety via `safetySettings` and throws if Gemini blocks or returns no valid candidate. The code expects strict JSON matching the schema; invalid parsing results in an error.
  - Frontend `useQuizApi` surfaces server or parsing errors via `apiError` and `setApiError`. `App.tsx` appends a localized message and navigates to the `input` page on failure.
  - When adding tests or UI changes account for both network error and schema-mismatch error paths.

- Project-specific conventions / patterns

  - State and page navigation are centralized in `client/src/App.tsx`. When `currentPage === 'input'`, `resetQuizStates()` is called (see useEffect) to reset `quizSettings` and `quizResultData`.
  - The frontend uses a small typed hook `useQuizApi` that returns `{ apiError, setApiError, generateQuiz }` instead of calling fetch throughout the app.
  - The AI prompt and response schema are defined in `server/src/services/generateQuiz.ts` — modify this file when changing how quizzes should be generated or when adding options to the response schema.
  - File uploads: multer on the backend uses `upload.single('quizFile')`. The frontend name must match (`quizFile`).

- How to run / build / test (commands found in package.json)

  - Backend (server):
    - Install: `cd server && npm install`
    - Dev: `npm run dev` (tsc watch + nodemon over `dist/server.js`)
    - Build: `npm run build`; Start production: `npm run start`.
    - Environment: put `GEMINI_API_KEY` in `server/.env`. Set `CORS_ORIGIN` if needed.
  - Frontend (client):
    - Install: `cd client && npm install`
    - Dev: `npm run dev` (Vite, default dev port ~5173)
    - Build: `npm run build`
    - Test: `npm run test` (Vitest)
    - Lint: `npm run lint`
    - Vite expects `VITE_API_URL` in `.env` or your environment (consumed via `import.meta.env.VITE_API_URL`).

- Tests and quick debugging pointers

  - Frontend tests live in `client/src/tests/` and use Vitest + Testing Library.
  - To reproduce API failures locally, run the backend without a valid `GEMINI` key or change `VITE_API_URL` to a non‑reachable URL and observe how `apiError` is surfaced in the UI.

- When modifying AI interactions

  - Update `configAI.systemInstruction` in `server/src/services/generateQuiz.ts` and keep the `responseSchema` in sync with `server/src/schemas/quiz.ts`/Zod schema.
  - If adding a new `quizInputType` value, update both `useQuizApi` (how it serializes/sends data) and `generateQuiz` (how it sets up `parts`).

- Small examples to follow

  - File upload flow: `client/src/hooks/useQuizApi.ts` → sends `quizFile` FormData key → `server/src/server.ts` uses `upload.single('quizFile')` and `generateQuiz` calls `ai.files.upload`.
  - Page mapping: `client/src/App.tsx` defines `pageComponents: Record<Page, ReactElement>` and `renderPage()` which returns `pageComponents[currentPage]`.

- Safety / secrets
  - Do not commit `GEMINI_API_KEY` or other secrets. Use `server/.env` for the Gemini key and `client/.env` (or environment variables) for `VITE_API_URL` during development.

If any section is unclear or you want more details about a particular file or flow (for example the exact Zod validation rules or the Gemini response schema), tell me which area to expand and I'll iterate.
