import { allowList, listeners, wordsToLookFor } from './FileManager.js';
import ListenerState from './Listener/ListenerState.js';
import {
    getArrayWithReplacedItem,
    getArrayWithSwitchedItem,
    getArrayWithoutItem,
} from './utils/arrayUtils.js';

/**
 * @typedef {import('./types/Listener.js').Listener} Listener
 */
/**
 * @typedef {import('./Reporter.js').default} Reporter
 */
/**
 * @typedef {import('./types/Message.js').Message} Message
 */
/**
 * @typedef {import('./types/Keyboard.js').Keyboard} Keyboard
 */
/**
 * @typedef {(reporter: Reporter, message: Message, listener: Listener) => Promise<void>} CommandCallback
 */

/**
 * @param {Listener} listener
 * @param {ListenerState} state
 * @returns {Listener}
 */
function switchListenerState(listener, state) {
    const newListener = {
        ...listener,
        state,
    };
    listeners.setContents(
        getArrayWithReplacedItem(listeners.contents, listener, newListener)
    );
    return newListener;
}

/**
 * @param {Reporter} reporter
 * @param {Listener} listener
 * @param {Message} message
 * @param {ListenerState} state
 * @param {string} text
 * @param {any[]} keyboardParams
 */
async function switchStateAndReplyWithKeyboard(
    reporter,
    listener,
    message,
    state,
    text,
    ...keyboardParams
) {
    const newListener = switchListenerState(listener, state);
    await reporter.replyWithKeyboard(
        newListener,
        message.id,
        text,
        ...keyboardParams
    );
}

const Commands = {
    [ListenerState.default]: {
        commands: [
            {
                text: 'Посмотреть все слова',
                /**
                 * @type CommandCallback
                 */
                callback: async (reporter, message, listener) => {
                    await switchStateAndReplyWithKeyboard(
                        reporter,
                        listener,
                        message,
                        ListenerState.listAll,
                        'Нажмите на слово, чтобы его удалить.'
                    );
                },
            },
            {
                text: 'Добавить слово',
                /**
                 * @type CommandCallback
                 */
                callback: async (reporter, message, listener) => {
                    await switchStateAndReplyWithKeyboard(
                        reporter,
                        listener,
                        message,
                        ListenerState.addWord,
                        'Введите слово (или регулярное выражение)'
                    );
                },
            },
            {
                text: 'Чаты',
                /**
                 * @type CommandCallback
                 */
                callback: async (reporter, message, listener) => {
                    const chats = await reporter.observer.getAndSaveChats();
                    await switchStateAndReplyWithKeyboard(
                        reporter,
                        listener,
                        message,
                        ListenerState.chats,
                        'Нажмите на чат, чтобы начать или перестать его прослушивать.',
                        chats
                    );
                },
            },
            {
                text: 'Отписаться',
                /**
                 * @type CommandCallback
                 */
                callback: async (reporter, message, listener) => {
                    listeners.setContents(
                        getArrayWithoutItem(listeners.contents, listener)
                    );
                    const newListener = {
                        ...listener,
                        state: ListenerState.unsubscribed,
                    };
                    await reporter.replyWithKeyboard(
                        newListener,
                        message.id,
                        'Вы успешно отписались. Чтобы снова подписаться, напишите пароль.'
                    );
                },
            },
        ],
        /**
         * @type CommandCallback
         */
        defaultCallback: async (reporter, message, listener) => {
            await reporter.replyWithKeyboard(
                listener,
                message.id,
                'Неизвестная команда'
            );
        },
    },
    [ListenerState.addWord]: {
        commands: [
            {
                text: 'Отменить',
                /**
                 * @type CommandCallback
                 */
                callback: async (reporter, message, listener) => {
                    await switchStateAndReplyWithKeyboard(
                        reporter,
                        listener,
                        message,
                        ListenerState.default,
                        'Ввод отменен.'
                    );
                },
            },
        ],
        /**
         * @type CommandCallback
         */
        defaultCallback: async (reporter, message, listener) => {
            if (message.content._ !== 'messageText') return;
            const newWord = message.content.text.text;
            wordsToLookFor.setContents([...wordsToLookFor.contents, newWord]);
            await switchStateAndReplyWithKeyboard(
                reporter,
                listener,
                message,
                ListenerState.default,
                `Слово "${newWord}" успешно добавлено!`
            );
        },
    },
    [ListenerState.listAll]: {
        commands: [
            {
                text: '↩️ Назад',
                /**
                 * @type CommandCallback
                 */
                callback: async (reporter, message, listener) => {
                    await switchStateAndReplyWithKeyboard(
                        reporter,
                        listener,
                        message,
                        ListenerState.default,
                        'Возращаемся назад'
                    );
                },
            },
        ],
        /**
         * @type CommandCallback
         */
        defaultCallback: async (reporter, message, listener) => {
            if (message.content._ !== 'messageText') return;
            const word = message.content.text.text;
            const wordIndex = wordsToLookFor.contents.findIndex(
                (value) => value === word
            );
            if (wordIndex === -1) {
                await reporter.replyWithKeyboard(
                    listener,
                    message.id,
                    'Слово не найдено!'
                );
                return;
            }

            wordsToLookFor.setContents(
                wordsToLookFor.contents.toSpliced(wordIndex, 1)
            );
            await reporter.replyWithKeyboard(
                listener,
                message.id,
                `Слово "${word}" успешно удалено.`
            );
        },
    },
    [ListenerState.chats]: {
        commands: [
            {
                text: '↩️ Назад',
                /**
                 * @type CommandCallback
                 */
                callback: async (reporter, message, listener) => {
                    await switchStateAndReplyWithKeyboard(
                        reporter,
                        listener,
                        message,
                        ListenerState.default,
                        'Возращаемся назад'
                    );
                },
            },
        ],
        /**
         * @type CommandCallback
         */
        defaultCallback: async (reporter, message, listener) => {
            if (message.content._ !== 'messageText') return;
            const chatName = message.content.text.text.replace(/\[.\] /gi, '');

            if (!reporter.observer.chats)
                await reporter.observer.getAndSaveChats();

            const chat = reporter.observer.chats.find(
                (chat) => chat.name === chatName
            );
            if (!chat) {
                await reporter.replyWithKeyboard(
                    listener,
                    message.id,
                    'Чат не найден!'
                );
                return;
            }

            allowList.setContents(
                getArrayWithSwitchedItem(allowList.contents, chat.id)
            );
            await reporter.replyWithKeyboard(
                listener,
                message.id,
                `Чат "${chat.name}" ${
                    allowList.contents.includes(chat.id)
                        ? 'теперь будет прослушиваться'
                        : 'больше не будет прослушиваться'
                }`,
                reporter.observer.chats
            );
        },
    },
};
export default Commands;

/**
 * @param {ListenerState} state
 * @param {string} text
 */
export function getCommandByText(state, text) {
    return Commands[state].commands.find((command) => command.text === text);
}
