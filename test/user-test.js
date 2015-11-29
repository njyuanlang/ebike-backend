var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('user');

var loggedInUser = {email:"abc@example.com", username:"abc@example.com", password:"123456", realm:"client", id: "555f0674c0daf6350e2cb210", region:{province:"江苏", city:"南京"}};
var loggedInUser2 = {email:"def@example.com", username:"def@example.com", password:"123456", realm:"client", id: "555f0674c0daf6350e2cb213", region:{province:"江苏", city:"苏州"}};
var loggedInManufacturer = {email:"spxxx@example.com", password: "123456", realm: "manufacturer", id: "555f0674c0daf6350e2cb211", manufacturerId: "555f0674c0daf6350e2cb219"}
var loggedInAdmin = {email:"gbo2@extensivepro.com", password: "123456", realm: "administrator", id: "555f0674c0daf6350e2cb212"}

describe('User', function() {

  describe.only('# Create', function() {
    lt.beforeEach.givenLoggedInUser({
      email: "region@example.com",
      password: "123456",
      realm:'client',
      region: {
        province: "江苏",
        city: "南京"
      }
    });
    it('should ok', function(done) {
      setTimeout(done, 0);
    });
  });

  describe('# Administartor', function() {
    lt.beforeEach.givenLoggedInUser(loggedInAdmin);
    
  });
});