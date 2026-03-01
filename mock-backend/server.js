const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'MindMate Mock API', version: '1.0.0' });
});

app.post('/analyze', (req, res) => {
  const text = (req.body && req.body.text) || '';
  // very simple mock logic
  const negativeWords = ['sad', 'tired', 'hopeless', 'suicidal'];
  const detected = negativeWords.filter(w => text.toLowerCase().includes(w));
  const sentiment = detected.length ? -0.5 : 0.5;
  const risk = detected.length >= 2 ? 'High' : detected.length === 1 ? 'Moderate' : 'Low';

  res.json({
    risk_level: risk,
    sentiment_score: sentiment,
    detected_keywords: detected,
    emoji_count: 0,
    recommendation: 'This is a mock recommendation. For real results run the backend.',
    explanation: 'Mock analysis based on simple keyword matching.'
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Mock backend listening on http://localhost:${port}`));
