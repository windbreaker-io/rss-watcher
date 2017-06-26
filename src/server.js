const FeedParser = require('feedparser')
const request = require('request')
const Rx = require('rx') 

// Event loop will run 3 times for testing
const interval = Rx.Observable.interval(5000).timeInterval().take(3)

const eventLoop = interval.subscribe(
    function(val) {
        // Log what loop interval we are on
        console.log(val)

        let req = request('https://pypi.python.org/pypi?%3Aaction=rss')
        let feedparser = new FeedParser()
        req.on('response', function(res) {
            let stream = this

            if (res.statusCode != 200) {
                stream.emit('error', new Error('Bad status code'))
            } else {
                stream.pipe(feedparser)
            }
        })

        feedparser.on('readable', function() {
            let stream = this
            let item

            while ((item = stream.read())) {
                console.log(item)
            }
        })
    },
    function(error) {
        console.log(error)
    },
    function() {
        console.log('Completed')
    }
)
