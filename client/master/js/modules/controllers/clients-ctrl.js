/**=========================================================
 * Module: clients-ctrl.js
 * Clients Controller
 =========================================================*/

App.controller('ClientsController', function ($scope, User, ngTableParams) {
  
  $scope.tableParams = new ngTableParams({
    count: 10
  }, {
    getData: function($defer, params) {
      var count = params.count()
      var skip = (params.page()-1)*count
      User.find({filter:{limit:count, skip: skip, where:{realm:'client'}}}, $defer.resolve)
    }
  }) 

  User.count(function (result) {
    $scope.tableParams.total(result.count)
  })
})