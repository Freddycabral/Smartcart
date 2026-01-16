export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    
    const apiKey = process.env.OPENAI_API_KEY;

    try {
        const { text, image } = req.body;
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
                        content: 'Retorne APENAS um array JSON: [{"name":"item","price":0,"quantity":1,"category":"alimentos"}]' 
                    },
                    { role: 'user', content: userContent }
                ]
            })
        });

        const data = await response.json();

        // VERIFICAÇÃO DE ERRO DA OPENAI
        if (data.error) {
            return res.status(400).json({ error: `Erro da OpenAI: ${data.error.message}` });
        }

        if (!data.choices || !data.choices[0]) {
            return res.status(500).json({ error: 'Resposta da IA veio vazia.' });
        }

        const rawContent = data.choices[0].message.content;
        res.status(200).json(JSON.parse(rawContent));

    } catch (error) {
        console.error('Erro detalhado:', error);
        res.status(500).json({ error: 'Falha no servidor: ' + error.message });
    }
}
