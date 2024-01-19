import { listeners } from './FileManager.js';
import ListenerState from './Listener/ListenerState.js';
import {
    getArrayWithReplacedItem,
    getArrayWithoutItem,
} from './utils/arrayUtils.js';

/**
 * @typedef {import('./Listener/createListener.js').Listener} Listener
 */
/**
 * @typedef {import('./Reporter.js').default} Reporter
 */
/**
 * @typedef {import('./Reporter.js').Message} Message
 */
/**
 * @typedef {(reporter: Reporter, message: Message, listener: Listener) => Promise<void>} CommandCallback
 */

const Commands = {
    [ListenerState.default]: {
        commands: [
            {
                text: 'Посмотреть все слова',
                /**
                 * @type CommandCallback
                 */
                callback: async (reporter, message, listener) => {},
            },
            {
                text: 'Добавить слово',
                /**
                 * @type CommandCallback
                 */
                callback: async (reporter, message, listener) => {
                    const newListener = {
                        ...listener,
                        state: ListenerState.addWord,
                    };
                    listeners.setContents(
                        getArrayWithReplacedItem(
                            listeners.contents,
                            listener,
                            newListener
                        )
                    );
                    await reporter.replyWithKeyboard(
                        newListener,
                        message.id,
                        'Введите слово (или регулярное выражение)'
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
                callback: async (reporter, message, listener) => {},
            },
        ],
        defaultCallback: async (reporter, message, listener) => {},
    },
    [ListenerState.listAll]: {
        commands: [],
        defaultCallback: async (reporter, message, listener) => {},
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
