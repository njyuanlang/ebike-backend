/**=========================================================
 * Module: devices-ctrl.js
 * Devices Controller
 =========================================================*/

App.controller('DevicesController', function ($scope, Device, ngTableParams) {
  
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
      Device.find({filter:opt}, $defer.resolve)
      Device.count({where: opt.where}, function (result) {
        $scope.tableParams.total(result.count)
      })
    }
  })   
})