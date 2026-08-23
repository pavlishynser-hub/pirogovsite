// Vercel Serverless Function — MAX AI chat lead
// Path: /api/lead.js

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function isValidName(name) {
    const trimmed = String(name || '').trim();
    if (trimmed.length < 2 || trimmed.length > 60) return false;
    return /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]{0,58}$/u.test(trimmed);
}

function isValidPhone(phone) {
    const digits = String(phone || '').replace(/[^\d]/g, '');
    return digits.length >= 8 && digits.length <= 15;
}

function normalizePhone(phone) {
    const raw = String(phone || '').trim();
    const digits = raw.replace(/[^\d]/g, '');
    if (raw.startsWith('+')) return `+${digits}`;
    return `+${digits}`;
}

async function sendTelegramLead({ name, phone, language, page, submittedAt }) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        throw new Error('Telegram is not configured');
    }

    const text = [
        '🚐 <b>MAX AI — новий лід з чату</b>',
        '',
        `👤 <b>Імʼя:</b> ${escapeHtml(name)}`,
        `📱 <b>Телефон:</b> ${escapeHtml(phone)}`,
        `🌐 <b>Мова сайту:</b> ${escapeHtml(language)}`,
        `📄 <b>Сторінка:</b> ${escapeHtml(page)}`,
        `⏰ <b>Час:</b> ${escapeHtml(submittedAt)}`
    ].join('\n');

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text,
            parse_mode: 'HTML'
        })
    });

    const result = await response.json();
    if (!response.ok || !result.ok) {
        throw new Error(result.description || 'Telegram send failed');
    }
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, phone, language = 'en', page = '' } = req.body || {};
    const cleanName = String(name || '').trim();
    const cleanPhone = normalizePhone(phone);

    if (!isValidName(cleanName)) {
        return res.status(400).json({ error: 'Invalid name' });
    }

    if (!isValidPhone(cleanPhone)) {
        return res.status(400).json({ error: 'Invalid phone' });
    }

    const submittedAt = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Prague' });
    const allowedLang = ['en', 'cz', 'ua'].includes(language) ? language : 'en';
    const safePage = String(page || '').slice(0, 500);

    try {
        await sendTelegramLead({
            name: cleanName,
            phone: cleanPhone,
            language: allowedLang,
            page: safePage,
            submittedAt
        });

        return res.status(200).json({
            ok: true,
            name: cleanName,
            phone: cleanPhone
        });
    } catch (error) {
        console.error('Lead save error:', error);
        return res.status(500).json({ error: 'Could not save contact' });
    }
}
