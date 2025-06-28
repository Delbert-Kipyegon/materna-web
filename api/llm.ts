import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { character, message } = req.body;

  // Replace with actual LLM API integration
  const reply = `Simulated response from ${character} for message: "${message}"`;

  res.status(200).json({ reply });
}
