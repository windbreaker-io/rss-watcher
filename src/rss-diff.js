function rssDiff(itemBefore, itemAfter, field) {
    let beforeMap = {}
    let out = []
    let indicies = []

    // Create a map of field to index for first array
    for (let i = 0; i < itemBefore.length; i++) {
        beforeMap[itemBefore[i][field]] = i
    }

    // If element in second array does not exist in previous map, store its index
    for (let i = 0; i < itemAfter.length; i++) {
        if (!(itemAfter[i][field] in beforeMap)) {
           indicies.push(i)
        }
    }

    // Collect all the new updates
    for (index of indicies) {
        out.push(itemAfter[index])
    }
    return out
}

exports.rssDiff = rssDiff
