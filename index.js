var qs = require('querystring')

module.exports = Cookie
Cookie.Cookie  = Cookie


function Cookie (req, res) {
    this.cookie    = this.parse(req.headers.cookie)
    this.setCookie = {}

    var that = this
    var writeHead = res.writeHead
    res.writeHead = function () {
        that.finalize(this)
        return writeHead.apply(this, arguments)
    }

    return this
}

Cookie.prototype.sep         = /[;,]\s*/g
Cookie.prototype.defaultPath = '/'
Cookie.prototype.defaultSep  = '; '

Cookie.prototype.parse = function (cookieStr) {
    return qs.parse((cookieStr || '').replace(this.sep, '&'))
}
Cookie.prototype.get = function (name) {
    return this.cookie[name]
}
Cookie.prototype.set = function (name, val, option) {
    option      || (option = {})
    option.path || (option.path = this.defaultPath)
    this.setCookie[name] = [ val, option ]
    return this
}
Cookie.prototype.expire =
Cookie.prototype.remove = function (name, option) {
    var cookie = this.setCookie[name]
    option || (option = (cookie && cookie[1]) ? cookie[1] : {})
    option.expires = (new Date(0)).toUTCString()
    this.set(name, '1', option)
    return this
}
Cookie.prototype.finalize = function (res) {
    var stringify = this.stringify.bind(this)
    var setCookie = this.setCookie
    var maped = Object.keys(setCookie).map(function (key) {
        return stringify(key, setCookie[key][0], setCookie[key][1])
    })
    maped.length > 0 && res.setHeader('set-cookie', maped)
    return this
}
Cookie.prototype.stringify = function (key, val, opt) {
    var pair = {}; pair[key] = val
    return [ qs.stringify(pair) ].concat(Object.keys(opt || {}).map(function (key) {
        var val = opt[key]
        return (val === true) ? key : [key, val].join('=')
    })).join(this.defaultSep)
}
