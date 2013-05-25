(function () {
  "use strict";
}());

function ConfigController($scope, ConfigStoreService) {

  $scope.textApiKey = ConfigStoreService.loadApiKey();

  $scope.actionSaveApiKeyToLocalStorage = function () {
    ConfigStoreService.saveApiKey($scope.textApiKey)
  }

  $scope.isLocalStoragaeAvailable = function() {
    return ConfigStoreService.isLocalStoragaeAvailable();
  }
}