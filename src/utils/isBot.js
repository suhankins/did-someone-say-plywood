/**
 * @typedef {import('../types/User.js').User} User
 */

/**
 * @param {User} user
 */
export default function isBot(user) {
    return user.type._ === 'userTypeBot';
}
