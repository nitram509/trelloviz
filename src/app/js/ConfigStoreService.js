(function () {
  "use strict";

  var ConfigStoreService = {
    isLocalStoragaeAvailable: function () {
      return (typeof(Storage) !== "undefined");
    },

    saveApiKey: function (value) {
      if (typeof(Storage) !== "undefined") {
        localStorage.trelloviz_api_key = value;
      }
    },

    loadApiKey: function () {
      if (typeof(Storage) !== "undefined") {
        return localStorage.trelloviz_api_key || '';
      }
      return '';
    }
  }

  Trelloviz.factory('ConfigStoreService', function () {
    return ConfigStoreService;
  });

}());

