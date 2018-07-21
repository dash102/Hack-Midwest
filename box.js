var box = require('box-node-sdk');
var fs = require('fs');
var readable = require('stream').Readable;

const config = JSON.parse(fs.readFileSync('box_config.json', encoding='utf-8'));
const sdk = box.getPreconfiguredInstance(config);
const client = sdk.getAppAuthClient('enterprise', config.enterpriseID);

function callback(err, res) {

}

module.exports = {
  put: function(data) {
    const folderId = '0';
    const fileName = guid();

    const stream = new Readable();
    s._read = () => {};
    s.push(data);
    s.push(null);

    client.files.uploadFile(
      folderId, fileName, stream, callback
    );
  },
  get: function() {
    client.files.getReadStream('306452299841', null, (error, file) => {
      if(!error) {
        var output = fs.createWriteStream('output.txt');
        file.pipe(output);
      }
    });

  }
}
