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
     * @type {Array}
     */
    _contents;
    /**
     * @private
     * @type {Promise}
     */
    writingFilePromise = new Promise((resolve) => resolve());

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
        this._contents = JSON.parse(
            existsSync(this.filepath) ? readFileSync(this.filepath) : '[]'
        );
    }

    /**
     * @private
     */
    async writeFile() {
        console.log(this.filepath, JSON.stringify(this._contents));
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
