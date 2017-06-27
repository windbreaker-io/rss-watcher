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

// Set up the node streams
const req = request('https://pypi.python.org/pypi?%3aaction=rss')
const feedparser = new FeedParser()

// Convert the request stream into an Rx observable
RxNode.fromStream(req, 'end', 'response')
  // Map the events from the request Observable to an observable made from the FeedParser
  .flatMap(x => RxNode.fromReadableStream(x.pipe(feedparser)))
  // Collect events from parsing the RSS feed into a single array
  .buffer(Rx.Observable.fromEvent(req, 'end'))
  // Use scan to compare the most recent feed to the previous
  .scan(produceDiff, [])
  // NOP subscribe for now to complete the chain
  .subscribe(x => x)
