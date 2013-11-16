# cookie-m

__cookie m__anager

## synoppis

```js
var http   = require('http')
var Cookie = require('cookie-m')
var uuid   = require('uuid')

var port    = 8080
var key     = 'sid'
var timeout = 1000 * 60 // 1min
var counts  = {}

http.createServer(function handle (req, res) {
    if (faviconIgnore(req, res)) return

    var cookie = new Cookie(req, res)
    var sessionID = cookie.get(key)
    var expire    = (new Date(Date.now() + timeout)).toUTCString()
    var mess

    if (! sessionID) sessionID = uuid.v4()
    if (! counts[sessionID]) {
        cookie.set(key, sessionID, {expires: expire})
        counts[sessionID] = 0
        setTimeout(function () {
            delete counts[sessionID]
            console.log('clear "%s"', sessionID)
        }, timeout)
    }


    switch (req.url) {
      case '/logout':
          cookie.expire(key)
          break
        default :
        counts[sessionID] += 1
        break
    }

    mess = ('%s "%d"').replace('%s', sessionID)
                      .replace('%d', counts[sessionID])
    res.end(mess)

    console.log('%s %s - "%d"', req.url, sessionID, counts[sessionID])

}).listen(port, function () {
    console.log('server start to listen on port "%d"', port)
})

function faviconIgnore (req, res) {
    if (req.url !== '/favicon.ico') return

    res.writeHead(200, {'content-type': 'image/x-icon'})
    res.end()

    return true
}

```

## instance

```js
var cookie = new Cookie(request, response)
```

## method

- `get` ...... return the cookie value form __httpServer.request.headers.cookie__
- `set` ...... set the cookie value with optoinal paramaters(ex. `expires`, `path`) to __httpServer.response.headers['set-cookie']__
- `remove` ... set `remove`

### get

```js
cookie.get('name')
```

### set

```js
// option example
// var option = {
//     path: '/private'
//   , expires: (new Date(Date.now() + 1000 * 60 * 60)).toUTCString()
//   , HttpOnly: true
// }

cookie.set('name', 'value'[, optoin])
```

### remove

```js
cookie.remove('name'[, option])
````
