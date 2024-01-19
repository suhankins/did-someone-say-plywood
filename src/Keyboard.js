import Commands from './Commands.js';
import { wordsToLookFor } from './FileManager.js';
import ListenerState from './Listener/ListenerState.js';

/**
 * @param {string} text
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

const Keyboard = {
    [ListenerState.default]: () =>
        createSimpleKeyboardForState(ListenerState.default),
    [ListenerState.addWord]: () =>
        createSimpleKeyboardForState(ListenerState.addWord),
    [ListenerState.listAll]: () => ({
        _: 'replyMarkupShowKeyboard',
        rows: wordsToLookFor.contents.toReversed().reduce(
            /**
             * @param {string[][]} acc
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
    [ListenerState.unsubscribed]: () => ({
        _: 'replyMarkupRemoveKeyboard',
    }),
};

export default Keyboard;
