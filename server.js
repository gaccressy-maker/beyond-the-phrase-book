const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/chat', async function(req, res) {
const systemPrompt = req.body.systemPrompt;
const messages = req.body.messages;
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

try {
const openaiMessages = [{ role: 'system', content: systemPrompt }];
for (var i = 0; i < messages.length; i++) {
openaiMessages.push({
role: messages[i].role === 'model' ? 'assistant' : messages[i].role,
content: messages[i].parts[0].text
});
}

const response = await fetch('https://api.openai.com/v1/chat/completions', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': 'Bearer ' + apiKey
},
body: JSON.stringify({
model: 'gpt-4o-mini',
max_tokens: 300,
messages: openaiMessages
})
});

const data = await response.json();
if (!response.ok) throw new Error(data.error ? data.error.message : 'API error');
res.json({ reply: data.choices[0].message.content });
} catch (err) {
res.status(500).json({ error: err.message });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
console.log('Server running on port ' + PORT);
});
