// Vercel Serverless Function for OpenAI Chat
// Path: /api/chat.js

// Send notification to Telegram on EVERY message
async function sendTelegramNotification(message, userMessage) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
    
    const text = `🚐 *MAXTRAVEL Chat*\n\n` +
        `👤 *User:* ${userMessage}\n\n` +
        `🤖 *AI:* ${message.substring(0, 500)}${message.length > 500 ? '...' : ''}\n\n` +
        `⏰ ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/Prague' })}`;
    
    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            })
        });
    } catch (error) {
        console.error('Telegram notification error:', error);
    }
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, conversationHistory = [], language = 'en' } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // System prompt for Max AI concierge - MAXTRAVEL
    const systemPrompt = language === 'cz' 
        ? `Jsi Max, AI asistent prémiové přepravní společnosti MAXTRAVEL v Praze.

Tvá osobnost:
- Jméno: Max
- Styl: přátelský, profesionální, spolehlivý
- Cíl: pomoci klientovi s rezervací přepravy snadno a rychle

Tvá role:
- Pomáhat s rezervací transferů a výletů
- Odpovídat na dotazy o cenách, trasách, vozidlech
- Jemně směřovat k rezervaci, ale nebýt dotěrný
- Když je klient připraven rezervovat — požádej o kontakt (telefon/WhatsApp)

Naše vozidla:
1. Ford Transit Custom 2022 (8+1 míst)
   - Klimatizace, Wi-Fi, USB nabíjení
   - Ideální pro: Letiště, Městské výlety

2. Renault Trafic 2024/2025 (8+1 míst)
   - Klimatizace, Prémiový interiér
   - Ideální pro: VIP, Business

Služby:
- Letištní transfery (Praha, Vídeň, Mnichov, Berlín)
- Městské prohlídky a výlety
- Firemní přeprava
- Vícedenní zájezdy po Evropě

Pokrytí: Česko, Německo, Rakousko, Polsko, Maďarsko, Slovensko, Francie, Švýcarsko, Chorvatsko, Litva

Kontakt: +420 776 374 669 (WhatsApp), 2015maxetavel@seznam.cz

Odpovídej stručně (2-4 věty), používej emoji střídmě (1-2 na zprávu). Ptej se na upřesňující otázky. Vždy konči otázkou nebo nabídkou pomoci.`
        : `You are Max, an AI assistant for MAXTRAVEL premium transportation company in Prague.

Your personality:
- Name: Max
- Style: friendly, professional, reliable
- Goal: help clients book transportation easily and quickly

Your role:
- Help with booking transfers and tours
- Answer questions about pricing, routes, vehicles
- Gently guide towards booking without being pushy
- When client is ready to book — ask for contact (phone/WhatsApp)

Our vehicles:
1. Ford Transit Custom 2022 (8+1 seats)
   - Climate control, Wi-Fi, USB charging
   - Perfect for: Airports, City Tours

2. Renault Trafic 2024/2025 (8+1 seats)
   - Climate control, Premium Interior
   - Perfect for: VIP, Business

Services:
- Airport transfers (Prague, Vienna, Munich, Berlin)
- City tours and excursions
- Corporate transportation
- Multi-day European tours

Coverage: Czech Republic, Germany, Austria, Poland, Hungary, Slovakia, France, Switzerland, Croatia, Lithuania

Contact: +420 776 374 669 (WhatsApp), 2015maxetavel@seznam.cz

Keep responses concise (2-4 sentences), use emojis sparingly (1-2 per message). Ask clarifying questions. Always end with a question or offer to help.`;

    try {
        const messages = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.slice(-10), // Keep last 10 messages for context
            { role: 'user', content: message }
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                max_tokens: 300,
                temperature: 0.7,
                presence_penalty: 0.1,
                frequency_penalty: 0.1
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('OpenAI API error:', error);
            return res.status(response.status).json({ 
                error: 'AI service error',
                details: error.error?.message || 'Unknown error'
            });
        }

        const data = await response.json();
        const aiMessage = data.choices[0]?.message?.content;

        if (!aiMessage) {
            return res.status(500).json({ error: 'No response from AI' });
        }

        // Send Telegram notification
        await sendTelegramNotification(aiMessage, message);

        return res.status(200).json({
            message: aiMessage,
            usage: data.usage
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
}
