import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import axios from "axios";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Extract raw text from uploaded PDF
router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const data = await pdfParse(req.file.buffer);

    // Split text into per-page chunks (pdf-parse gives full text; we split by page breaks)
    const pages = data.text
      .split(/\f/) // form feed = page break
      .map((t) => t.trim())
      .filter((t) => t.length > 20);

    res.json({ pages, totalPages: pages.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'PDF extraction failed' });
  }
});

// Summarize a page's text into an image prompt using GPT-4o
router.post('/summarize', async (req, res) => {
  const { pageText, pageNumber } = req.body;

  if (!pageText) {
    return res.status(400).json({
      error: 'No page text provided'
    });
  }

  try {

    const response = await axios.post(
      `${process.env.OLLAMA_URL}/api/generate`,
      {
        model: process.env.OLLAMA_MODEL,
        prompt: `
You are generating prompts for an image generation model.

Rules:
- Return ONLY the image prompt.
- No titles.
- No explanations.
- No bullet points.
- No markdown.
- Maximum 80 words.
- Describe a single visual scene.

PDF Page:

${pageText.slice(0, 4000)}
`,
        stream: false
      }
    );

    const prompt = response.data.response.trim();

    res.json({ prompt });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Prompt generation failed'
    });
  }
});

export default router;
