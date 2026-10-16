import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client if API key exists
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Assistant Chat endpoint
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { prompt, ledgerSummary, history } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GEMINI_API_KEY || !ai) {
      return res.json({
        demoMode: true,
        reply: null,
        message: 'No GEMINI_API_KEY configured. Velora will use offline terminal emulator mode.',
      });
    }

    const systemInstruction = `You are the VELORA Financial Terminal Analyst.
Persona: Direct, concise, analytical, institutional-grade advisor for university students and young adults.
Tone: Clear, tactical, zero fluff, zero patronizing clichés.
Your task: Analyze cashflow, category expenditures, savings rate velocity, and upcoming goals using the user's live financial ledger data provided below.
Provide concrete advice with exact numbers and actionable rules (e.g. 50/30/20 adjustments, substitution ideas, burn rate calculation).

USER'S CURRENT LEDGER CONTEXT:
${ledgerSummary ? JSON.stringify(ledgerSummary, null, 2) : 'No transactions recorded yet.'}
`;

    // Construct history / contents for Gemini
    const contents: Array<{ role?: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    const reply = response.text || 'Analysis completed with no remarks.';
    return res.json({
      demoMode: false,
      reply,
    });
  } catch (error: any) {
    console.error('Gemini Assistant Error:', error);
    return res.status(500).json({
      demoMode: true,
      error: error.message || 'Internal server error while processing financial query.',
      reply: null,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Mount Vite or static server
async function setupServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VELORA server listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
