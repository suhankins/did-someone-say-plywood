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

            /**
             * @type {string}
             */
            const link = await client
                .invoke({
                    _: 'getMessageLink',
                    chat_id: lastMessage.chat_id,
                    message_id: lastMessage.id,
                })
                .then((linkObject) => linkObject.link)
                .catch(() => 'Не получилось получить ссылку');
            /**
             * @type {string}
             */
            const chatName = await client
                .invoke({
                    _: 'getChat',
                    chat_id: lastMessage.chat_id,
                })
                .then((chatObject) => chatObject.title)
                .catch(() => 'Не получилось получить название чата');
        });
    }
}
