/**
 * Trelloviz
 * Copyright 2013 Martin W. Kirst
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

(function () {
  "use strict";
}());

Trelloviz.TrellovizController = function ($scope) {

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