const fs = require('fs')
const path = require('path')
const marked = require('marked')
const puppeteer = require('puppeteer')  // 无头浏览器
// const { cosmiconfigSync } = require('cosmiconfig')

/**
 * 将指定路径的 md 文件转换为 png
 * @param {string} input 输入文件的路径（可能是相对路径，可能是绝对路径）
 * @param {object} param1 
 * */ 
module.exports = async (input, { output, width = 1000}) => {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof name}`)
  }
  // 这个路径指的是 相对命令行当前所在目录：process.cwd()
  // resolve 当输入的是 相对路径，默认会使用 process.cwd 进行拼接，是绝对路径，那就是那个路径
  const filename = path.resolve(input)
  // 判断这个文件是否存在，已经这个路径是否是一个 文件
  if (!fs.existsSync(filename)) {
    throw Error('当前文件路径不存在')
  }
  const stat = fs.statSync(filename)
  if (stat.isDirectory()) {
    throw Error('给定路径是一个文件夹，而不是文件')
  }
  console.log(filename)
  const contents = fs.readFileSync(filename, 'utf8')

  // 2、使用 marked 将 markdown 转换为 html
  const fragment = marked(contents)

  // console.log(contents, html)
  // 3、html 转换为 图片
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({width: width, height: 100})

  // const explorer = await cosmiconfigSync('md2png')
  // const { config = {} } = explorer.search(process.cwd()) || {}
  // console.log(config)
  // const html = config.template.replace('${fragment}', fragment);
  const html = `
    <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
          .markdown-body {
              width: 90%;
              max-width: 700px;
              margin: 30px auto;
          }
          </style>
          <link rel="stylesheet" href="https://unpkg.com/github-markdown-css@4.0.0/github-markdown.css">
      </head>
      <body class="markdown-body">
      ${fragment}
      </body>
  </html>`
  // await page.goto('https://www.baodu.com')
  await page.setContent(html)
  await page.screenshot({path: output, fullPage: true})
  await browser.close()
}
