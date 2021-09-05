const Element = require('cheerio').Element;
const cheerio = require('cheerio');
const Cheerio = cheerio.Cheerio;
// const puppeteerCore = require('puppeteer-core/lib/cjs/puppeteer/node-puppeteer-core');
const puppeteerCore = require('puppeteer-core');
const dayjs = require('dayjs');
// const {Consensus} = require('../entities/Consensus');

exports.CrawlConsensus = async () => {

  console.log('adfadsf')
  const env = process.env.NODE_ENV || 'local';
  const options =
    env === 'local' ?
      {
        executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
      } :
      {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      }
  const browser = await puppeteerCore.launch(options)

  const page = await browser.newPage();
  const targetDay = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  // console.log(targetDay)
  // const url = `http://consensus.hankyung.com/apps.analysis/analysis.list?&sdate=${targetDay}&edate=${targetDay}&report_type=CO&order_type=&pagenum=80`;
  const url = `http://consensus.hankyung.com/apps.analysis/analysis.list?&sdate=2021-08-25&edate=${targetDay}&report_type=CO&order_type=&pagenum=80`;
  console.log(url);
  await page.goto(url);

  const dom = await page.evaluate(() => document.querySelector('.table_style01').innerHTML)

  const $ = cheerio.load(dom)

  const data = [];
  $('tbody > tr').each(async function (index, element) {

    const date = $(this).find('td.first.txt_number').text()
    const title = $(this).find('strong').text()
    const price = $(this).find('td.text_r.txt_number').text()
    const opinion = $(this).find('td:nth-child(4)').text().trim()
    const writer = $(this).find('td:nth-child(5)').text().trim().replace(" ", "")
    const source = $(this).find('td:nth-child(6)').text().trim()
    const chart = $(this).find('td:nth-child(8) > div > a').attr('href')
    const file = $(this).find('td:nth-child(9) > div > a').attr('href')
    data.push({
      date,
      title,
      price,
      opinion,
      writer,
      source,
      chart,
      file,
      name: '',
      stockCode: '',
      info: '',
    })
  })

  const result = data
    .filter(item => item.title.includes('('))
    .map(item => {
      const index1 = item.title.indexOf('(')
      const index2 = item.title.indexOf(')')
      const name = item.title.substring(0, index1)
      const stockCode = item.title.substring(index1 + 1, index2)
      const info = `http://media.kisline.com/highlight/mainHighlight.nice?paper_stock=${stockCode}&nav=1`

      item.name = name;
      item.stockCode = stockCode;
      item.info = info;
      return item;
    })


  result.forEach(item => {
    console.log(item)
  })


  // await Consensus.bulkCreate(result)
  await browser.close();

}

