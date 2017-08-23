require('require-self-ref')
const test = require('ava')

const rssDiff = require('~/src/rss-diff')

const beforeFeed = require('./fixtures/before_feed.json')
const afterFeed = require('./fixtures/after_feed.json')
const feedDiff = require('./fixtures/feed_diff.json')

test('test json diffing', t => {
    const calcDiff = rssDiff(beforeFeed, afterFeed, 'title')
    t.deepEqual(calcDiff, feedDiff)
})
