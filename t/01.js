var path = require('path')
var q    = require('qunitjs')
var qTap = require('qunit-tap')

qTap(q, console.log.bind(console))
q.init()
q.config.updateRate = 0

q.assert.is = q.assert.strictEqual
q.assert.like = function (str, reg, mes) { this.ok(reg.test(str), mes) }

var Cookie = require(path.join( __dirname, '..'))

var http = require('http')
var server = http.createServer(function (req, res) {
    var cookie = new Cookie(req, res)

    switch (req.url) {
        case '/':         cookie.set('p', 'foo'); break;
        case '/httponly': cookie.set('p', 'bar', {httponly: true}); break;
        case '/expire':   cookie.expire('p');   break;
        default : break;
    }

    res.statusCode = 200
    res.end(req.url)
})
var close = function () {
    server.close(function () {
        console.log('# ### server close ...')
    })
}
var port = 8080

server.listen(port, function () { console.log('# ### server port "%d"', port) })

q.module('server')
q.asyncTest('/', function (t) {
    get('/', /^p=foo; path=\/$/)
})
q.asyncTest('/httponly', function (t) {
    get('/httponly', /^p=bar; (path=\/; httponly|httponly; path=\/)$/)
})
q.asyncTest('/expire', function (t) {
    get('/expire', /^p=1; (expires=Thu, 01 Jan 1970 00:00:00 GMT; path=\/|path=\/; expires=Thu, 01 Jan 1970 00:00:00 GMT)$/, close)
})

function get(url, reg, done) {
    var t = q.assert
    http.get('http://localhost:' + port + url, function (res) {
        res.on('data', function () {})
        res.on('end', function () {
            var cookie = res.headers['set-cookie']
            t.ok(cookie[0])
            t.like(cookie[0], reg, cookie[0])

            done && done()
            q.start()
        })
    })
}
