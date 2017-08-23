const BaseConfig = require('windbreaker-service-util/models/BaseServiceConfig')
const DefaultsMixin = require('fashion-model-defaults')

module.exports = BaseConfig.extend({
  mixins: [ DefaultsMixin ],
  properties: {
    logLevel: {
      description: 'Logging level',
      default: 'debug'
    },
    pypiRssUrl: {
      description: 'Url for Pypi\'s rss package feed',
      default: 'https://pypi.python.org/pypi?%3aaction=rss'
    },
    pollingInterval: {
      description: 'Polling interval in ms for fetching rss feeds',
      default: 2000
    }
  }
})
