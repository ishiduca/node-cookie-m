var through = require('through2')
var xtend   = require('xtend/mutable')
var merge   = require('deepmerge')

module.exports = function () {
    return xtend(
        through(function (chnk, enc, done) {
            if (! this.headersSent) {
                try {
                    this.writeHead(this.statusCode)
                } catch (err) {
                    return done(err)
                }
            }
            done(null, chnk)
        }, function (done) {
            if (! this.headersSent) {
                try {
                    this.writeHead(this.statusCode)
                } catch (err) {
                    return done(err)
                }
            }
            done()
        })
      , {
            statusCode: 200
          , statusMessage: 'foo'
          , headersSent: false
          , headers: {}
          , setHeader: function (key, val) {
                if (this.headersSent)
                    throw new Error('write headers')

                this.headers[key] = val
            }
          , writeHead: function (statusCode, _statusMessage, _headers) {
                if (this.headersSent)
                    throw new Error('write headers')

                if (typeof statusCode !== 'number')
                    throw new Error('statusCode must be "number"')

                if (arguments.length === 1) {
                    _statusMessage = 'foo'
                    _headers       = {}
                }

                if (arguments.length === 2) {
                    if (typeof _headers === 'string') {
                        _statusMessage = _headers
                        _headers       = {}
                    }
                    else {
                        _headers = _statusMessage
                        _statusMessage = 'foo'
                    }
                }

                this.headersSent   = true
                this.statusCode    = statusCode
                this.statusMessage = _statusMessage
                this.headers       = merge(this.headers, _headers)
            }
        }
    )
}
