const {resolve} = require('path');
const uuid = require('uuid/v4');

module.exports = () => resolve(__dirname, '../output', uuid());
