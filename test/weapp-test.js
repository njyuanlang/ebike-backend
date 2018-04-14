var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring');
var request = require('request');
var baseUrl = "http://0.0.0.0:3000"

var server;
before((done) => {
  server = app.start();
  app.on('started', done);
});

after(() => {
  server.close();
});

describe.only('Weapp', () => {
  describe('# Get OpenID', () => {
    it('should ok', (done) => {
      request.get({
        uri: baseUrl+'/weapp',
        qs: {code: '1234'}
      }, function (err, res) {
        assert.equal(res.statusCode, 200);
        console.log(res.body);
        done();
      })
    });
  });
});