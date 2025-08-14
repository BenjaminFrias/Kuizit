"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const genai_1 = require("@google/genai");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error('GEMINI_API_KEY is not set in the .env file.');
    process.exit(1);
}
const ai = new genai_1.GoogleGenAI({ apiKey: API_KEY });
async function main() {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Explain how to become a senior dev from scratch, in basic and short words.',
    });
    return response;
}
app.get('/', async (req, res) => {
    const aiPromise = main();
    console.log('GETTING DATA...');
    aiPromise
        .then((response) => {
        console.log('DATA RETRIEVED SUCCESSFULLY');
        res.send(response.text);
    })
        .catch((error) => {
        console.log('DATA RETRIEVED FAILED: ', error);
        res.send('error');
    });
});
app.listen(PORT, () => {
    console.log('Server listening on port: ', PORT);
});
