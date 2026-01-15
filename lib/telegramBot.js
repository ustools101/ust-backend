require('dotenv').config();

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

/**
 * Send a message to a specific chat ID
 * @param {string|number} chatId - The chat ID to send the message to
 * @param {string} message - The message to send
 * @returns {Promise<object>} - The response from Telegram
 */
async function sendMessage(chatId, message) {
    try {
        const url = `${TELEGRAM_API_URL}/sendMessage`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "HTML"
            })
        });

        if (!response.ok) console.log("Failed to send msg", await response.text());
    } catch (error) {
        console.error('Error sending Telegram message:', error);
    }
}


module.exports = sendMessage;
