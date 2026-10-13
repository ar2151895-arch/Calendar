import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Route: Chat with Calendar & Festival Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, context, year } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemInstruction = `You are "Vishwa Calendar AI" (विश्व कैलेंडर एआई), an expert astronomical and cultural assistant specializing in Indian, Hindu, Islamic, Sikh, Christian, and National festivals, holidays, tithis, panchang, and calendar events for ANY year.
Language style: Respond helpfully in Hindi (Devanagari script) with English terms where appropriate, or in the language used by the user.

When user asks about a festival like Diwali, Holi, Chhath, Eid, Raksha Bandhan, Karwa Chauth, Makar Sankranti, or any event for ANY given year (past, present, or future):
1. 'Kab Hai': State the exact or accurate astronomical date, weekday, and Hindu tithi for that specified year.
2. 'Kab Nahin Hai': Clarify any misconceptions, sutak period, bhadra kaal, or which day not to fast/celebrate.
3. 'Kya Hai': Explain what the festival is (history, myth, essence).
4. 'Kyun Manate Hain': Spiritual significance and cultural story (Ramayana, Mahabharata, Puranas, etc.).
5. 'Shubh Muhurat & Puja Vidhi': Auspicious timing, puja vidhi, what to do and what to avoid (do's and don'ts).

Keep responses structured, engaging, respectful, and easy to read.`;

    const userContent = `Year in focus: ${year || new Date().getFullYear()}.
Current Context: ${context || 'Universal Calendar'}.
User Query: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userContent,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    const reply = response.text || 'क्षमा करें, उत्तर प्राप्त नहीं हो सका। कृपया पुनः प्रयास करें।';
    return res.json({ text: reply });
  } catch (error: any) {
    console.error('Server Gemini API Error:', error);
    return res.status(500).json({
      error: 'Failed to process request',
      details: error.message || 'Unknown error',
    });
  }
});

// API Route: Deep dive on a specific festival for a specific year
app.post('/api/festival-info', async (req, res) => {
  try {
    const { festivalName, year } = req.body;

    if (!festivalName) {
      return res.status(400).json({ error: 'Festival name is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Provide complete detailed insights for the festival "${festivalName}" for the year ${year || new Date().getFullYear()}.
Include:
1. Exact date and tithi in ${year}
2. "Kab Hai" (when is it)
3. "Kab Nahin" (when is it not / cautions / wrong dates / fasting rules)
4. "Kya Hai" (what is this festival)
5. "Kyun Manate Hain" (why is it celebrated - story & significance)
6. "Shubh Muhurat" (auspicious time in ${year})
7. "Puja Vidhi & Do's/Don'ts"
Return in clear, beautifully formatted Hindi with bullet points.`,
      config: {
        systemInstruction: 'You are an authentic Vedic and cultural calendar scholar.',
        temperature: 0.4,
      },
    });

    return res.json({ text: response.text || '' });
  } catch (error: any) {
    console.error('Festival Info API Error:', error);
    return res.status(500).json({ error: 'Failed to get festival info' });
  }
});

// Serve frontend with Vite in development or static in production
async function startServer() {
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
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
