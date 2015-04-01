/**=========================================================
 * Module: cruises-ctrl.js
 * Cruises Controller
 =========================================================*/

App.controller('CruisesController', function ($scope, Cruise, ngTableParams) {
  
  $scope.filter = {text: ''}
  $scope.tableParams = new ngTableParams({
    count: 10,
    filter: $scope.filter.text
  }, {
    getData: function($defer, params) {
      var opt = {}
      opt.limit = params.count()
      opt.skip = (params.page()-1)*opt.limit
      if($scope.filter.text != '') {
        opt.where = {"serialNumber": {like: $scope.filter.text}}
      }
      Cruise.find({filter:opt}, $defer.resolve)
      Cruise.count({where: opt.where}, function (result) {
        $scope.tableParams.total(result.count)
      })
    }
  })   
})