'use strict';

const newsController = require('../news/controllers/NewsController')

module.exports = (router) => {

  router.route('/news')
    .get(newsController.crawl);


  return router;
};