const BaseConfig = require('windbreaker-service-util/models/BaseServiceConfig')
const DefaultsMixin = require('fashion-model-defaults')

module.exports = BaseConfig.extend({
  mixins: [ DefaultsMixin ],
  properties: {
    amqUrl: {
      description: 'The url used to access activeMQ',
      default: 'amqp://rabbitmq'
    },
    logLevel: {
      description: 'Logging level',
      default: 'debug'
    },
    queueName: {
      description: 'The name of the queue to which events are published',
      default: 'events'
    },
    pypiRssUrl: {
      description: 'Url for Pypi\'s rss package feed',
      default: 'https://pypi.python.org/pypi?%3aaction=rss'
    },
    pollingInterval: {
      description: 'Polling interval in ms for fetching rss feeds',
      default: 2000
    },
    producerSetupDelay: {
      description: 'Wait time for producer to be set up',
      default: 1000
    }
  }
})
