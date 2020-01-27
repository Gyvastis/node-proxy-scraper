// const fetch = require('node-fetch');
const cloudscraper = require('cloudscraper');
const cheerio = require('cheerio');
const scrapeIt = require('scrape-it');

const Fetch = () =>
  cloudscraper("https://hidemy.name/en/proxy-list/")
  // .then(data => data.text())
  .then(text => cheerio.load(text))
  .then($ => scrapeIt.scrapeHTML($, {
    proxies: {
      listItem: 'table tbody tr',
      data: {
        ip: 'td:nth-child(1)',
        port: 'td:nth-child(2)',
        countryCode: {
          selector: 'td:nth-child(3) .flag-icon',
          attr: 'class',
          convert: x => x.replace('flag-icon flag-icon-').toUpperCase().replace('UNDEFINED', ''),
        },
        anonymity: {
          selector: 'td:nth-child(6)',
          convert: x => {
            switch (x) {
              case 'High':
                return 'elite';
              case 'Medium':
                return 'anonymous';
              case 'No':
                return 'transparent';
            }
          },
        },
        protocol: {
          selector: 'td:nth-child(5)',
          convert: x => x.toLowerCase().split(',').map(p => p.trim())
        },
      }
    },
  }));

module.exports = Fetch;
