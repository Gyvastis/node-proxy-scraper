const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Promise = require('bluebird');
const scrapeIt = require('scrape-it');

const Fetch = location =>
  fetch("https://www.free-proxy-list.net/", {
    "headers": {
      // "user-agent": null
    },
    "body": null,
    "method": "GET",
    "mode": "cors"
  })
  .then(data => data.text())
  .then(text => cheerio.load(text))
  .then($ => scrapeIt.scrapeHTML($, {
    proxies: {
      listItem: '#proxylisttable tbody tr',
      data: {
        ip: 'td:nth-child(1)',
        port: 'td:nth-child(2)',
        countryCode: 'td:nth-child(3)',
        anonymity: {
          selector: 'td:nth-child(5)',
          convert: x => x.replace(' proxy', ''),
        },
        protocol: {
          selector: 'td:nth-child(6)',
          convert: x => x === 'yes' ? 'https' : 'http',
        },
      }
    },
  }));

module.exports = Fetch;
