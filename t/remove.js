'use strict'
var test   = require('tape')
var Cookie = require('../index')

test('cookie.remove(key[, opt])', function (t) {
    var put    = Cookie.prototype.put
    var remove = Cookie.prototype.remove
	var spy    = {setCookies: {}}

	var key = 'Ben'
	var val = 'Harper'
	var opt = {path: '/mypage', 'max-age': 3600, httpOnly: true}

	var result1 = {
		Ben: [
			[key, val]
		  , ['path', '/mypage']
		  , ['max-age', 3600]
		  , ['httpOnly']
		]
	}

	put.apply(spy, [key, val, opt])
	t.deepEqual(spy.setCookies, result1, JSON.stringify(spy.setCookies))

	var result2 = {
		Ben: [
			[key, '1']
		  , ['path', '/mypage']
		  , ['httpOnly']
		  , ['expires', 'Thu, 01 Jan 1970 00:00:00 GMT']
		]
	}

	remove.apply(spy, [key])
	t.deepEqual(spy.setCookies, result2, JSON.stringify(spy.setCookies))
	t.end()
})
