/**
 * @param {Array} array
 * @param {*} item
 */
function getIndex(array, item) {
    return array.findIndex((value) => value === item);
}

/**
 * @param {Array} array
 * @param {*} item
 * @param {*} replacement
 */
export function getArrayWithReplacedItem(array, item, replacement) {
    const itemIndex = getIndex(array, item);
    return array.toSpliced(itemIndex, 1, replacement);
}

/**
 * @param {Array} array
 * @param {*} item
 */
export function getArrayWithoutItem(array, item) {
    return array.toSpliced(getIndex(array, item), 1);
}

/**
 * Switches item: if it was in array, it will be removed, and if it wasn't, it will be added.
 * @param {Array} array
 * @param {*} item
 */
export function getArrayWithSwitchedItem(array, item) {
    const itemIndex = getIndex(array, item);
    if (itemIndex === -1) {
        return [...array, item];
    }
    return getArrayWithoutItem(array, item);
}
