/**=========================================================
 * Module: bikes-ctrl.js
 * Bikes Controller
 =========================================================*/

App.controller('BikesController', function ($scope, Bike, ngTableParams) {
  
  $scope.filter = {text: ''}
  $scope.tableParams = new ngTableParams({
    count: 10,
    filter: $scope.filter.text
  }, {
    getData: function($defer, params) {
      var opt = {order: 'created DESC'}
      opt.limit = params.count()
      opt.skip = (params.page()-1)*opt.limit
      if($scope.filter.text != '') {
        opt.where = {"serialNumber": {like: $scope.filter.text}}
      }
      Bike.find({filter:opt}, $defer.resolve)
      Bike.count({where: opt.where}, function (result) {
        $scope.tableParams.total(result.count)
      })
    }
  })   
})