export default async function handler(req, res) {
  // Permite apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 🔹 MODO TESTE (SEM OPENAI)
  return res.status(200).json([
    {
      name: "Arroz",
      price: 6.99,
      quantity: 1,
      category: "alimentos"
    },
    {
      name: "Feijão",
      price: 7.49,
      quantity: 1,
      category: "alimentos"
    },
    {
      name: "Leite",
      price: 4.89,
      quantity: 2,
      category: "bebidas"
    }
  ]);
}
