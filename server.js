const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/chat', async function(req, res) {
const systemPrompt = req.body.systemPrompt;
const messages = req.body.messages;
const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

try {
const anthropicMessages = [];
for (var i = 0; i < messages.length; i++) {
var msg = messages[i];
var role = msg.role === 'model' ? 'assistant' : 'user';
var content = msg.parts && msg.parts[0] ? msg.parts[0].text : msg.content;
anthropicMessages.push({ role: role, content: content });
}

var response = await fetch('https://api.anthropic.com/v1/messages', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'x-api-key': apiKey,
'anthropic-version': '2023-06-01'
},
body: JSON.stringify({
model: 'claude-haiku-4-5-20251001',
max_tokens: 300,
system: systemPrompt,
messages: anthropicMessages
})
});

var data = await response.json();
if (!response.ok) throw new Error(data.error ? data.error.message : 'API error');
res.json({ reply: data.content[0].text });
} catch (err) {
res.status(500).json({ error: err.message });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
console.log('Server running on port ' + PORT);
});
