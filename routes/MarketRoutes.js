'use strict';

const marketController = require('../market/controllers/MarketController')

module.exports = (router) => {

  router.route('/markets/inc')
    .get(marketController.crawlInc);

  router.route('/markets/full')
    .get(marketController.crawlFull);

  return router;
};