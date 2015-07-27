'use strict'
var test   = require('tape')
var Cookie = require('../index')

test('cookie.get(key)', function (t) {
    var get = Cookie.prototype.get
    var dummy = {
        cookies: {
            sid: ['foo', 'bar'], poo: 'pony'
        }
    }

    t.is(get.apply(dummy, ['poo']), 'pony', 'cookie.get("pony") === "pony"')
    t.deepEqual(get.apply(dummy, ['sid']), ['foo', 'bar'], 'cookie.get("sid") == ["foo","bar"]')

    t.end()
})
