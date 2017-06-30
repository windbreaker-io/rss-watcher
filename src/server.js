const FeedParser = require('feedparser')
const request = require('request')
const Rx = require('rx') 
const RxNode = require('rx-node')

const rssDiff = require('./rss-diff')

// Event loop will run 3 times for testing
const interval = Rx.Observable.interval(20000).timeInterval().take(300)

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

const url = 'https://pypi.python.org/pypi?%3aaction=rss'

// Take requests and convert to observables
const requestObservable = function(req) {
    return RxNode.fromStream(req, 'end', 'response')
}

// Take request observables, parse them as RSS, and return results in an array
const feedObservable = function(res) {
    return RxNode.fromReadableStream(res.pipe(new FeedParser)).toArray()
}

// Generate a new request for each interval
interval.map(x => request(url))
  .flatMap(requestObservable)
  .flatMap(feedObservable)
  // Pass the previous array and current array to produceDiff
  .scan(produceDiff, [])
  // Placeholder
  .subscribe(x => x)
