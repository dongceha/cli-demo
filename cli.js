#!/usr/bin/env node

const { program } = require('commander');
const pkg = require('./package.json');
const process = require('process');
const screenshot = require('screenshot-desktop');
const path = require('path');
const axios = require('axios');
const qs = require('qs');
const MD5 = require('./md5');

var appid = '';
var key = '';
var salt = (new Date).getTime();
var query = '老师与学生聊天';
// 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
var from = 'zh';
var to = 'en';
var str1 = appid + query + salt +key;
var sign = MD5(str1);


axios.get('http://api.fanyi.baidu.com/api/trans/vip/translate', {
  params: {
    q: query,
    appid: appid,
    salt: salt,
    from: from,
    to: to,
    sign: sign
  }
}).then(res => {
  console.log('res=====', res.data);
});

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

const cap = (index) => {
  screenshot({filename: path.resolve(`demo-${index}.png`), screen: index}).then(img => {
    console.log(img);
    cap(index + 1);
  }).catch(error => {
    console.log('error===', error)
  }) 
}

cap(0);