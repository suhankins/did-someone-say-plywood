import * as tdl from 'tdl';
import { listeners } from './FileManager.js';
import createListener from './Listener/createListener.js';

/**
 * @typedef {import('./Listener/createListener.js').Listener} Listener
 */

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
            const listener = this.getListener(message.chat_id);
            if (!!listener) {
                await this.handleListener(message, listener);
            } else {
                await this.handleNonListener(message);
            }
        });
    }

    /**
     * @param {number} chatId
     * @returns {Listener|null}
     */
    getListener(chatId) {
        return listeners.contents.find((user) => user.chatId === chatId);
    }

    /**
     * @param {*} message
     * @param {Listener} listener
     */
    async handleListener(message, listener) {
        // TODO: Implement
    }

    /**
     * @param {{chat_id: number, content: { _: string, text: { text: string }}}} message
     */
    async handleNonListener(message) {
        if (message.content._ !== 'messageText') return;
        const text = message.content.text.text;
        const chatId = message.chat_id;
        if (!!text.match(this.password)) {
            listeners.setContents([
                ...listeners.contents,
                createListener(chatId),
            ]);
            await this.sendTextMessage(chatId, 'Пароль правильный!');
        } else {
            await this.sendTextMessage(chatId, 'Неправильный пароль.');
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
