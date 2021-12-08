#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')
const md2Png = require('../utils/md2png')   // lib/index.js
const inquirer = require('inquirer')

program
  .version(pkg.version)
  .usage('<input>')  // 用户传递过来的 md 文件路径
  .option('-O, --output <output>', '输出图片文件路径')
  // .option('-W, --width <width>', '图片宽度')
  .on('--help', console.log)
  .parse(process.argv)  // process.argv 用户输入和路径，而上面的 commander 是对其进行解析 
  .args.length || program.help()

inquirer.prompt([
  {type: 'number', name: 'width', message: '图片宽度'}
]).then(answers => {
  const { args } = program;
  const { output } = program.opts();
  const [ input ] = args;
  console.log(input, output, answers);
  md2Png(input, { output, width: ~~answers.width });
});
