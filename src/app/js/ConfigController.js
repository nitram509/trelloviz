(function () {
  "use strict";
}());

Trelloviz.ConfigController = function ($scope, ConfigStoreService) {

  $scope.textApiKey = ConfigStoreService.loadApiKey();

  $scope.actionSaveApiKeyToLocalStorage = function () {
    ConfigStoreService.saveApiKey($scope.textApiKey)
  }

  $scope.isLocalStoragaeAvailable = function() {
    return ConfigStoreService.isLocalStoragaeAvailable();
  }
}