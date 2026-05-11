
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/chat', async (req, res) => {
const { systemPrompt, messages } = req.body;
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
try {
const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=' + apiKey, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
system_instruction: { parts: [{ text: systemPrompt }] },
contents: messages
})
});
const data = await response.json();
if (!response.ok) throw new Error(data.error ? data.error.message : 'API error');
res.json({ reply: data.candidates[0].content.parts[0].text });
} catch (err) {
res.status(500).json({ error: err.message });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() { console.log('Running on port ' + PORT); });
