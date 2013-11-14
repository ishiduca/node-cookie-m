# cookie-m

__cookie m__anager

## synoppis

```js
var port = 8080
var uuid = require('uuid')
var Cookie = require(__dirname + '/index')

var counts = {}

require('http').createServer(function (req, res) {
    faviconIgnore(req, res)

    var cookie = new Cookie(req, res)
    var sessionID = cookie.get('session-id')
    var expire, timeout

    console.log('%s "%s"', req.url, sessionID)

    
    if (! sessionID || ! counts[sessionID]) {
        timeout = (1000 * 60) // 1min
        expire = (new Date(Date.now() + timeout)).toUTCString()
        sessionID = uuid.v1()

        counts[sessionID] = 0

        cookie.set('session-id', sessionID, {expire: expire})
    }


    switch (req.url) {
      case '/logout':
        cookie.remove('session-id')
        break;
      case '/inc':
        counts[sessionID]++
        break;
      case '/dec':
        counts[sessionID]--
        break;
      default :
        ; break;
    }

    res.end(String(counts[sessionID]))

}).listen(port)
```

## method

- `get`
- `set`
- `remove`

### get
> get value form __httpServer.request.headers.cookie__

```js
    cookie.get('name')
```

### set
> set value to __httpServer.response.headers['set-cookie']__

```js
    cookie.set('name', 'value'[, optoin])
```

### remove
> set "expires"
```js
    cookie.remove('name'[, option])
````
