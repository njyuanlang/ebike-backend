/**=========================================================
 * Module: clients-ctrl.js
 * Clients Controller
 =========================================================*/

App.controller('ClientsController', function ($scope, $controller) {
  
  $controller('ListCtrl', {$scope: $scope})
  // $scope.resource = User
  $scope.search.orFields = ['username']
  
})