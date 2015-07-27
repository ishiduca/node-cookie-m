module.exports = function stringify (o) {
    return Object.keys(o).map(function (key) {
        return o[key].map(function (pair) {
            return pair[1] ? Array.isArray(pair[1]) ? [pair[0], pair[1].toString()].join('=') : pair.join('=') : pair[0]
        }).join('; ')
    })
}
