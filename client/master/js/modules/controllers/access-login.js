/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

App.controller('LoginFormController', function($scope, $state, User) {

  // bind here all data from the form
  $scope.account = {realm: 'administrator', rememberMe: true};
  // place the message if something goes wrong
  $scope.authMsg = '';

  $scope.login = function() {
    $scope.authMsg = '';

    if($scope.loginForm.$valid) {

      User.login($scope.account, function (user) {
        $state.go('app.dashboard');
      }, function (error) {
        $scope.authMsg = error.data.error.message
      })
    }
    else {
      // set as dirty if the user click directly to login so we show the validation messages
      $scope.loginForm.account_email.$dirty = true;
      $scope.loginForm.account_password.$dirty = true;
    }
  };

});

App.controller('ResetPasswordFormController', function($scope, $state, User) {
  
  $scope.recover = {}
  
  $scope.reset = function () {
    $state.go('page.login')
  }
})
