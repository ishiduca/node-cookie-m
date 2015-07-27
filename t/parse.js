'use strict'
var test  = require('tape')
var parse = require('../lib/parse')

test('var {cookies} = parse(req.headers.cookie)', function (t) {
    var cookie = 'sessionID=12345; foo=bar,foo=rab; hoge'
    var result = parse(cookie)
    var expect = {sessionID: '12345', foo: ['bar', 'rab'], hoge: ''}

    t.deepEqual(result, expect, JSON.stringify(result))
    t.end()
})
