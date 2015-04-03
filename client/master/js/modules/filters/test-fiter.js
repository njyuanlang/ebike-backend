/**=========================================================
 * Module: test-filter.js
 * Test task filter
 =========================================================*/

App.filter("testState", function () {
  var dictionary =  {
    testing: '系统扫描中...',
    pass: '正常',
    error: '故障',
    repairing: '系统修复中...',
    repaired: '修复',
    broken: '故障'
  }
  return function (state) {
    return dictionary[state]
  }
})

.filter("testCountError", function () {
  return function (items) {
    var errors = items.reduce(function (previousValue, currentValue) {
      if(currentValue.state !== 'pass') previousValue++
      return previousValue
    }, 0)
    return errors
  }
})