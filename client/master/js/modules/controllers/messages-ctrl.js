/**=========================================================
 * Module: messages-ctrl.js
 * Messages Controller
 =========================================================*/

App.controller('MessagesController', function ($scope, $rootScope, $state, Message, ngTableParams, RemoteStorage) {
  
  $scope.filter = {text: ''}
  $scope.tableParams = new ngTableParams({
    count: 10,
    filter: $scope.filter.text
  }, {
    getData: function($defer, params) {
      var opt = {include: ['FromUser']}
      opt.limit = params.count()
      opt.skip = (params.page()-1)*opt.limit
      opt.where = {ToUserName: $scope.user.id}
      if($scope.filter.text != '') {
        opt.where.Content = {regex: $scope.filter.text}
      }
      Message.count({where: opt.where}, function (result) {
        $scope.tableParams.total(result.count)
        Message.find({filter:opt}, function (results) {
          results.forEach(function (msg) {
            msg.FromUser.avatar = 'app/img/dummy.png';
            RemoteStorage.getAvatar(msg.FromUserName).success(function (buffer) {
              msg.FromUser.avatar = buffer;
            });
          });
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

App.controller('MessageComposeController', function ($scope, $state, Message, ngTableParams, toaster) {
  
  $scope.submitForm = function (isValid) {
    
    Message.create({
      ToUserName: $scope.messageDraft.touser.id,
      Content: $scope.content
    }, function (result) {
      toaster.pop('success', '发送成功', '已经向'+$scope.messageDraft.touser.name+"发送了消息！");
      setTimeout(function () {
        $state.go('app.messages');
      }, 2000);
      }, function (reaseon) {
      toaster.pop('error', '发送错误', res.data.error.message);
    })
  }
  
  $scope.tableParams = new ngTableParams({
    count: 10
  }, {
    counts: [],
    getData: function($defer, params) {
      var opt = {include: ['FromUser']}
      opt.limit = 10
      opt.skip = 0
      opt.where = {
        and: [{
          or:[{ToUserName: $scope.messageDraft.touser.id},{FromUserName: $scope.messageDraft.touser.id}]
        }]
      };
      Message.find({filter:opt}, function (results) {
        results.forEach(function (msg) {
          msg.avatar = msg.FromUserName == $scope.user.id ? $scope.user.picture: $scope.messageDraft.touser.avatar;
        });
        $defer.resolve(results);
      });
    }
  });

  $scope.delete = function (msg) {
    Message.deleteById({id: msg.id}, function () {
      $scope.tableParams.reload();
    });
  }
})