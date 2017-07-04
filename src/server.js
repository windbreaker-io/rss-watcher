require('require-self-ref')

const FeedParser = require('feedparser')
const request = require('request')
const Rx = require('rx') 
const RxNode = require('rx-node')

const rssDiff = require('~/src/rss-diff')
const config = require('~/src/config')

config.load()

const PYPI_RSS_URL = config.getPypiRssUrl()
const POLLING_INTERVAL = config.getPollingInterval()

// Event loop will run 3 times for testing
const interval = Rx.Observable.interval(POLLING_INTERVAL).timeInterval().take(300)

const produceDiff = function(acc, cur) {
    // Here for debugging purposes
    if (!(JSON.stringify(cur) === JSON.stringify(acc))) {
        console.log('!!!!!!!!!!!!!!!!!!!')
        for (let i = 0; i < acc.length; i++) {
            console.log(acc[i]['title'])
        }
        console.log('(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)(-)')
        for (let i = 0; i < cur.length; i++) {
            console.log(cur[i]['title'])
        }
        console.log('+++++++++++++++++++')
    }
    console.log(rssDiff.rssDiff(acc, cur, 'title'))
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
