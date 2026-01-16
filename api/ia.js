export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    const { text, image } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    try {
        const userContent = [];
        if (text) userContent.push({ type: "text", text: text });
        if (image) userContent.push({ type: "image_url", image_url: { url: image } });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { 
                        role: 'system', 
                        content: 'Retorne um objeto JSON com uma chave "items" contendo o array: {"items": [{"name":"produto","price":0.0,"quantity":1,"category":"alimentos"}]}' 
                    },
                    { role: 'user', content: userContent }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);
        
        // Enviamos apenas a lista de itens para o frontend
        res.status(200).json(content.items || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
