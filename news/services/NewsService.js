const {News} = require('../entities/News');
const {Company} = require('../../company/entities/Company')
const Parser = require('rss-parser');
const R = require('ramda');
const parser = new Parser();
const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');


exports.CrawlNews = async () => {
  console.log('news crawl start')
  const companies = await Company.findAll({
    where: {isKospi200: true}
  })

  const getCompanyNews = R.pipe(
    R.map((company) => ({
      stockCode: company.stockCode,
      encodedName: encodeURI(company.shortName)
    })),
    R.map(async (company) => {
      const url = `https://news.google.com/rss/search?hl=ko&gl=KR&ie=UTF-8&ceid=KR%3Ako&q=${company.encodedName}+when:12h`;
      const feed = await parser.parseURL(url);
      return R
        .take(10, feed.items)
        .map((item) => {
          item.stockCode = company.stockCode
          return item;
        })
        .filter(item => item.stockCode)
    }),
    R.map(async items => {
      const list = await items;
      return [...new Map(list.map(item => [item['link'], item])).values()];
    }),
    // og tag crawl
    R.map(async items => {
      const list = (await items);
      const result = R.map(async news => {
        try {
          const config = {
            timeout: 1500,
            headers: {
              referer: 'https://naver.com',
              userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
              contentType: 'text/plain; charset=utf-8',
              'Accept': '*/*'
            },
            responseType: 'arraybuffer',

          };
          const response = await axios.get(news.link, config);
          // euc-kr 인코딩 변환
          const ctype = response.headers["content-type"].toLowerCase();
          if (!ctype.includes("charset=utf-8")) {
            response.data = iconv.decode(response.data, 'euc-kr');
          }
          const $ = cheerio.load(response.data);
          const ogImage = $("meta[property='og:image']").attr("content");
          const description = $("meta[property='og:description']").attr("content").substring(0, 250);

          // og tag 가 없을 경우 null 반환
          if (!ogImage) {
            return news;
          }

          // og tag 중 origin 값이 없을 경우 link 의 origin 사용
          if (!ogImage.includes("http")) {
            const url = new URL(news.link);
            news.imageUrl = url.origin + ogImage
            return news;
          }
          news.imageUrl = ogImage;
          news.description = description;
          return news;
        } catch (e) {
          return news
        }
      })(list);
      return await result;
    }),
    R.map(async items => {
      const list = await items;
      const resolve = await Promise.all(list);
      await News.bulkCreate(resolve);
    })
  )

  const splitCompanies = R.splitEvery(100, companies)

  for (const companies of splitCompanies) {
    await Promise.all(getCompanyNews(companies));
    console.log('promise all done')
  }
}


