'use strict';

const marketService = require('../services/MarketStackService');


exports.crawlInc = async (req, res) => {
  await marketService.CrawlMarketStackIncJob();
  return res.r();
}

exports.crawlFull = async (req, res) => {
  await marketService.CrawlMarketStackFullJob();
  return res.r();
}


// module.exports = {CrawlConsensus}