var box = require('box-node-sdk');
var fs = require('fs');

const config = JSON.parse(fs.readFileSync('box_config.json', encoding='utf-8'));
const sdk = box.getPreconfiguredInstance(config);
const client = sdk.getAppAuthClient('enterprise', config.enterpriseID);

function uuid() {
  var uuid = "", i, random;
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;

    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid += "-"
    }
    uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uuid;
}

module.exports = {
  put: function(data, callback, callbackParams) {
    const folderId = '0';
    const fileName = uuid().toString();

    client.files.uploadFile(
      folderId, fileName, data.toString(), (err, res) => { err ? console.log(err) : callback(res.entries[0].id, callbackParams) }
    );
  },
  get: function(fileId, callback) {
    client.files.getReadStream(fileId, null, (error, file) => {
      if(error) {
        console.log('Invalid file ID');
        return;
      }

      const chunks = [];
      file.on('data', (chunk) => { chunks.push(chunk) });
      file.on('end', () => { callback(chunks.length === 1 ? chunks[0].toString('utf-8') : Buffer.concat(chunks).toString('utf-8')) });
    });

  }
}
