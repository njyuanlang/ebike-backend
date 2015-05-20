var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var qs = require('querystring')

describe('/bikes', function() {
  lt.beforeEach.withApp(app);
  lt.beforeEach.givenLoggedInUser({email:"xr@example.com", password: "123456", realm: "manufacturer"})
  
  var filter = {
    where: { "brand.manufacturerId": "552f87145febd5395a773c94" }
  }
  lt.describe.whenCalledRemotely('GET', '/api/bikes/findUsersByManufacturer?'+qs.stringify({filter: JSON.stringify(filter)}), function() {
    lt.it.shouldBeAllowed();
    it('should have statusCode 200', function() {
      assert.equal(this.res.statusCode, 200);
      console.log(this.res.body, this.res.body.length)
    });

    // it('should respond with an array of user', function() {
    //   assert(Array.isArray(this.res.body));
    // });
  });
});