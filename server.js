const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/chat', async function(req, res) {
const systemPrompt = req.body.systemPrompt;
const messages = req.body.messages;
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
return res.status(500).json({ error: 'API key not configured' });
}

const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=' + apiKey;

try {
const response = await fetch(url, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
system_instruction: { parts: [{ text: systemPrompt }] },
contents: messages
})
});
const data = await response.json();
if (!response.ok) {
return res.status(500).json({ error: data.error ? data.error.message : 'API error' });
}
res.json({ reply: data.candidates[0].content.parts[0].text });
} catch (err) {
res.status(500).json({ error: err.message });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
console.log('Server running on port ' + PORT);
});
