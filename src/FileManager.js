import JSONFile from './JSONFile.js';

/**
 * @readonly
 */
export const listeners = new JSONFile('listeners.json');
/**
 * @readonly
 */
export const wordsToLookFor = new JSONFile('wordsToLookFor.json');
/**
 * @readonly
 */
export const allowList = new JSONFile('allowList.json');
