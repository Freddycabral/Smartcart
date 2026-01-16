// api/ia.js
export default async function handler(req, res) {
    // Configuração de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    const { text, image } = req.body;
    
    // AQUI ESTÁ O SEGREDO: O código chama a chave do sistema, não do texto
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
                    { role: 'system', content: 'Retorne um JSON array: [{"name":"produto","price":0,"quantity":1,"category":"alimentos"}]' },
                    { role: 'user', content: userContent }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        res.status(200).json(data.choices[0].message.content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
