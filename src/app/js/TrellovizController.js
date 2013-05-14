
(function () {
  "use strict";
}());

function TrellovizController($scope) {

  $scope.apiKey = '';
  $scope.loggedIn = false;
  $scope.showSpinner = false;
  $scope.fullTrelloUserName = '';
  $scope.trelloLists = [];
  $scope.html5LocalStorageAvailable = false;
  $scope.core_option_keepArchiveCards = false;
  $scope.areaChart = null;
  $scope.vizDataForJit = null;
  $scope.showConfigPanel = false;

  $scope.actionLogIn = function () {

//    var apikey = Trelloviz.viewModel.apiKey();
//    if (apikey != null && apikey.length == 32) {
//      Trelloviz.viewModel.showConfigPanel(false);
//      jQuery.getScript('https://api.trello.com/1/client.js?key=' + apikey, Trelloviz.trelloLogin);
//    }
//    else {
//      Trelloviz.viewModel.showConfigPanel(true);
//    }
  };

  $scope.toggleConfigApiKeyPanelVisible = function () {
//    var visible = Trelloviz.viewModel.showConfigPanel();
//    Trelloviz.viewModel.showConfigPanel(!visible);
  };

  $scope.actionListsUpdated = function () {
//    this.updateVizDataFromTrelloListsSettings();
//    this.areaChart.loadJSON(this.vizDataForJit);
  };

  $scope.updateVizDataFromTrelloListsSettings = function () {
//    var trellolists = this.trelloLists();
//    var jitdata = this.vizDataForJit;
//    var index = trellolists.length;
//    while (index--) {
//      jitdata.color[index] = trellolists[index].color();
//    }
  };

  $scope.actionLogOut = function () {
//    Trelloviz.viewModel.loggedIn(false);
//    Trello.deauthorize();
  };

  $scope.actionSaveApiKeyToLocalStorage = function () {
//    localStorage.trelloviz_api_key = this.apiKey();
  };

  $scope.setNewData = function (trellodata) {
//    Trelloviz.viewModel.showSpinner(false);

    // core computing ...
//    var opts = {};
//    opts.keepArchivedCards = Trelloviz.viewModel.core_option_keepArchiveCards();
//    var engine = new Trelloviz.Core.Engine(opts);
//    Trelloviz.viewModel.vizDataForJit = engine.computeVizData_all_lists(trellodata);
//    Trelloviz.viewModel.areaChart = Trelloviz.showGraphic(Trelloviz.viewModel.vizDataForJit);

    // make colors observable for changing it via color picker
//    var listsWithNaturalOrder = engine.retrieveListsWithNaturalOrder();
//    listsWithNaturalOrder.forEach(function (item) {
//      item.color = ko.observable(item.color)
//    });
//    Trelloviz.viewModel.trelloLists(listsWithNaturalOrder);
  };


}