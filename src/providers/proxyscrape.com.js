const fetch = require('node-fetch');
const Promise = require('bluebird');
fetch.Promise = Promise;
const cheerio = require('cheerio');
const scrapeIt = require('scrape-it');

const fetchProxyList = (protocol, url) => 
    fetch(url, {
        "credentials": "omit",
        "headers": {
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
        },
        "method": "GET"
    })
    .then(data => data.text())
    .then(text => text.split("\r").map(proxy => proxy.trim()))
    .then(proxies => proxies.map(proxy => {
        const proxySplit = proxy.split(':');

        return {
            ip: proxySplit[0],
            port: proxySplit[1],
            countryCode: null,
            anonymity: null,
            protocol,
        }
    }).filter(proxy => proxy.ip !== null));

const Fetch = () => Promise.map([
    ["http", "https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=no&anonymity=all&simplified=true"],
    ["https", "https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=yes&anonymity=all&simplified=true"],
    ["socks4", "https://api.proxyscrape.com/v2/?request=getproxies&protocol=socks4&timeout=10000&country=all"],
    ["socks5", "https://api.proxyscrape.com/v2/?request=getproxies&protocol=socks5&timeout=10000&country=all"],
], item => fetchProxyList(item[0], item[1]), { concurrency: 1 }).then(proxies => ({
    proxies: [].concat(...proxies),
}));

module.exports = Fetch;
