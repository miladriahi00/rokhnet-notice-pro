import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      const apiKey = process.env.GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        if (req.url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', dev: true, time: new Date().toISOString() }));
          return;
        }

        if (req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = bodyStr ? JSON.parse(bodyStr) : {};

              if (req.url === '/api/gemini/chat') {
                const { messages, model, systemInstruction } = body;
                const selectedModel = model || 'gemini-3.8-flash';
                const contents = (messages || []).map((m: any) => ({
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
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ reply, model: selectedModel }));
                return;
              }

              if (req.url === '/api/gemini/image') {
                const { prompt, size = '1K', aspectRatio = '16:9' } = body;
                const modelName = 'gemini-3-pro-image-preview';

                const response = await ai.models.generateContent({
                  model: modelName,
                  contents: { parts: [{ text: prompt }] },
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

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ imageUrl, altText, size, aspectRatio }));
                return;
              }

              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Endpoint not found' }));
            } catch (err: any) {
              console.error('Vite API Middleware error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Internal API Error' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevMiddleware()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
