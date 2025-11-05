import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

app.get('/api/questions', async (req, res) => {
  const subject = (req.query.subject || 'general').toString();
  const prompt = `
Generate 10 multiple-choice questions for "${subject}".
Return JSON array only. Each:
{ "q": string, "choices": [string,string,string,string], "answer": 0..3, "hint": string }.
`;

  try {
    const resp = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    });
    const data = JSON.parse(resp.response.text());
    const items = Array.isArray(data) ? data : data.questions;

    res.json({
      subject,
      questions: (items ?? []).slice(0, 10).map(q => ({
        q: q.q,
        choices: q.choices,
        answer: q.answer,
        hint: q.hint ?? ''
      }))
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Generation failed' });
  }
});

app.listen(3001, () => console.log('API: http://localhost:3001'));
