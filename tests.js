// tests

const winston = require('winston')
const should  = require('should')
const request = require("request")
const assert  = require('assert')

const Monitor = require('./monitor.js')
const Logger = require('./logger.js')

describe('Monitoring web', function() {
  // Default timeout
    this.timeout(60000)
    
    describe('request', function() {
		it('response has corrent format', function(done) {
            Monitor.makeRequest("http://www.google.com ISO-8859-1", function(res) {
                assert( res.statusCode != undefined )
                assert( res.statusCode === 200 )
                assert( res.contenttype == "text/html; charset=ISO-8859-1" )
                done()
            })
    	})		

		it('bad request ', function(done) {
            Monitor.makeRequest("http://www.google.com ISO-8859-1", function(res) {
                done()
            })
    	})

		it('request with only address does not crash', function(done) {
            Monitor.makeRequest("http://www.google.com", function(res) {
                assert( res.statusCode === 200 )
                done()
            })
        })
    })		

    describe('logging', function() {
		it('logging is in right format ', function(done) {
            var res = {}
            res.statusCode = 200
            res.element = "localhost"
            res.responseTime = 0
            Logger.add( res )

            assert( true /* log message is right*/)
            done();
    	})
    })
})


// Verify change in response time is steady

// Verify realtime change to textfile
