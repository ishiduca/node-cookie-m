#!/usr/bin/env node
'use strict'
var path   = require('path')
var url    = require('url')
var http   = require('http')
var rack   = require('hat').rack(256)
var Cookie = require('../index')

var port   = process.env.PORT || 3001
var key    = 'SessionID'
var store  = {}
var times  = {}


http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname
    if (pathname === '/favicon.ico') return favicon(res)

    var cookie = new Cookie(req, res)
    var sid    = cookie.get(key)

    if (! sid) sid = rack()

    if (! store[sid]) {
        cookie.put(key, sid, {"max-age": 60})
        store[sid] = 0
        times[sid] = setTimeout(clear.bind(null, sid), 1000 * 60)
    }

    if (pathname === '/logout') {
        cookie.remove(key)
        clear(sid)
    }
    else {
        store[sid] += 1
    }

    var mess = ('%s "%d"').replace('%s', sid).replace('%d', store[sid] || 'none')

    res.end(mess)

})
.listen(port)

function clear (sid) {
    var id = times[sid]
    clearTimeout(id)
    id = undefined
    delete times[sid]
    delete store[sid]
}

function favicon (res) {
    res.statusCode = 200
    res.setHeader('content-type', 'image/x-icon')
    res.end()
}
