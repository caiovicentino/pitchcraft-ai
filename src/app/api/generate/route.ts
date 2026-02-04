import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName,
      industry,
      problem,
      solution,
      targetMarket,
      businessModel,
      traction,
      team,
      askAmount,
    } = body;

    const prompt = `Você é um especialista em pitch decks para startups. Crie um pitch deck profissional para a empresa "${companyName}".

INFORMAÇÕES DA EMPRESA:
- Nome: ${companyName}
- Setor: ${industry || 'Tecnologia'}
- Problema: ${problem}
- Solução: ${solution}
- Mercado-alvo: ${targetMarket || 'A definir'}
- Modelo de negócio: ${businessModel || 'A definir'}
- Tração: ${traction || 'Fase inicial'}
- Time: ${team || 'Equipe fundadora'}
- Investimento buscado: ${askAmount || 'A definir'}

Crie exatamente 10 slides no formato JSON abaixo. Cada slide deve ter conteúdo impactante, conciso e orientado a dados (quando possível).

Estrutura dos slides:
1. Título/Capa
2. Problema
3. Solução
4. Mercado (TAM/SAM/SOM)
5. Produto/Demonstração
6. Modelo de Negócio
7. Tração/Métricas
8. Competição/Diferencial
9. Time
10. Ask/Próximos Passos

Retorne APENAS o JSON válido, sem markdown:
{
  "companyName": "nome",
  "tagline": "tagline impactante em uma frase",
  "slides": [
    {
      "title": "Título do Slide",
      "content": "Conteúdo do slide com bullet points usando • e quebras de linha",
      "notes": "Dica opcional para o apresentador"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em criar pitch decks para startups. Retorne apenas JSON válido, sem markdown ou código.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Clean the response - remove any markdown code blocks
    let cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const pitchDeck = JSON.parse(cleanedResponse);

    return NextResponse.json(pitchDeck);
  } catch (error) {
    console.error('Error generating pitch deck:', error);
    return NextResponse.json(
      { error: 'Failed to generate pitch deck' },
      { status: 500 }
    );
  }
}
