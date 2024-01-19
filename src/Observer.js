import * as tdl from 'tdl';
import { listeners, wordsToLookFor } from './FileManager.js';
import getListener from './utils/getListener.js';
import isBot from './utils/isBot.js';
import sendMessage from './utils/sendMessage.js';

/**
 * @typedef {import('./types/Update.js').Update} Update
 */

/**
 * @typedef {import('./types/User.js').User} User
 */

export default class Observer {
    /**
     * @type {tdl.Client}
     * @private
     */
    client;

    /**
     * @param {string} message
     * @private
     */
    messageContainsRequiredWord(message) {
        return wordsToLookFor.contents.some(
            (value) => !!message.toLowerCase().match(new RegExp(value, 'gi'))
        );
    }

    /**
     * @param {tdl.ClientOptions} clientOptions
     */
    constructor(clientOptions) {
        this.client = tdl.createClient(clientOptions);
    }

    /**
     * @param {number} chatId
     * @returns {Promise<string>}
     * @private
     */
    async getChatName(chatId) {
        return await this.client
            .invoke({
                _: 'getChat',
                chat_id: chatId,
            })
            .then((chatObject) => chatObject.title)
            .catch(() => 'Не получилось получить название чата');
    }

    /**
     * @param {number} chatId
     * @param {number} messageId
     * @returns {Promise<string>}
     * @private
     */
    async getMessageLink(chatId, messageId) {
        return await this.client
            .invoke({
                _: 'getMessageLink',
                chat_id: chatId,
                message_id: messageId,
            })
            .then((linkObject) => linkObject.link)
            .catch(() => 'Не получилось получить ссылку');
    }

    /**
     * @param {number} userId
     * @returns {Promise<User> | undefined}
     * @private
     */
    async getUser(userId) {
        return await this.client
            .invoke({
                _: 'getUser',
                user_id: userId,
            })
            .catch(() => ({
                id: 0,
                first_name: 'Не получилось получить имя пользователя',
                last_name: '',
                type: { _: '' },
            }));
    }

    async main() {
        await this.client.login();

        this.client.on(
            'update',
            /**
             * @param {Update} update
             */
            async (update) => {
                if (update._ !== 'updateNewMessage') return;
                const lastMessage = update.message;

                const chatId = lastMessage.chat_id;
                if (!!getListener(chatId)) return;

                const userId = lastMessage.sender_id.user_id;
                if (!!getListener(userId)) return;

                const user = await this.getUser(userId);
                if (!user || isBot(user)) return;

                let messageContent = '';

                if (lastMessage.content._ === 'messageText')
                    messageContent = lastMessage.content.text.text;
                else if (
                    lastMessage.content._ === 'messagePhoto' ||
                    lastMessage.content._ === 'messageVideo'
                )
                    messageContent = lastMessage.content.caption.text;

                if (!this.messageContainsRequiredWord(messageContent)) return;

                const username = `${user.first_name} ${user.last_name}`;
                const link = await this.getMessageLink(chatId, lastMessage.id);
                const chatName = await this.getChatName(chatId);
                
                for (const listener of listeners.contents) {
                    await sendMessage(
                        listener.chatId,
                        `Новое сообщение в чате "${chatName}"\n\n${username}: ${messageContent}\n\n${link}`
                    );
                }
            }
        );
    }
}
