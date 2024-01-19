import ListenerState from './ListenerState.js';

/**
 * @typedef {import('../types/Listener.js').Listener} Listener
 */

/**
 * @param {number} chatId
 * @returns {Listener}
 */
export default function createListener(chatId) {
    return {
        chatId,
        state: ListenerState.default,
    };
}
