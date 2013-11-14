var path = require('path')
var q    = require('qunitjs')
var qTap = require('qunit-tap')

qTap(q, console.log.bind(console))
q.init()
q.config.updateRate = 0

q.assert.is = q.assert.strictEqual
q.assert.like = function (str, reg, mes) { this.ok(reg.test(str), mes) }

var Cookie = require(path.join( __dirname, '..'))

q.test('laod module', function (t) {
    t.ok(Cookie.Cookie)
})

var events = require('events')

q.module('setup', {
    setup: function () {
        var req = this.req = new events.EventEmitter
        req.headers = {}

        var res = this.res = new events.EventEmitter
        res.headers = {}
        res.setHeader = function (key, val) {
            this.headers[key] = val
        }
        res.writeHead = function (statusCode, headers) {
            for (var p in headers) {
                this.setHeader(p, headers[p])
            }
        }
        res.clear = function () {
            this.headers = {}
        }
        res.getHeader = function (name) {
            return this.headers[name]
        }
    }
})
q.test('.parse(str)', function (t) {
    var cookieStr = 'foo=bar; a=b%26c%3D'
    t.deepEqual(Cookie.prototype.parse(cookieStr), {foo: 'bar', a: 'b&c='})
})
q.test('.get(name)', function (t) {
    this.req.headers = {cookie: 'aaa=AAA; bbb=BBB; %3Cgood%3E=B%26R'}
    var c = new Cookie(this.req, this.res)

    t.is(c.get('aaa'), 'AAA')
    t.is(c.get('bbb'), 'BBB')
    t.is(c.get('<good>'), 'B&R')
    t.ok(! c.get('undefined'))
})
q.test('.stringify(key, val, opt)', function (t) {
    var stringify = Cookie.prototype.stringify.bind(Cookie.prototype)
    function subtest (key, val, opt, res) {
        var tres = stringify(key, val, opt)
        t.like(tres, res, tres)
    }
    subtest('aaa', 'AAA', null, /^aaa=AAA$/)
    subtest('aaa', 'AAA', {path: '/'}, /^aaa=AAA; path=\/$/)
    subtest('aaa', 'AAA', {secure: true}, /^aaa=AAA; secure$/)
    subtest('aaa', 'AAA', {secure: true, path: '/private'}, /^aaa=AAA; (secure; path=\/private|path=\/private; secure)$/)
})
q.test('.finalize()', function (t) {
    var c = new Cookie(this.req, this.res)
    c.set('foo', 'bar', {expire: 'dummy', httpOnly: true})
    c.finalize(this.res)
    t.like(this.res.headers['set-cookie'][0], /^foo=bar; (path=\/; expire=dummy; httpOnly|path=\/; httpOnly; expire=dummy|expire=dummy; path=\/; httpOnly|expire=dummy; httpOnly; path=\/|httpOnly; path=\/; expire=dummy|httpOnly; expire=dummy; path=\/)$/)
})
