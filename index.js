var parse     = require('./lib/parse')
var stringify = require('./lib/stringify')

module.exports = Cookie

function Cookie (req, res) {
    if (!(this instanceof Cookie)) return new Cookie(req, res)

    this.cookies    = parse(req.headers.cookie || '')
    this.setCookies = {}

    var me = this
    var writeHead = res.writeHead

    res.writeHead = function () {
        finalize(this)
        writeHead.apply(this, arguments)
    }

    function finalize (res) {
        var setCookies = stringify(me.setCookies)
        setCookies.length > 0 && res.setHeader('set-cookie', setCookies)
    }
}

Cookie.prototype.get = function (key) {
    return this.cookies[key]
}

Cookie.prototype.put = function (key, val, _opt) {
    var opt = _opt || {}
    opt.path || (opt.path = '/')
    this.setCookies[key] = [[key, val]].concat(Object.keys(opt).map(m))

    function m (key) {
        return opt[key] === true ? [key] : [key, opt[key]]
    }
}

Cookie.prototype.remove = function (key, _opt) {
    var setCookie = toArray(this.setCookies[key])
    var keys = setCookie.map(function (pair) { return pair[0] })
    var KEYS = keys.map(function (key) { return key.replace('-', '').toUpperCase() })
    var index

    if ((index = KEYS.indexOf('MAXAGE'))  !== -1) setCookie.splice(index, 1)
    if ((index = KEYS.indexOf('EXPIRES')) !== -1) setCookie.splice(index, 1)
    if ((index = KEYS.indexOf('PATH')) === -1) setCookie = setCookie.concat([['path', '/']])

    setCookie.push(['expires', (new Date(0)).toUTCString() ])

    this.setCookies[key] = [[key, '1']].concat(setCookie)

    function toArray (setCookie) {
        if (_opt) return Object.keys(_opt).map(m)
        if (setCookie) return setCookie.slice(1)
        return []
    }

    function m (key) {
        return opt[key] === true ? [key] : [key, opt[key]]
    }
}
