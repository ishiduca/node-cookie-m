'use strict'
var test   = require('tape')
var fake   = require('./fake')
var Cookie = require('../index')

function setup (_opt) {
    var opt = _opt || {}
    var req = {headers: {cookie: opt.cookie || ''}}
    var res = fake()
    return [new Cookie(req, res), req, res]
}

test('var cookie = new Cookie(req, res)', function (t) {
    var req = {headers: {}}
    var res = fake()
    t.ok(new Cookie(req, res).put, 'var cookie = new Cookie(req, res)')
    t.ok(Cookie(req, res).put,  'var cookie = Cookie(req, res)')
    t.end()
})

test('var val = cookie.get(key)', function (t) {
    var cookie = setup({cookie: 'foo=bar, moo=boo;moo=nu'})[0]
    var foo = cookie.get('foo')
    var moo = cookie.get('moo')
    t.is(foo, 'bar', '"bar" = cookie.get("foo")')
    t.deepEqual(moo, ['boo', 'nu'], '["boo", "nu"] = cookie.get("moo")')
    t.end()
})

test('cookie.put(key, val[, opt])', function (t) {
    var args   = setup()
    var cookie = args[0]
    var res    = args[2]

    cookie.put('foo', 'bar', {httpOnly: true, 'max-age': 3600})
    cookie.put('moo', 'nu')
    res.end()

    var setCookies = res.headers['set-cookie']

    t.is(setCookies[0]
      , 'foo=bar; httpOnly; max-age=3600; path=/'
      , 'res.headers["set-cookie"][0] === "foo=bar; httpOnly; max-age=3600; path=/"'
    )
    t.is(setCookies[1]
      , 'moo=nu; path=/'
      , 'res.headers["set-cookie"][1] === "moo=nu; path=/"'
    )

    t.end()
})

test('cookie.remove(key[, opt])', function (t) {
    var args = setup({cookie: 'moo=nu'})
    var cookie = args[0]
    var res    = args[2]

    cookie.remove('moo')
    cookie.remove('Moose')

    res.end()

    var setCookies = res.headers['set-cookie']

    t.is(setCookies[0]
      , 'moo=1; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      , 'res.headers["set-cookie"][0] === ' + setCookies[0]
    )
    t.is(setCookies[1]
      , 'Moose=1; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      , 'res.headers["set-cookie"][1] === ' + setCookies[0]
    )

    t.end()
})
