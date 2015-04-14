/**=========================================================
 * Module: statistic-ctrl.js
 * Statistic Controllers
 =========================================================*/

App.controller('StatisticBrandController', function ($scope, Brand, ngTableParams) {
  
  $scope.barOptions = {
    series: {
        bars: {
            align: 'center',
            lineWidth: 0,
            show: true,
            barWidth: 0.6,
            fill: 0.9
        }
    },
    grid: {
        borderColor: '#eee',
        borderWidth: 1,
        hoverable: true,
        backgroundColor: '#fcfcfc'
    },
    tooltip: true,
    tooltipOpts: {
        content: function (label, x, y) { return x + ' : ' + y; }
    },
    xaxis: {
        tickColor: '#fcfcfc',
        mode: 'categories'
    },
    yaxis: {
        position: ($scope.app.layout.isRTL ? 'right' : 'left'),
        tickColor: '#eee'
    },
    shadowSize: 0
  };
  
  $scope.tableParams = new ngTableParams({
    count: 10,
  }, {
    getData: function($defer, params) {
      Brand.stat({beginDate: '"2015-04-02"', endDate: '"2015-04-09"'}, function (result) {
        $scope.total = result.total
        $scope.aggregateTotal = result.aggregateTotal
        $defer.resolve(result.data)
        $scope.barData = [{
          label: "新增用户",
          color: "#9cd159",
          data: []
        }]
        result.data.forEach(function (item) {
          $scope.barData[0].data.push([item._id, item.count])
        })
      })
    }
  })   

})

App.controller('StatisticRegionController', function ($scope) {
    
})

App.controller('StatisticFaultController', function ($scope) {
    
})