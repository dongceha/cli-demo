#!/usr/bin/env node

const { program } = require('commander');
const pkg = require('./package.json');
const process = require('process');
const screenshot = require('screenshot-desktop');
const path = require('path');

program
  .version(pkg.version)
//   .command('rmdir')
    .usage('test_demo')
    .option('-H, --hh <h>', 'test hh')
    .option('-P, --pp <p>', 'test pp')
    .on('--help', console.log)
    .parse(process.argv);

const {hh, pp} = program.opts();
console.log('====', hh, pp)


// const execSync = require('child_process').execSync;

// execSync('shutdown -s -t 60');
// execSync('reboot');
screenshot({filename: path.resolve('demo.png'), screen: 1}).then(img => {
  console.log(img);
})