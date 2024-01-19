import * as tdl from 'tdl';
import { listeners } from './FileManager.js';

export default class Reporter {
    /**
     * @type {tdl.Client}
     * @private
     */
    client;

    /**
     * @type {string}
     * @private
     */
    token;

    /**
     * @type {string}
     * @private
     */
    password;

    /**
     * @param {tdl.ClientOptions} clientOptions
     * @param {string} token
     */
    constructor(clientOptions, token, password) {
        this.client = tdl.createClient(clientOptions);
        this.token = token;
        this.password = password;
    }

    async main() {
        await this.client.loginAsBot(this.token);

        this.client.on('update', async (update) => {
            if (update._ !== 'updateNewMessage') return;
            const message = update.message;
            if (this.isListener(message.chat_id)) {
                await this.handleListener(message);
            } else {
                await this.handleNonListener(message);
            }
        });
    }

    /**
     * @param {number} chatId
     */
    isListener(chatId) {
        return listeners.contents.includes(chatId);
    }

    async handleListener() {
        // TODO: Implement
    }

    /**
     * @param {{chat_id: number, content: { _: string, text: { text: string }}}} message
     */
    async handleNonListener(message) {
        if (message.content._ !== 'messageText') return;
        const text = message.content.text.text;
        if (!!text.match(this.password)) {
            listeners.setContents([...listeners.contents, message.chat_id]);
            await this.sendTextMessage(message.chat_id, 'Пароль правильный!');
        } else {
            await this.sendTextMessage(message.chat_id, 'Неправильный пароль.');
        }
    }

    /**
     * @param {number} chatId
     * @param {string} text
     */
    async sendTextMessage(chatId, text) {
        await this.client.invoke({
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
}
