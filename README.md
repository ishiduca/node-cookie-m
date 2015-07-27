# cookie-m

__cookie m__anager

## example

```js
var http   = require('http')
var rack   = require('hat').rack(256)
var Cookie = require('cookie-m')

var store = {}

var server = http.createServer(function app (req, res) {
    var cookie = new Cookie(req, res)
    var foo    = cookie.get('foo')

    if (! foo) {
        foo = rack()
        cookie.put('foo', foo)
        store[foo] = 1
    }
    else {
        store[foo] += 1
    }

    if (req.url === '/out') {
        cookie.remove('foo')
        delete store[foo]
        return res.end('remove cookie'))
    }

    res.end(('{{FOO}}: {{FOO_VAL}}').replace(/{{FOO}}}/,    foo)
                                    .replace(/{{FOO_VAL}}/, store[foo]))
    
})
```

## api

### var cookie = new Cookie(req, res)

return a cookie object.

* **req** an instance of `http.incomingMessage`
* **res** an instance of `http.ServerResponse`


### var val = cookie.get(key)

return a value from `req.headers.cookie`

* **key** cookie name


### cookie.put(key, val[, opt])

set a cookie to `res.headers['set-cookie']`

* **key** cookie name
* **val** value
* **opt** cookie option object. this is an optional object.

    ex: {httpOnly: true, expires: ((new Date(Date.now() + 1000 * 60 * 60)).toUTCString()}


### cookie.remove(key[, opt])

remove a cookie. seealso **cookie.put**

## author

ishiduca@gmail.com

## license

MIT
