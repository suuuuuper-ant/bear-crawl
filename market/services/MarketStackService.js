const axios = require('axios');
const {Company} = require('../../company/entities/Company')
const {MarketStack} = require('../entities/MarketStack')
const url = require('url')
const _ = require('lodash');

const getCompanies = async () => {
  return await Company.findAll({
    where: {isKospi200: true},
  })
}

const fetchStockEod = async (symbols, limit = 10) => {
  const ACCESS_KEY = `e6b4be1e3b8ce8dec68813ae8bdcdfd2`;
  const baseURL = `http://api.marketstack.com/v1/eod?access_key=${ACCESS_KEY}&limit=${limit}`;
  const requestURLs = symbols.map(symbol => `${baseURL}&symbols=${symbol}`);


  const result = [];
  for (const requestURL of requestURLs) {
    const query = url.parse(requestURL, true).query;
    const symbol = query.symbols;
    const stockCode = symbol.split('.')[0]

    try {
      const response = await axios.get(requestURL);
      const data = response.data.data;

      const items = data.map(item => ({
        stockCode,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        date: item.date
      }))
      console.log(`${symbol} fetch success`)
      result.push(...items)
    } catch (e) {
      console.log('axios get error ', e.message);
    }

  }

  return result;
}

exports.CrawlMarketStackIncJob = async () => {
  try {
    const companies = await getCompanies();
    const symbols = companies.map(company => `${company.stockCode}.XKRX`)
    const result = await fetchStockEod(symbols, 1);
    await MarketStack.bulkCreate(result)
  } catch (e) {
  }

}

exports.CrawlMarketStackFullJob = async () => {

  const companies = await getCompanies();
  const symbols = companies.map(company => `${company.stockCode}.XKRX`)

  const result = await fetchStockEod(symbols, 160);
  await MarketStack.bulkCreate(_.flattenDeep(result))

}

// CrawlMarketStackFullJob().then(() => console.log('done'))
// CrawlMarketStackIncJob().then(() => console.log('inc job done'))

// module.exports = {
//   CrawlMarketStackFullJob,
//   CrawlMarketStackIncJob
// }
