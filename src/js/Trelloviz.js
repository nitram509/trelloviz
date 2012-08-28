/**
 * Trelloviz
 * Copyright 2012 Martin W. Kirst
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

"use strict"; // jshint ;_;

if (typeof Trelloviz == 'undefined') {
  var Trelloviz = { /* namespace */ };
}

Trelloviz.viewModel = {
  apiKey:ko.observable(''),
  loggedIn:ko.observable(false),
  showSpinner:ko.observable(false),
  fullTrelloUserName:ko.observable(''),
  trelloLists:ko.observableArray(),
  html5LocalStorageAvailable:ko.observable(false),

  areaChart:null,
  vizDataForJit:null,

  showConfigPanel:ko.observable(false),
  toggleConfigApiKeyPanelVisible:function () {
    var visible = Trelloviz.viewModel.showConfigPanel();
    Trelloviz.viewModel.showConfigPanel(!visible);
  },

  actionListsUpdated:function () {
    this.updateVizDataFromTrelloListsSettings();
    this.areaChart.loadJSON(this.vizDataForJit);
  },

  updateVizDataFromTrelloListsSettings:function () {
    var trellolists = this.trelloLists();
    var jitdata = this.vizDataForJit;
    var index = trellolists.length;
    while (index--) {
      jitdata.color[index] = trellolists[index].color();
    }
  },

  actionLogIn:function () {
    var apikey = Trelloviz.viewModel.apiKey();
    if (apikey != null && apikey.length == 32) {
      Trelloviz.viewModel.showConfigPanel(false);
      jQuery.getScript('https://api.trello.com/1/client.js?key=' + apikey, Trelloviz.trelloLogin);
    }
    else {
      Trelloviz.viewModel.showConfigPanel(true);
    }
  },

  actionLogOut:function () {
    Trelloviz.viewModel.loggedIn(false);
    Trello.deauthorize();
  },

  actionSaveApiKeyToLocalStorage:function () {
    localStorage.trelloviz_api_key = this.apiKey();
  },

  setNewData:function (trellodata) {
    Trelloviz.viewModel.showSpinner(false);

    // core computing ...
    var engine = new Trelloviz.Core.Engine();
    Trelloviz.viewModel.vizDataForJit = engine.computeVizData_all_lists(trellodata);
    Trelloviz.viewModel.areaChart = Trelloviz.showGraphic(Trelloviz.viewModel.vizDataForJit);

    // make colors observable for changing it via color picker
    var listsWithNaturalOrder = engine.retrieveListsWithNaturalOrder();
    listsWithNaturalOrder.forEach(function (item) {
      item.color = ko.observable(item.color)
    });
    Trelloviz.viewModel.trelloLists(listsWithNaturalOrder);
  }

}

Trelloviz.trelloLoadAndShowUserInfo = function () {
  this.viewModel.showSpinner(true);
  Trello.members.get("me", function (member) {
    Trelloviz.viewModel.fullTrelloUserName(member.fullName);
    Trelloviz.viewModel.showSpinner(false);
  });
}

Trelloviz.trelloLoadAndShowBoards = function () {
  this.viewModel.showSpinner(true);
  Trello.get("members/me/boards", {}, Trelloviz.showBoards);
}

Trelloviz.onAuthorize = function () {
  Trelloviz.viewModel.showSpinner(false);
  var reallyLoggedIn = (typeof Trello != "undefined") && Trello.authorized();
  Trelloviz.viewModel.loggedIn(reallyLoggedIn);

  if (reallyLoggedIn) {
    Trelloviz.trelloLoadAndShowUserInfo();

    $('#loggedin').fadeIn().delay(2000).fadeOut(); // TODO: should use Knockout instead of jQuery

    Trelloviz.trelloLoadAndShowBoards();
  }
};

Trelloviz.onAuthorizeError = function () {
  Trelloviz.viewModel.loggedIn(false);
  Trelloviz.viewModel.showSpinner(false);
};

Trelloviz.trelloLogin = function (data, textStatus, jqxhr) {
  Trelloviz.viewModel.showSpinner(true);
  Trello.authorize({
    interactive:true,
    type:"popup",
    success:Trelloviz.onAuthorize,
    error:Trelloviz.onAuthorizeError,
    expiration:"1day",
    scope:{ read:true, write:false }
  });
};

Trelloviz.onShowActionForBoard = function (boardId) {
  Trelloviz.viewModel.showSpinner(true);
  Trello.get("boards/" + boardId + "/actions", { /* fields:"data,type,date" */ limit:"1000"}, Trelloviz.viewModel.setNewData);
}

Trelloviz.showBoards = function (boards) {
  Trelloviz.viewModel.showSpinner(false);
  var options = [];
  var selectedBoard = {
    id:boards[0].id,
    name:boards[0].name
  };

  $("#selectBoardCombo").empty();

  $("#btnShowChart").click(function (event) {
    Trelloviz.onShowActionForBoard(selectedBoard['id']);
  });

  $.each(boards, function (idx, board) {
    var $opt = $('<option value=' + board.id + '>').text(board.name).appendTo("#selectBoardCombo");
    options.push($opt[0]);
    $($opt).click(
      function (event) {
        var boardid = event.target.value;
        selectedBoard['id'] = boardid;
        selectedBoard['name'] = event.target.text;
//                Trelloviz.onBoardSelected(boardid);
      }
    );
  });

};

Trelloviz.showGraphic = function (viz_data) {

  $("#graphic").empty();
  $('<div id="viz_container" style="min-height: 700px">').appendTo("#graphic");
  $('<div id="viz_canvas" style="min-height: 700px">').appendTo("#viz_container");

  var areaChart = new $jit.AreaChart({
    //id of the visualization container
    injectInto:'viz_canvas',
    //add animations
    animate:true,
    Margin:{ top:5, left:5, right:5, bottom:5 },
    labelOffset:10,
    showAggregates:true,
    showLabels:true,
    type:'stacked:gradient',
    //label styling
//        Label:{
//            type:'HTML', //can be 'Native' or 'HTML'
//            size:5,
//            family:'monospace',
//            color:'silver'
//        },
    //enable tips
    Tips:{
      enable:true,
      onShow:function (tip, elem) {
//                var tt = document.createElement("span");
//                tt.className = "tooltip"
//                tt.innerHTML = "" + elem.name + " " + elem.value;
//                while (tip.hasChildNodes()) tip.removeChild(tip.firstChild);
//                tip.appendChild(tt);
        $(tip).empty();
        $("<span>")
          .addClass("label")
          .addClass("label-info")
          .text("" + elem.name + " (" + elem.value + ")")
          .appendTo(tip);
      }
    },
    //add left and right click handlers
    filterOnClick:false,
    restoreOnRightClick:true
  });
  areaChart.loadJSON(viz_data);

  return areaChart;
};

// load API KEY from local HTML5 storage
(function () {
  if (typeof(Storage) !== "undefined") {
    Trelloviz.viewModel.html5LocalStorageAvailable(true);
    if (localStorage.trelloviz_api_key) {
      Trelloviz.viewModel.apiKey(localStorage.trelloviz_api_key);
    }
  }
})();
