/**=========================================================
 * Module: accounts-ctrl.js
 * Accounts Controller
 =========================================================*/

App.controller('AccountsController', function ($scope, User, ngTableParams) {
  
  $scope.filter = {text: ''}
  $scope.tableParams = new ngTableParams({
    count: 10,
    filter: $scope.filter.text
  }, {
    getData: function($defer, params) {
      var opt = {}
      opt.limit = params.count()
      opt.skip = (params.page()-1)*opt.limit
      opt.where = {realm: "administrator"}
      if($scope.filter.text != '') {
        opt.where.name = {like: $scope.filter.text}
      }
      User.find({filter:opt}, $defer.resolve)
      User.count({where: opt.where}, function (result) {
        $scope.tableParams.total(result.count)
      })
    }
  })   
})