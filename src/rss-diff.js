/**
* Returns the added packages between two rss feed captures
* @param itemBefore {Array} The first rss capture
* @param itemAfter {Array} The second rss capture
* @param field {String} The field of each rss item to diff off of
* @return {Array} The packages added between the two captures
*/
module.exports = function rssDiff(itemBefore, itemAfter, field) {
    let beforeMap = {}
    let out = []

    // Create a map of field for first array
    for (let i = 0; i < itemBefore.length; i++) {
        beforeMap[itemBefore[i][field]] = true
    }

    // If element in second array does not exist in previous map, add it to out
    for (let i = 0; i < itemAfter.length; i++) {
        if (!(itemAfter[i][field] in beforeMap)) {
           out.push(itemAfter[i])
        }
    }
    return out
}
