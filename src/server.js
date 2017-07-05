require('require-self-ref')

const config = require('~/src/config')

config.load()

const logger = require('~/src/logging').logger(module)
const FeedParser = require('feedparser')
const request = require('request')
const Rx = require('rx') 
const RxNode = require('rx-node')

const rssDiff = require('~/src/rss-diff')

const PYPI_RSS_URL = config.getPypiRssUrl()
const POLLING_INTERVAL = config.getPollingInterval()

// Set up an interval to poll the feed
const interval = Rx.Observable.interval(POLLING_INTERVAL).timeInterval().take(300)

const produceDiff = function(acc, cur) {
    // Here for debugging purposes
    if (!(JSON.stringify(cur) === JSON.stringify(acc))) {
        logger.debug('!!!!!!!!!!!!!!!!!!!')
        for (let i = 0; i < acc.length; i++) {
            logger.debug(acc[i]['title'])
        }
        logger.debug('(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)')
        for (let i = 0; i < cur.length; i++) {
            logger.debug(cur[i]['title'])
        }
        logger.debug('+++++++++++++++++++')
    }
    logger.debug(rssDiff(acc, cur, 'title'))
    return cur
}

// Take requests and convert to observables
const requestObservable = function(req) {
    return RxNode.fromStream(req, 'end', 'response')
}

// Take request observables, parse them as RSS, and return results in an array
const feedObservable = function(res) {
    return RxNode.fromReadableStream(res.pipe(new FeedParser)).toArray()
}

// Generate a new request for each interval
interval.map(() => request(PYPI_RSS_URL))
  .flatMap(requestObservable)
  .flatMap(feedObservable)
  // Pass the previous array and current array to produceDiff
  .scan(produceDiff, [])
  // Placeholder
  .subscribe(x => x)
