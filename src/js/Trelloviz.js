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

var Trelloviz_ensureConfigTextFilled = function () {
    if (typeof TRELLO_API_KEY != "undefined") {
        $("#txtTRELLOAPIKEY").attr('value', TRELLO_API_KEY);
    }
}

var Trelloviz_updateLoggedIn = function () {
    var isLoggedIn = (typeof Trello != "undefined") && Trello.authorized();
    $("#connectButton").toggle(!isLoggedIn);
    $("#disconnectButton, #loggedin").toggle(isLoggedIn);

    $("#selectBoardPanel").toggle(isLoggedIn);

};

var Trelloviz_onAuthorizeError = function (arg1, arg2, arg3) {

};

var Trelloviz_onAuthorize = function () {
    Trelloviz_updateLoggedIn();

    Trello.members.get("me", function (member) {
        $("#fullName").text(member.fullName);
    });

    Trello.get("members/me/boards", {}, Trelloviz_showBoards);
};


var Trelloviz_trelloLogin = function (data, textStatus, jqxhr) {
    Trello.authorize({
        interactive:true,
        type:"popup",
        success:Trelloviz_onAuthorize,
        //error: Trelloviz_onAuthorizeError,
        expiration:"1day",
        scope:{ read:true, write:false }
    });
};


var Trelloviz_logout = function () {
    Trello.deauthorize();
    Trelloviz_updateLoggedIn();
};

var Trelloviz_getApiKey = function () {
    var apikey = $("#txtTRELLOAPIKEY").attr('value');
    if (apikey.length == 32) return apikey;
    return null;
};

var Trelloviz_bindActions = function () {

    Trelloviz_ensureConfigTextFilled();

    //$( "#dialog-form" ).dialog({ autoOpen: false });

//    $("#settingsButton").button().click(function(){
//        $( "#dialog-form" ).dialog( "open" );
//    });

    $("#connectButton").click(function () {
        jQuery.getScript('https://api.trello.com/1/client.js?key=' + Trelloviz_getApiKey(), Trelloviz_trelloLogin);
    });

    $("#disconnectButton").click(Trelloviz_logout);

    $("#menuConfigApiKey,#btnCloseConfigApiKeyPanel").click(function () {
        $("#configApiKeyPanel").toggle();
    });

    Trelloviz_updateLoggedIn();
};


var Trelloviz_showCards = function (cards) {
    var $uiwidget = $('<div class="ui-widget">').appendTo("#output");
    $('<p>').text('Your Cards: ').appendTo($uiwidget);
    $.each(cards, function (idx, card) {
        $('<p style="padding-left: 2em;">').text(card.name + ' (' + card.id + ')').appendTo($uiwidget);
    });
};


var Trelloviz_showActions = function (actions) {
    var $uiwidget = $('<div class="ui-widget">').appendTo("#output");
    $('<p>').text('All Actions: ').appendTo($uiwidget);
    var $ul = $('<ul>').appendTo($uiwidget);
    $.each(actions, function (idx, action) {
        $('<li>').text(action.type + ' (' + action.date + ')').appendTo($ul);
    });
};


var Trelloviz_onListSelected = function (listId) {
    Trello.get("lists/" + listId + "/cards", {}, me.showCards);
}


var Trelloviz_showLists = function (lists) {
    var $uiwidget = $('<div class="ui-widget">').appendTo("#output");
    $('<label>').text('Your Lists: ').appendTo($uiwidget);
    var $select = $('<select id="comboboxLists">').appendTo($uiwidget);

    $("#comboboxLists").combobox({
            selected:function (event, ui) {
                var listid = ui.item.value;
                me.onListSelected(listid);
            }
        }
    );

    $.each(lists, function (idx, list) {
        $('<option value=' + list.id + '>').text(list.name).appendTo($select);
    });
};


var Trelloviz_computeAndShow = function (data) {
    var trellovizData = new TrellovizData();
    var computed = trellovizData.computeVizData_all_lists(data);
    Trelloviz_showGraphic(computed);
};


var Trelloviz_onShowActionForBoard = function (boardId) {
    Trello.get("boards/" + boardId + "/actions", { /* fields:"data,type,date" */ limit:"1000"}, Trelloviz_computeAndShow);
}


//var Trelloviz_onBoardSelected = function (boardId) {
//    var $uiwidget = $('<div class="ui-widget">').appendTo("#output");
//    var $btn = $('<a class="btn btn-primary">').text('Show Chart').appendTo($uiwidget);
//
//    $($btn).click(function (event) {
//        Trelloviz_onShowActionForBoard(boardId);
//    });
//
//    // currently no lists to display
//    // Trello.get("boards/" + boardId + "/lists", { cards:"all" }, Trelloviz_showLists);
//}


var Trelloviz_showBoards = function (boards) {

    var options = [];
    var selectedBoard = {
        id:boards[0].id,
        name:boards[0].name
    };

    $("#selectBoardCombo").empty();

    $("#btnShowChart").click(function (event) {
        Trelloviz_onShowActionForBoard(selectedBoard['id']);
    });

    $.each(boards, function (idx, board) {
        var $opt = $('<option value=' + board.id + '>').text(board.name).appendTo("#selectBoardCombo");
        options.push($opt[0]);
        $($opt).click(
            function (event) {
                var boardid = event.target.value;
                selectedBoard['id'] = boardid;
                selectedBoard['name'] = event.target.text;
//                Trelloviz_onBoardSelected(boardid);
            }
        );
    });

//    $($select).click(
//        function (event) {
//            if (options.indexOf(event.target) >= 0) { // TODO: doesn't work :-/
//               var boardid = event.target.value;
//               Trelloviz_onBoardSelected(boardid);
//            }
//        }
//    );
};

var Trelloviz_showGraphic = function (viz_data) {

    $("#graphic").empty();
    $('<div id="viz_container">').appendTo("#graphic");
    $('<div id="viz_canvas" style="min-height: 500px;">').appendTo("#viz_container");

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
};

