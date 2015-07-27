'use strict'
var test      = require('tape')
var stringify = require('../lib/stringify')

test('[setCookies] = stringify({cookie.setCookies})', function (t) {
    var key = 'Ben'
    var val = 'Harper'
    var inp = {
        Ben: [
            [key, val]
          , ['max-age', 3600]
          , ['httpOnly']
        ]
    }
    var out = [
        'Ben=Harper; max-age=3600; httpOnly'
    ]

    var result = stringify(inp)

    t.deepEqual(result, out, JSON.stringify(result))
    t.end()
})

test('[setCookies] = stringify({cookie.setCookies})', function (t) {
    var key = 'Ben'
    var val = ['Harper', 'KEI']
    var inp = {
        Ben: [
            [key, val]
          , ['max-age', 3600]
          , ['httpOnly']
        ]
    }
    var out = [
        'Ben=Harper,KEI; max-age=3600; httpOnly'
    ]

    var result = stringify(inp)

    t.deepEqual(result, out, JSON.stringify(result))
    t.end()
})
