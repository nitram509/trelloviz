(function () {
  "use strict";
}());

Trelloviz.MenuBarController = function ($scope) {

  $scope.loggedIn = false;

  $scope.isNotLoggedIn = function() {
    return !$scope.loggedIn;
  }

  $scope.actionLogIn = function() {
    $scope.loggedIn = true;
  }
}