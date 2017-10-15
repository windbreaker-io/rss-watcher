const { fork } = require('child_process')
const nock = require('nock')
const test = require('ava')
const uuid = require('uuid/v4')

const { createConsumer } = require('windbreaker-service-util/queue')

const PYPI_URL = 'https://pypi.python.org/pypi?%3aaction=rss'

test.beforeEach('setup queue consumer', async (t) => {
  t.context.messages = []
  t.context.onMessage = msg => {
    messages.push(msg)
  }

  t.context.queueName = uuid()
  const rabbitConsumer = await createConsumer({
    logger: console,
    amqUrl: 'rabbitmq',
    onMessage: t.context.onMessage,
    consumerOptions: {queueName: t.context.queueName}
  })
})

test('should push pypi changes to RabbitMQ', async (t) => {
  const rssWatcherProc = fork('../../src/server.js', [], {
    stdio: 'pipe'
  })
})
