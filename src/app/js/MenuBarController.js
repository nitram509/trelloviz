(function () {
  "use strict";
}());

Trelloviz.MenuBarController = function ($scope, TrelloService, ConfigStoreService) {

  $scope.trelloCallbackUrl = 'http://localhost/trelloviz/index.html#/trellocallback?';

  $scope.getTrelloApiKey = function() {
    return ConfigStoreService.loadApiKey();
  };

  $scope.isNotLoggedIn = function() {
    return !TrelloService.isLoggedIn();
  };

  $scope.isLoggedIn = function() {
    return TrelloService.isLoggedIn();
  };

  $scope.isLoginDisabled = function() {
    return !ConfigStoreService.hasApiKey();
  };

  $scope.getAvatarUrl = function() {
    return "https://trello-avatars.s3.amazonaws.com/1827a0ef7af2a2f366225cb8cfea812f/30.png";
  }

}