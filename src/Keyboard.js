import Commands from './Commands.js';
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
        rows: Commands[state].commands.map((command) => [
            createTextButton(command.text),
        ]),
    };
}

const Keyboard = {
    [ListenerState.default]: () =>
        createSimpleKeyboardForState(ListenerState.default),
    [ListenerState.addWord]: () =>
        createSimpleKeyboardForState(ListenerState.addWord),
    [ListenerState.unsubscribed]: () => ({
        _: 'replyMarkupRemoveKeyboard',
    }),
};

export default Keyboard;
