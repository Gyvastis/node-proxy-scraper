const util = require('util');
const fs = require('fs');
const { uniqWith, isEqual } = require('lodash');
const domainSearch = require('./search');

const writeOutput = data => {
  try {
    fs.writeFileSync('./output/output.json', JSON.stringify(data, null, 4));

    let dataMerged = [];
    data.map(dataItem => dataItem.proxies.map(proxy => dataMerged.push(proxy)))
    dataMerged = uniqWith(dataMerged, isEqual)

    console.log(dataMerged.length, dataMerged.filter(proxy => proxy.ip && proxy.ip.length > 0).length);
    fs.writeFileSync('./output/output.merged.json', JSON.stringify(dataMerged, null, 4));
  } catch (err) {
    // An error occurred
    console.error(err);
  }
}

domainSearch(
  process.argv[2] !== undefined ? process.argv[2] : null
).then(data => {
  // console.log(data)
  console.log(util.inspect(data, false, null, true));
  writeOutput(data);
});
