#!/usr/bin/env node

const path = require('path');
const opn = require('opn');
const debug = require('debug')('uron:uron-dev');

/**
 * Parse Commands
 */
const program = require('commander');
program
    .version(require('../package').version, '-v, --version')
    .option('-o, --open-browser', 'Open browser when start server')
    .option('--web-host <webHost>', 'Web url when open browser')
    .option('-p, --port <port>', 'Web Server Port', parseInt)
    .option('-n, --only-node', 'Only launch server')
    .parse(process.argv);

/**
 * Execute Task
 */
process.env.NODE_ENV = 'development';

const uronConfig = global.uronConfig = require('../config/resolve')();

let port;
if (program.port) {
    port = uronConfig.port = program.port;
} else {
    port = uronConfig.port;
}

const url = `http://${program.webHost || 'localhost'}:${port}`;

const options = Object.assign({}, uronConfig);
const entryFile = path.resolve(process.cwd(), uronConfig.entry);
const app = require(entryFile)(options);

app.listen(port,'0.0.0.0', (err) => {
    if (err)
        return console.error(err);

    if (program.openBrowser) {
        debug('openBrowser,url is: %s', url);
        opn(url);
    }

    console.info(`Server listen on ${port}`);
});
