const fetch = require('node-fetch');
const cheerio = require('cheerio');
const scrapeIt = require('scrape-it');

const Fetch = () =>
  fetch("https://www.proxynova.com/proxy-server-list/", {
    "credentials": "omit",
    "headers": {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
    },
    "method": "GET"
  })
  .then(data => data.text())
  .then(text => cheerio.load(text))
  .then($ => scrapeIt.scrapeHTML($, {
    proxies: {
      listItem: '#tbl_proxy_list tbody tr',
      data: {
        ip: {
          selector: 'td:nth-child(1)',
          how: 'html',
          convert: x => {
            const matches = /<script>document\.write\('([^\']+)/g.exec(x);
            if(!matches || !matches[1]) return null;
            return matches[1];
          },
        },
        port: 'td:nth-child(2)',
        countryCode: {
          selector: 'td:nth-child(6) img',
          attr: 'alt',
          convert: x => x.toUpperCase(),
        },
        anonymity: {
          selector: 'td:nth-child(7)',
          convert: x => x.toLowerCase(),
        },
        // protocol: null,
      }
    },
  }))
  .then(data => ({
    proxies: data.proxies.filter(proxy => proxy.ip !== null).map(proxy => ({
      ...proxy,
      protocol: null
    })),
  }));

module.exports = Fetch;
