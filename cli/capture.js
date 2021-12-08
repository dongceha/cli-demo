#!/usr/bin/env node

const { program } = require('commander');
const pkg = require('../package.json');
const process = require('process');
const screenshot = require('screenshot-desktop');
const path = require('path');

program
    .version(pkg.version)
    .usage('capture the screen')
    .option('-S, --screen <h>', 'the index of screen')
    .on('--help', console.log)
    .parse(process.argv);

const { screen } = program.opts();

const cap = (index, next = true) => {
  screenshot({filename: path.resolve(`demo-${index}.png`), screen: index}).then(img => {
    console.log(img);
    next && cap(index + 1);
  }).catch(error => {
  }) 
}

if (screen) {
  cap(~~screen, false);
} else {
  cap(0);
}
