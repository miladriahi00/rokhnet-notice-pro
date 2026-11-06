import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '20mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Multi-turn Gemini Chat endpoint
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { messages, model, systemInstruction } = req.body;
    const selectedModel = model || 'gemini-3.8-flash';

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: systemInstruction
        ? {
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
          }
        : undefined,
    });

    const reply = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.json({ reply, model: selectedModel });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate chat response',
    });
  }
});

// Image Generation endpoint (supports 1K, 2K, 4K via gemini-3-pro-image-preview)
app.post('/api/gemini/image', async (req: Request, res: Response) => {
  try {
    const { prompt, size = '1K', aspectRatio = '16:9' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const modelName = 'gemini-3-pro-image-preview';

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          imageSize: size as '1K' | '2K' | '4K',
          aspectRatio: aspectRatio as '1:1' | '16:9' | '4:3' | '9:16',
        },
      },
    });

    let imageUrl = '';
    let altText = '';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        altText = part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'No image data returned from model' });
    }

    return res.json({ imageUrl, altText, size, aspectRatio });
  } catch (err: any) {
    console.error('Image generation error:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate image',
    });
  }
});

// Serve frontend in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
