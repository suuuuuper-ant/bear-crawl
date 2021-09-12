'use strict';

const newsService = require('../services/NewsService');


exports.crawl = async (req, res) => {

  await newsService.CrawlNews();
  return res.r();
}


// module.exports = {CrawlConsensus}