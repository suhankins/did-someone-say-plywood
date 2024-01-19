export const telegramUrl =
    'https://api.telegram.org/bot' + process.env.BOT_TOKEN + '/sendMessage';

/**
 * @param {number} chatId
 * @param {string} text
 */
export default async function sendMessage(chatId, text) {
    await fetch(telegramUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text,
        }),
    }).catch((err) => console.error(err));
}
