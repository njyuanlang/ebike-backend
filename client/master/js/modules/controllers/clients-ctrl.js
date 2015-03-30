/**=========================================================
 * Module: clients-ctrl.js
 * Clients Controller
 =========================================================*/

App.controller('ClientsController', function ($scope, User, ngTableParams) {
  
  $scope.tableParams = new ngTableParams({
    count: 10
  }, {
    getData: function($defer, params) {
      User.find({}, $defer.resolve)
    }
  }) 

  User.count(function (result) {
    $scope.tableParams.total(result.count)
  })
})