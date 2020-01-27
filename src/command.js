const util = require('util');
const fs = require('fs');
const domainSearch = require('./search');

const writeOutput = data => {
  try {
    fs.writeFileSync('./output/output.json', JSON.stringify(data, null, 4));
  } catch (err) {
    // An error occurred
    console.error(err);
  }
}

domainSearch(
  process.argv[2] !== undefined ? process.argv[2] : null
).then(data => {
  writeOutput(data);
  // console.log(data)
  console.log(util.inspect(data, false, null, true));
});
