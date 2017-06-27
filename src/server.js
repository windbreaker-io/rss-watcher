const FeedParser = require('feedparser')
const request = require('request')
const Rx = require('rx') 
const RxNode = require('rx-node')

// Event loop will run 3 times for testing
const interval = Rx.Observable.interval(5000).timeInterval().take(1)

const produceDiff = function(acc, cur) {
    console.log('!!!!!!!!!!!!!!!!!!!')
    console.log(acc.length)
    console.log(cur.length)
    console.log('+++++++++++++++++++')
    return cur
}

const req = request('https://pypi.python.org/pypi?%3aaction=rss')
const feedparser = new FeedParser()
RxNode.fromStream(req, 'end', 'response')
  .flatMap(x => RxNode.fromReadableStream(x.pipe(feedparser)))
  .buffer(Rx.Observable.fromEvent(req, 'end'))
  .scan(produceDiff, [])
  .subscribe(x => x)
