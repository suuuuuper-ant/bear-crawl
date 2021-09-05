'use strict';

const consensusController = require('../consensus/controllers/ConsensusController')

module.exports = (router) => {

  router.route('/')
    .get(consensusController.crawl);


  return router;
};