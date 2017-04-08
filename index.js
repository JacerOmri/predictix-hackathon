#!/usr/bin/env node

const cli = require('cli');
const loader = require('./lib/loader').stdin;
const parser = require('./lib/parser');
const Output = require('./lib/output');

cli.withStdin(input => {
    loader.load(input)
    .then(parser.parse)
    .then((graph) => {
        builder = new Output(graph);
        return builder.build();
    })
    .then(console.log)
    .catch(console.log);
});