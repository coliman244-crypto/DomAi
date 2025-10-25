import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Allow CORS from your extension
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // restrict later to your extension URL
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post('/getAIAnswer', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150
      })
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || '[No response]';
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ answer: `[Error: ${err.message}]` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
