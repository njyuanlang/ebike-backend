/**=========================================================
 * Module: statistic-ctrl.js
 * Statistic Controllers
 =========================================================*/

App.controller('StatisticBrandController', function ($scope, Brand) {
  
  $scope.barData = [{
    label: "新增用户",
    color: "#9cd159",
    data: [
      ["品牌A", 100],
      ["品牌B", 80],
      ["品牌C", 70],
      ["品牌D", 60],
      ["品牌E", 50],
      ["品牌F", 40],
      ["品牌G", 30],
      ["品牌H", 20],
      ["品牌I", 10],
      ["品牌J", 0]
    ]
  }]
  
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
  
  Brand.stat({beginDate: '"2015-04-02"', endDate: '"2015-04-09"'}, function (results) {
    $scope.barData = [{
      label: "新增用户",
      color: "#9cd159",
      data: []
    }]
    results.forEach(function (item) {
      $scope.barData[0].data.push([item._id, item.count])
    })
  })
})

App.controller('StatisticRegionController', function ($scope) {
    
})

App.controller('StatisticFaultController', function ($scope) {
    
})