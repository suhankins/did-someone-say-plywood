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
    return Commands[state].commands.map((command) => [
        createTextButton(command.text),
    ]);
}

const Keyboard = {
    [ListenerState.default]: () => ({
        _: 'replyMarkupShowKeyboard',
        rows: createSimpleKeyboardForState(ListenerState.default),
    }),
    [ListenerState.unsubscribed]: () => ({
        _: 'replyMarkupRemoveKeyboard',
    }),
};

export default Keyboard;
