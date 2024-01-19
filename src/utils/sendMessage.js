import * as tdl from 'tdl';
/**
 * @param {tdl.Client} client
 * @param {number} chatId
 * @param {string} text
 */
export default async function sendTextMessage(client, chatId, text) {
    await client.invoke({
        _: 'sendMessage',
        chat_id: chatId,
        input_message_content: {
            _: 'inputMessageText',
            text: {
                _: 'formattedText',
                text: text,
            },
        },
    });
}
