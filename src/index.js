import * as tdl from 'tdl';
import { getTdjson } from 'prebuilt-tdlib';
import Observer from './Observer.js';
import Reporter from './Reporter.js';

tdl.configure({ tdjson: getTdjson() });

const clientOptions = {
    apiId: process.env.API_ID,
    apiHash: process.env.API_HASH,
};
const token = process.env.BOT_TOKEN;
const password = process.env.PASSWORD;

const observer = new Observer({
    ...clientOptions,
    databaseDirectory: 'observer_db',
    filesDirectory: 'observer_files',
});
observer.main().catch(console.error);

new Reporter(
    {
        ...clientOptions,
        databaseDirectory: 'reporter_db',
        filesDirectory: 'reporter_files',
    },
    token,
    password,
    observer
)
    .main()
    .catch(console.error);
