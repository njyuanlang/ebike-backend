/**=========================================================
 * Module: merchants-ctrl.js
 * Merchants Controller
 =========================================================*/

App.controller('MerchantsController', function ($scope, $rootScope, $state, $compile) {

  var map = new AMap.Map('container', {
    resizeEnable: true,
    zoom: 12
  });
  $scope.map = map;
  var searchOpts = { map: map, keywords: '', panel: 'panel', pageSize: 10, autoFitView: true };
  var cloudDataLayer, cloudDataSearch;
  var tableId = '55ffc0afe4b0ead8fa4df390';
  var center = map.getCenter();
  $scope.query = { keywords: '' };
  $scope.pois = [];

  AMap.plugin(['AMap.CloudDataLayer', 'AMap.ToolBar'], function () {

    // cloudDataLayer = new AMap.CloudDataLayer(tableId, opts);

    // AMap.event.addListener(cloudDataLayer, 'click', function (result) {
    //   var clouddata = result.data;
    //   $scope.clouddata = result.data;
    //   $scope.ability = JSON.parse(clouddata.ability && "{"+clouddata.ability+"}" || "{}")
    //   $scope.$apply();
    //   console.log($scope.ability);
    //   $scope.infoWindow.open($scope.map, clouddata._location);
    // });

    var tool = new AMap.ToolBar();
    map.addControl(tool);
  })

  function refresh() {
    if (cloudDataSearch) {
      Object.assign(searchOpts, $scope.query);
      cloudDataSearch.setOptions(searchOpts);
      cloudDataSearch.searchByDistrict('全国', function (status, result) {
        if (status === 'complete') {
          $scope.pois = result.datas;
          console.log($scope.pois);
          $scope.$apply();
        } else {
          $scope.pois = [];
        }
      });
    }
  }
  $scope.refresh = refresh;

  AMap.service(['AMap.CloudDataSearch'], function () {
    cloudDataSearch = new AMap.CloudDataSearch(tableId, searchOpts);
    refresh();
  })

  $scope.navigate = function () {
    if ($scope.infoWindow) $scope.infoWindow.close();
    $scope.MWalk.search($scope.myPosition, $scope.clouddata._location);
  };
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