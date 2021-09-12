'use strict';

const consensusController = require('../consensus/controllers/ConsensusController')

module.exports = (router) => {

  router.route('/consensus')
    .get(consensusController.crawl);


  return router;
};