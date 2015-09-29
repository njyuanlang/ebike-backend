/**=========================================================
 * Module: clients-ctrl.js
 * Clients Controller
 =========================================================*/

App.controller('ClientsController', function ($scope, $state, User, ngTableParams, $rootScope, RemoteStorage) {
  
  $scope.filter = {text: ''}
  $scope.tableParams = new ngTableParams({
    count: 10,
    filter: $scope.filter.text
  }, {
    getData: function($defer, params) {
      var opt = {order: 'created DESC'}
      opt.limit = params.count()
      opt.skip = (params.page()-1)*opt.limit
      opt.where = {realm: "client"}
      if($scope.filter.text != '') {
        opt.where.username = {like: $scope.filter.text}
      }
      User.count({where: opt.where}, function (result) {
        $scope.tableParams.total(result.count)
        User.find({filter:opt}, function (results) {
          results.forEach(function (user) {
            user.avatar = 'app/img/dummy.png';
            RemoteStorage.getAvatar(user.id).success(function (buffer) {
              user.avatar = buffer;
            });
          })
          $defer.resolve(results);
        })
      })
    }
  });
  
  $scope.reply = function (user) {
    $rootScope.messageDraft = {
      touser: user
    }
    $state.go('app.message-compose');
  }
})