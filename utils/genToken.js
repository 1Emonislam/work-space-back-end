const jwt = require('jsonwebtoken')
/**
 * @param  {String} id user id 
 * @return {Object} 
 * @type {Function}
 */
function genToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.COOKIE_EXPIRES
    })
}
function genToken_fourHours(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '4h'
    })
}

module.exports = { genToken, genToken_fourHours }