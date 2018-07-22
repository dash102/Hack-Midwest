var box = require('./box');

module.exports = {
  render: async function(id) {
    var file = await box.get(id);
    console.log(file);
  }
};
