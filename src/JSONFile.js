import { existsSync, readFileSync } from 'fs';
import { writeFile as writeFileAsync } from 'fs/promises';

export default class JSONFile {
    /**
     * @private
     * @type {string}
     */
    filepath;
    /**
     * @private
     * @type {Promise}
     */
    writingFilePromise = new Promise((resolve) => resolve());

    /**
     * @private
     * @type {Array}
     */
    _contents;
    get contents() {
        return this._contents;
    }
    /**
     * @param {Array} contents
     */
    async setContents(contents) {
        this._contents = contents;
        await this.writingFilePromise;
        this.writingFilePromise = this.writeFile();
    }

    /**
     * @private
     */
    readFile() {
        try {
            this._contents = JSON.parse(
                existsSync(this.filepath) ? readFileSync(this.filepath) : '[]'
            );
        } catch (error) {
            this._contents = [];
        }
    }

    /**
     * @private
     */
    async writeFile() {
        await writeFileAsync(this.filepath, JSON.stringify(this._contents));
    }

    /**
     * @param {string} filepath
     */
    constructor(filepath) {
        this.filepath = filepath;
        this.readFile();
    }
}
