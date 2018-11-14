#!/usr/bin/env node

const path = require('path');
const debug = require('debug')('uron:uron-start');
const serve = require('koa-static');

/**
 * Parse Commands
 */
const program = require('commander');
program
    .version(require('../package').version, '-v, --version')
    .option('-p, --port <port>', 'Web Server Port', parseInt)
    .parse(process.argv);

/**
 * Execute Task
 */
const uronConfig = global.uronConfig = require('../config/resolve')();

let port;
if (program.port) {
    port = uronConfig.port = program.port;
} else {
    port = uronConfig.port;
}

let promise = Promise.resolve();

promise.then(() => {
    const options = Object.assign({}, uronConfig);

    const entryFile = path.resolve(process.cwd(), uronConfig.entry);
    const app = require(entryFile)(options);

    app.listen(port,'0.0.0.0', (err) => {
        if (err)
            return console.error(err);

        console.info(`Server listen on ${port}`);
    });
});
