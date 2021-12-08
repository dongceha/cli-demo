#!/usr/bin/env node

const { program } = require('commander');
const axios = require('axios');
const MD5 = require('../utils/md5');
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

program
    .version(pkg.version)
    .usage('翻译')
    .option('-F, --from <from>', '原始语言 如 zh')
    .option('-T, --to <to>', '结果语言 如 en')
    .on('--help', console.log)
    .parse(process.argv);

const { from = 'zh', to = 'en' } = program.opts();

const cwd = process.cwd();

const dirs = fs.readdirSync(cwd);
const query = []

for (dir of dirs) {
  const stat = fs.statSync(path.resolve(dir));
  if (stat.isFile() && dir.endsWith('.js')) {
    const index = dir.indexOf('.js')
    query.push(dir.substr(0, index));
  }
}

async function queryWords() {
  for  (const q of query) {
    var appid = '20211207001021919';
    var key = 'NrqHp3C0VYarYhMZFkn7';
    var salt = Date.now();
    // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
    // var from = 'zh';
    // var to = 'en';
    var str1 = appid + q + salt +key;
    var sign = MD5(str1);
    await axios.get('http://api.fanyi.baidu.com/api/trans/vip/translate', {
      params: {
        q,
        appid: appid,
        salt: salt,
        from: from,
        to: to,
        sign: sign
      }
    }).then(res => {
      const trans = res.data.trans_result?.[0].dst;
      try {
        fs.rename(
          path.resolve(`${q}.js`),
          path.resolve(`${trans.replaceAll(' ', '-')}.js`),
          (err) => {
            console.log('rename====', err)
          }
        );
      } catch (error) {
        console.log('catch===', error);
      }
    });
    await sleep();
  }
}

queryWords();
