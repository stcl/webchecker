/*
    Monitoring the request according to input
*/
const config = require('./config.json')
const winston = require('winston')
const request = require('request')

module.exports.makeRequest = function( input, callback ) {

    // todo check that input is alright

    let element = input.split(' ', 1).toString()
    let info = input.split(' ', 2)[1]

    const opts = {
        url: element,
        timeout: config.timeout | 10000
    }

    const start = new Date()    // timer set

    request.get(opts, function (err, res, body) {

        // Get error case, usually timeout
        if (err) {
            winston.error(err)
            return
        } else if (res.statusCode === 200) {
            winston.info("Page OK")
            res.status = "OK"
        }
        var responseTime = new Date() - start   // ping time
        // Get the content type
        let contenttype = res.headers['content-type']
        // Compare that the line exists in content-type
        if (!contenttype.includes(info)) { 
            winston.error("Type " + info + " does not match to " + contenttype )
            res.status = "NOK"
        } else {  
            res.status = "OK"
        }

        res.contenttype = contenttype
        res.element = element
        res.responseTime = responseTime

        if( callback )
            callback( res )
    });
}
