const fetch = require('node-fetch');
const Promise = require('bluebird');
fetch.Promise = Promise;

const availableProtocols = [
  'http',
  'https',
  'socks4',
  'socks5',
];

const Fetch = protocol =>
  fetch(`https://www.proxy-list.download/api/v0/get?l=en&t=${protocol}`, {
    "credentials": "omit",
    "headers": {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
    },
    "method": "GET"
  })
  .then(data => data.text())
  .then(JSON.parse)
  .then(json => json[0].LISTA)
  .then(proxies => proxies.map(proxy => ({
    ip: proxy.IP,
    port: proxy.PORT,
    countryCode: proxy.ISO,
    anonymity: proxy.ANON.toLowerCase(),
    protocol,
  })));

  const FetchAll = () => Promise.map(availableProtocols, protocol => Fetch(protocol), {
    concurrency: 3
  })
  .then(proxyArray => {
    const allProxies = [];

    proxyArray.map(proxies => proxies.map(proxy => {
      allProxies.push(proxy);
    }));

    return {
      proxies: allProxies,
    };
  });

module.exports = FetchAll;
