import * as tdl from 'tdl';
import { listeners } from './FileManager.js';
import createListener from './Listener/createListener.js';
import Keyboards from './Keyboards.js';
import Commands, { getCommandByText } from './Commands.js';
import getListener from './utils/getListener.js';
import Observer from './Observer.js';

/**
 * @typedef {import('./Listener/createListener.js').Listener} Listener
 */
/**
 * @typedef {import('./types/Message.js').Message} Message
 */
/**
 * @typedef {import('./types/Update.js').Update} Update
 */
/**
 * @typedef {import('./types/Keyboard.js').Keyboard} Keyboard
 */
/**
 * @typedef {import('./types/Chat.js').Chat} Chat
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
     * @type {Observer}
     */
    observer;

    /**
     * @param {tdl.ClientOptions} clientOptions
     * @param {string} token
     * @param {string} password
     * @param {Observer} observer
     */
    constructor(clientOptions, token, password, observer) {
        this.client = tdl.createClient(clientOptions);
        this.token = token;
        this.password = password;
        this.observer = observer;
    }

    async main() {
        await this.client.loginAsBot(this.token);

        this.client.on(
            'update',
            /**
             * @param {Update} update
             */
            async (update) => {
                if (update._ !== 'updateNewMessage') return;
                const message = update.message;
                if (update.message.is_outgoing) return;
                const listener = getListener(message.chat_id);
                if (!!listener) {
                    await this.handleListener(message, listener);
                } else {
                    await this.handleNonListener(message);
                }
            }
        );
    }

    /**
     * @param {Message} message
     * @param {Listener} listener
     */
    async handleListener(message, listener) {
        const messageText = message.content.text.text;
        const requestedCommand = getCommandByText(listener.state, messageText);
        if (requestedCommand) {
            requestedCommand.callback(this, message, listener);
        } else {
            Commands[listener.state]
                .defaultCallback(this, message, listener)
                .catch((err) => console.error(err));
        }
    }

    /**
     * @param {Message} message
     */
    async handleNonListener(message) {
        if (message.content._ !== 'messageText') return;
        const text = message.content.text.text;
        const chatId = message.chat_id;
        if (!!text.match(this.password)) {
            const listener = createListener(chatId);
            listeners.setContents([...listeners.contents, listener]);
            await this.replyWithKeyboard(
                listener,
                message.id,
                'Пароль правильный!'
            );
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

    /**
     * @param {Listener} listener
     * @param {number} messageId
     * @param {string} text
     * @param {any[]} keyboardParams
     */
    async replyWithKeyboard(listener, messageId, text, ...keyboardParams) {
        await this.client
            .invoke({
                _: 'sendMessage',
                chat_id: listener.chatId,
                reply_to_message_id: messageId,
                input_message_content: {
                    _: 'inputMessageText',
                    text: {
                        _: 'formattedText',
                        text: text,
                    },
                },
                reply_markup: Keyboards[listener.state](...keyboardParams),
            })
            .catch((err) => console.error(err));
    }
}
