import ListenerState from './ListenerState.js';

/**
 * @typedef Listener
 * @property {number} chatId
 * @property {ListenerState} state
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
