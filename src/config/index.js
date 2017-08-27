const configUtil = require('windbreaker-service-util/config')

const Config = require('./Config')
const config = module.exports = new Config()

module.exports.load = async () => {
  await configUtil.load({ config })
}
