t messageParser = require('windbreaker-service-util/queue/util/message-parser')equire('require-self-ref')

const config = require('~/src/config')
const { createProducer } = require('windbreaker-service-util/queue')

const DependencyUpdate = require('windbreaker-service-util/models/events/dependency/DependencyUpdate')
const DependencyType = require('windbreaker-service-util/models/events/dependency/DependencyType')

const Event = require('windbreaker-service-util/models/events/Event')
const EventType = require('windbreaker-service-util/models/events/EventType')

const { PYPI: PYPI_TYPE } = DependencyType

;(async function () {
  await config.load()

  const logger = require('~/src/logging').logger(module)
  const FeedParser = require('feedparser')
  const request = require('request')
  const Rx = require('rx')
  const RxNode = require('rx-node')

  const rssDiff = require('~/src/rss-diff')

  const PYPI_RSS_URL = config.getPypiRssUrl()
  const POLLING_INTERVAL = config.getPollingInterval()
  const PRODUCER_SETUP_DELAY = config.getProducerSetupDelay()
  const AMQ_URL = config.getAmqUrl()
  const QUEUE_NAME = config.getQueueName()

  // Set up the queue to push changes to
  const producerOptions = {
    queueName: QUEUE_NAME
  }

  const rabbitProducer = await Rx.Observable.fromPromise(createProducer({
      logger,
      amqUrl: AMQ_URL,
      producerOptions
  }))
  .delay(PRODUCER_SETUP_DELAY)
  .retry()
  .single()
  .toPromise();

  await rabbitProducer.start();

  // Set up an interval to poll the feed
  const interval = Rx.Observable.interval(POLLING_INTERVAL).timeInterval()
  const diffStream = new Rx.Subject();

  const produceDiff = function (acc, cur) {
    const diff = rssDiff(acc, cur, 'title')
    diffStream.onNext(diff)
    return cur
  }

  // Take requests and convert to observables
  const requestObservable = function (req) {
    return RxNode.fromStream(req, 'end', 'response')
  }

  // Take request observables, parse them as RSS, and return results in an array
  const feedObservable = function (res) {
    return RxNode.fromReadableStream(res.pipe(new FeedParser())).toArray()
  }

  // Generate a new request for each interval
  interval.map(() => request(PYPI_RSS_URL))
    .flatMap(requestObservable)
    .flatMap(feedObservable)
    // Pass the previous array and current array to produceDiff
    .scan(produceDiff, [])
    // Placeholder
    .subscribe(x => x)

  diffStream.skip(1).subscribe(x => x.map(rabbitProducer.sendMessage))
})()
