export default async function handler(req, res) {
    // Configuração de segurança (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

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
                        content: 'Retorne APENAS um array JSON de produtos: [{"name":"item","price":0,"quantity":1,"category":"outros"}]' 
                    },
                    { role: 'user', content: userContent }
                ]
            })
        });

        const data = await response.json();
        
        // CORREÇÃO CRÍTICA: Transforma o texto da OpenAI em uma lista real para o index.html
        const rawContent = data.choices[0].message.content;
        const itemsArray = JSON.parse(rawContent);
        
        res.status(200).json(itemsArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao processar dados da IA' });
    }
}
