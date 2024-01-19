import ListenerStates from './ListenerStates.js';

/**
 * @typedef Listener
 * @property {number} chatId
 * @property {ListenerStates} state
 */

/**
 * @param {number} chatId 
 * @returns {Listener}
 */
export default function createListener(chatId) {
    return {
        chatId,
        state: ListenerStates.default,
    };
}
