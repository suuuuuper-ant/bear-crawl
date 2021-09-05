'use strict';

const crawlService = require('../services/ConsensusService');


exports.crawl = async (req, res) => {

  await crawlService.CrawlConsensus();
  return res.r();
}


// module.exports = {CrawlConsensus}