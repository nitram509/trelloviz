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
    },

    hasApiKey: function () {
      if (typeof(Storage) !== "undefined") {
        if (localStorage.trelloviz_api_key) {
          return localStorage.trelloviz_api_key.trim().length == 32;
        }
      }
      return false;
    }
  }

  Trelloviz.factory('ConfigStoreService', function () {
    return ConfigStoreService;
  });

}());

