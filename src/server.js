const FeedParser = require('feedparser')
const request = require('request')
const Rx = require('rx') 
const RxNode = require('rx-node')

// Event loop will run 3 times for testing
const interval = Rx.Observable.interval(5000).timeInterval().take(1)

const getFeed = function(iteration) {
    console.log(iteration)
    let req = request('https://pypi.python.org/pypi?%3aaction=rss')
    let feedparser = new FeedParser()
    let items = []
    req.on('response', function(res) {
        let stream = this

        if (res.statusCode != 200) {
            //stream.emit('error', new Error('bad status code'))
            console.log(res.statuscode)
        } else {
            stream.pipe(feedparser)
        }
    })


    feedparser.on('readable', function() {
        let stream = this
        let item

        while ((item = stream.read())) {
            items.push(item)
        }
    })

    return new Promise((res, reject) => {
        feedparser.on('error', reject)
        req.on('error', reject)
        feedparser.on('end', () => {
            resolve(items)
        })
    })
}

const req = request('https://pypi.python.org/pypi?%3aaction=rss')
const feedparser = new FeedParser()
RxNode.fromStream(req, 'end', 'response')
  .flatMap(x => RxNode.fromReadableStream(x.pipe(feedparser)))
  .buffer(Rx.Observable.fromEvent(req, 'end'))
  .subscribe(x => console.log(x))

const eventLoop = Rx.Observer.create(
    function(val) {
        console.log(val)
    },
    function(error) {
        console.log(error)
    },
    function() {
        console.log('Completed')
    }
)

const produceDiff = function(acc, cur) {
    console.log(acc)
    console.log(cur)
    return cur
}

//interval.map(getFeed).subscribe(eventLoop)
