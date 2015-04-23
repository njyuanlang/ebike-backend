/**=========================================================
 * Module: login-filter.js
 * Login filter
 =========================================================*/

App.filter("loginError", function () {
  var dictionary =  {
    "login failed": '登录失败'
  }
  return function (state) {
    return dictionary[state]
  }
})
