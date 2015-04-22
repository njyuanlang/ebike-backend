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
      Brand.stat({beginDate: '"'+$scope.beginDate+'"', endDate: '"'+$scope.endDate+'"'}, function (result) {
        $scope.total = result.total
        $scope.aggregateTotal = result.aggregateTotal
        $defer.resolve(result.data)
        $scope.barData = [{
          label: "新增车辆",
          color: "#9cd159",
          data: []
        }]
        result.data.forEach(function (item) {
          $scope.barData[0].data.push([item._id, item.count])
        })
      })
    }
  })   
  
  $scope.endDate = moment().format('YYYY-MM-DD')
  $scope.beginDate = moment().subtract(30, 'days').format('YYYY-MM-DD')
  $scope.openeds = [false, false]
  $scope.open = function($event, index) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openeds[index] = true
    $scope.openeds[++index%2] = false
  };
})

App.controller('StatisticRegionController', function ($scope, Bike, ngTableParams) {
    
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
      Bike.statRegion({beginDate: '"'+$scope.beginDate+'"', endDate: '"'+ moment($scope.endDate).endOf('day').toDate()+'"'}, function (result) {
        $scope.total = result.total
        $scope.aggregateTotal = result.aggregateTotal
        $defer.resolve(result.data)
        $scope.barData = [{
          label: "新增车辆",
          color: "#9cd159",
          data: []
        }]
        result.data.forEach(function (item) {
          $scope.barData[0].data.push([item._id||'其他', item.count])
        })
      })
    }
  })   
  
  $scope.endDate = moment().format('YYYY-MM-DD')
  $scope.beginDate = moment().subtract(30, 'days').format('YYYY-MM-DD')
  $scope.openeds = [false, false]
  $scope.open = function($event, index) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openeds[index] = true
    $scope.openeds[++index%2] = false
  };
})

App.controller('StatisticFaultController', function ($scope, Test, ngTableParams, Brand) {
  
  $scope.barStackedOptions = {
      series: {
          stack: true,
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
          mode: 'categories',
          categories: ["30", "60", "90", "120", "150", "180", "360", "720"]
      },
      yaxis: {
          tickColor: '#eee'
      },
      shadowSize: 0
  };
    
  $scope.tableParams = new ngTableParams({
    count: 10,
  }, {
    getData: function($defer, params) {
      Test.stat({}, function (result) {
        $defer.resolve(result)
        $scope.barStackedData = [
          { label: "刹车", color: "#9cd159", data: [] },
          { label: "电机", color: "#4a8ef1", data: [] },
          { label: "控制器", color: "#f0693a", data: [] },
          { label: "转把", color: "#51bff2", data: [] }
        ]
        result.forEach(function (item) {
          $scope.barStackedData[0].data.push([item._id, item.brake])
          $scope.barStackedData[1].data.push([item._id, item.motor])
          $scope.barStackedData[2].data.push([item._id, item.controller])
          $scope.barStackedData[3].data.push([item._id, item.steering])
        })
      })
    }
  })   

  $scope.brands = Brand.find({filter:{fields:{name:true}}})
  $scope.type = "all"
  $scope.filter = {
    brand: null,
    region: null,
  }
})