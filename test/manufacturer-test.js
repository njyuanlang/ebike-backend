var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

var loggedInUser = {email:"yx@example.com", password: "123456", realm: "manufacturer"}

describe('# Manufacturer', function() {
  lt.beforeEach.withApp(app);
  lt.beforeEach.givenLoggedInUser(loggedInUser);
  
  var filter = {
    limit: 5,
    skip: 5
  }
  var qs = '?'+querystring.stringify({filter: JSON.stringify(filter)})

  describe.skip('## Clients', function () {
    lt.describe.whenCalledRemotely('GET', '/api/bikes/findUsersByManufacturer'+qs, function() {
      lt.it.shouldBeAllowed();
      it('should have statusCode 200', function() {
        assert.equal(this.res.statusCode, 200);
        console.log(this.res.body, this.res.body.length);
      });

      it('should respond with an array of user', function() {
        assert(Array.isArray(this.res.body));
      });
    });
  });

  describe.skip('## Bikes', function () {

    lt.describe.whenCalledRemotely('GET', '/api/bikes', function () {
      lt.it.shouldBeAllowed();
      it('should have statusCode 200', function () {
        assert.equal(this.res.statusCode, 200);
        // console.log(this.res.body.length);
      });
    });
  });
  
  describe('## Brands', function () {
    
    lt.describe.whenCalledRemotely('GET', '/api/brands', function () {
      it('should have statusCode', function() {
        assert.equal(this.res.statusCode, 200);
      });
    })
    
    lt.describe.whenCalledRemotely('POST', '/api/brands', {
      "name": "test brand"+Date.now(),
      manufacturerId: '552f87015febd5395a773c93'
    }, function () {
      it('should have statusCode', function() {
        assert.equal(this.res.statusCode, 200);
      });
    });
    
    lt.describe.whenCalledRemotely('POST', '/api/brands', {
      "name": "updatedName"+Date.now()
    }, function () {
      it('should ok', function() {
        // console.log(this.res.body)
        assert.equal(this.res.statusCode, 200);
      });
    });
    
    lt.describe.whenCalledRemotely('POST', '/api/brands', {
      "name": "test brand"+Date.now(),
      manufacturerId: '555af68dd5dcc0bdbcbfb8c5'
    }, function () {
      lt.it.shouldBeDenied();
    })
  })
});