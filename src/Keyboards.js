import Commands from './Commands.js';
import { allowList, wordsToLookFor } from './FileManager.js';
import ListenerState from './Listener/ListenerState.js';

/**
 * @typedef {import('./types/KeyboardButton.js').KeyboardButton} KeyboardButton
 */
/**
 * @typedef {import('./types/Keyboard.js').Keyboard} Keyboard
 */
/**
 * @typedef {import('./types/Chat.js').Chat} Chat
 */

/**
 * @param {string} text
 * @returns {KeyboardButton}
 */
function createTextButton(text) {
    return {
        text: text,
        type: {
            _: 'keyboardButtonTypeText',
        },
    };
}

/**
 * @param {ListenerState} state
 */
function createSimpleKeyboardForState(state) {
    return {
        _: 'replyMarkupShowKeyboard',
        rows: getButtonsForState(state).map((button) => [button]),
    };
}

/**
 * @param {ListenerState} state
 */
function getButtonsForState(state) {
    return Commands[state].commands.map((command) =>
        createTextButton(command.text)
    );
}

/**
 * @type {{[state: ListenerState]: (...params: any[]) => Keyboard}}
 */
const Keyboards = {
    [ListenerState.default]: () =>
        createSimpleKeyboardForState(ListenerState.default),
    [ListenerState.addWord]: () =>
        createSimpleKeyboardForState(ListenerState.addWord),
    [ListenerState.listAll]: () => ({
        _: 'replyMarkupShowKeyboard',
        rows: wordsToLookFor.contents.toReversed().reduce(
            /**
             * @param {KeyboardButton[][]} acc
             * @param {string} current
             */
            (acc, current) => {
                const button = createTextButton(current);
                if (acc[0].length < 2)
                    return acc.toSpliced(0, 1, [button, ...acc[0]]);
                return acc.toSpliced(0, 0, [button]);
            },
            [[], getButtonsForState(ListenerState.listAll)]
        ),
    }),
    /**
     * @param {Chat[]} chats
     */
    [ListenerState.chats]: (chats) => {
        if (!chats) throw new Error('No chats were given!');
        return {
            _: 'replyMarkupShowKeyboard',
            rows: chats.reduce(
                /**
                 * @param {KeyboardButton[][]} acc
                 * @param {Chat} current
                 */
                (acc, current) => {
                    const isInAllowList = allowList.contents.includes(current.id);
                    const button = createTextButton(`[${isInAllowList ? '✅' : '❌'}] ${current.name}`);
                    if (acc[0].length < 2)
                        return acc.toSpliced(0, 1, [button, ...acc[0]]);
                    return acc.toSpliced(0, 0, [button]);
                },
                [[], getButtonsForState(ListenerState.chats)]
            ),
        };
    },
    [ListenerState.unsubscribed]: () => ({
        _: 'replyMarkupRemoveKeyboard',
    }),
};

export default Keyboards;
