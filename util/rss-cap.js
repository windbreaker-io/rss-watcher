require('require-self-ref')

const FeedParser = require('feedparser')
const request = require('request')
const fs = require('fs')
const Rx = require('rx')
const RxNode = require('rx-node')
const util = require('util')

const config = require('~/src/config')

config.load()

const PYPI_RSS_URL = config.getPypiRssUrl()

// Observer that takes values and writes them to a file
const writeObserver = Rx.Observer.create(
  async (next) => {
    const json = JSON.stringify(next, null, '  ')
    const datestring = (new Date().toISOString()) + '.json'
    const writeFile = util.promisify(fs.writeFile)
    try {
      await writeFile(datestring, json)
      console.log('Wrote rss feed out to: ' + datestring)
    } catch (error) {
      console.error(error)
    }
  },
  err => {
    console.log(err)
  },
  () => {
    console.log('Finished.')
  }
)

// Take requests and convert to observables
const requestObservable = function (req) {
  return RxNode.fromStream(req, 'end', 'response')
}

// Take request observables, parse them as RSS, and return results in an array
const feedObservable = function (res) {
  return RxNode.fromReadableStream(res.pipe(new FeedParser())).toArray()
}

// Generate a single request and store it in a file
Rx.Observable.from([request(PYPI_RSS_URL)])
  .flatMap(requestObservable)
  .flatMap(feedObservable)
  .subscribe(writeObserver)
