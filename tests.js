// tests

const winston = require('winston')
const should  = require('should')
const request = require("request")
const assert  = require('assert')

const Monitor = require('./monitor.js')
const Logger = require('./logger.js')
const State = require('./state.js')

describe('Monitoring web', function() {
  // Default timeout
    this.timeout(60000)
    
    describe('request', function() {
        it('Response has correct format', function(done) {
            Monitor.makeRequest("http://www.google.com ISO-8859-1", function(res) {
                assert( res.statusCode != undefined )
                assert( res.statusCode === 200 )
                assert( res.contenttype == "text/html; charset=ISO-8859-1" )
                done()
            })
    	})		

        it('Bad request ', function(done) {
            Monitor.makeRequest("http://www.google.com ISO-8859-1", function(res) {
                done()
            })
        })

        it.skip('Request with only address does not crash', function(done) {
            Monitor.makeRequest("http://www.google.com", function(res) {
                assert( res.statusCode === 200 )
                done()
            })
        })

    })		

    describe('logging', function() {
        it('Logging is in right format ', function(done) {
            var res = {}
            res.statusCode = 200
            res.element = "localhost"
            res.responseTime = 0
            Logger.add( res )

            assert( true /* Log message is right */ )
            done()
        })
    })

    describe('state', function() {

        it('State is saved', function(done) {
            let state = new State();
            state.addToState( { 'element': 'http://www.google.com', 'status': 'OK' } )
            state.addToState( { 'element': 'http://www.ampparit.com', 'status': 'NOK' } )

            console.log( state.getStatus() )

            assert( state.getStatus().length == 2 )
            done()

        })

        it('State change replaces the previous state', function(done) {
            
            let state = new State()
            state.addToState( { 'element': 'http://www.google.com', 'status': 'NOK' } )

            Monitor.makeRequest("http://www.google.com ISO-8859-1", function(res) {
                state.replaceStatus(res)
                console.log( state.getStatus()[0] )
                assert( state.getStatus()[0]['status'] == 'OK' )
                done()
            })
    	})
    })
})


// Verify change in response time is steady

// Verify realtime change to textfile
