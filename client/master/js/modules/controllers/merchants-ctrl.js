/**=========================================================
 * Module: merchants-ctrl.js
 * Merchants Controller
 =========================================================*/

App.controller('MerchantsController', function ($scope, $rootScope, $state, $compile) {
  
  var map = new AMap.Map('container',{
    zoom: 12
  });
  $scope.map = map;

  AMap.plugin(['AMap.CloudDataLayer', 'AMap.ToolBar'],function(){

    var cloudDataLayer = new AMap.CloudDataLayer('55ffc0afe4b0ead8fa4df390', {
      clickable: true
    });
    cloudDataLayer.setMap(map);

    AMap.event.addListener(cloudDataLayer, 'click', function (result) {
      var clouddata = result.data;
      $scope.clouddata = result.data;
      $scope.ability = JSON.parse(clouddata.ability && "{"+clouddata.ability+"}" || "{}")
      $scope.$apply();
      console.log($scope.ability);
      $scope.infoWindow.open($scope.map, clouddata._location);
    });
    
    var tool = new AMap.ToolBar();
    map.addControl(tool);
  })
  
  $scope.navigate = function () {
    if($scope.infoWindow) $scope.infoWindow.close();
    $scope.MWalk.search($scope.myPosition, $scope.clouddata._location);
  };
  
  AMap.service(["AMap.Driving"], function() {
    $scope.MWalk = new AMap.Driving({
      panel: result1,
      map: map
    });
  });
})

.directive('infowindow', function factory() {
  'use strict';
  return {
    // restrict: 'M',
    templateUrl: 'merchant-popover.html',
    scope: false,
    link: linkFunction
  }
  
  function linkFunction(scope, element, attributes) {
    scope.infoWindow = new AMap.InfoWindow({
      content: element[0],
      closeWhenClickMap: true,
      size: new AMap.Size(240, 0),
      autoMove: true,
      offset: new AMap.Pixel(0, -25)
    });
  }
})