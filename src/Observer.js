import * as tdl from 'tdl';
import { wordsToLookFor } from './FileManager.js';

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
        return await client
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
        return await client
            .invoke({
                _: 'getMessageLink',
                chat_id: chatId,
                message_id: messageId,
            })
            .then((linkObject) => linkObject.link)
            .catch(() => 'Не получилось получить ссылку');
    }

    async main() {
        await this.client.login();

        this.client.on('update', async (update) => {
            if (update._ !== 'updateChatLastMessage' || !update.last_message)
                return;
            const lastMessage = update.last_message;
            if (!lastMessage.content || lastMessage.content._ !== 'messageText')
                return;

            /**
             * @type {string}
             */
            const messageContent = lastMessage.content.text.text;
            if (!this.messageContainsRequiredWord(messageContent)) return;

            const link = await this.getMessageLink(chatId, lastMessage.id);
            const chatName = await this.getChatName(chatId);
        });
    }
}
