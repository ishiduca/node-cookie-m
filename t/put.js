'use strict'
var test   = require('tape')
var Cookie = require('../index')

test('cookie.put(key, val[, opt])', function (t) {
    var put = Cookie.prototype.put
    var spy = {setCookies: {}}

    var key = 'Ben'
    var val = 'Harper'
    var opt = {path: '/mypage', httpOnly: true}

    var result1 = {
        Ben: [
            [key, val]
          , ['path', '/']
        ]
    }

    put.apply(spy, [key, val])
    t.deepEqual(spy.setCookies, result1, JSON.stringify(spy.setCookies))

    var result2 = {
        Ben: [
            [key, val]
          , ['path', '/mypage']
		  , ['httpOnly']
        ]
    }

    put.apply(spy, [key, val, opt])
    t.deepEqual(spy.setCookies, result2, JSON.stringify(spy.setCookies))

    t.end()
})
