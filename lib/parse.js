var qs = require('querystring')
module.exports = function (cookie) {
    return qs.parse(cookie.replace(/[;,]\s*/g, '&'))
}
