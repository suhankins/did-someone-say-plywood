import { listeners } from '../FileManager.js';

/**
 * @typedef {import('../Listener/createListener.js').Listener} Listener
 */

/**
 * @param {number} chatId
 * @returns {Listener|null}
 */
export default function getListener(chatId) {
    return listeners.contents.find((user) => user.chatId === chatId);
}
