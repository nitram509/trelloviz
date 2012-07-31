/**
 Trelloviz
 Copyright 2012 Martin W. Kirst

 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

Trelloviz = function () {

}


Trelloviz.prototype.showCards = function (cards) {
    var $uiwidget = $('<div class="ui-widget">').appendTo("#output");
    $('<p>').text('Your Cards: ').appendTo($uiwidget);
    $.each(cards, function (idx, card) {
        $('<p style="padding-left: 2em;">').text(card.name + ' (' + card.id + ')').appendTo($uiwidget);
    });
};


Trelloviz.prototype.showActions = function (actions) {
    var $uiwidget = $('<div class="ui-widget">').appendTo("#output");
    $('<p>').text('All Actions: ').appendTo($uiwidget);
    var $ul = $('<ul>').appendTo($uiwidget);
    $.each(actions, function (idx, action) {
        $('<li>').text(action.type + ' (' + action.date + ')').appendTo($ul);
    });
};


Trelloviz.prototype.onListSelected = function (listId) {
    Trello.get("lists/" + listId + "/cards", {}, this.showCards);
}


Trelloviz.prototype.showLists = function (lists) {
    var $uiwidget = $('<div class="ui-widget">').appendTo("#output");
    $('<label>').text('Your Lists: ').appendTo($uiwidget);
    var $select = $('<select id="comboboxLists">').appendTo($uiwidget);

    $("#comboboxLists").combobox({
            selected:function (event, ui) {
                var listid = ui.item.value;
                this.onListSelected(listid);
            }
        }
    );

    $.each(lists, function (idx, list) {
        $('<option value=' + list.id + '>').text(list.name).appendTo($select);
    });
};


Trelloviz.prototype.onShowActionForBoard = function (boardId) {
    Trello.get("boards/" + boardId + "/actions", { /* fields:"data,type,date" */ limit:"1000"}, this.computeVizData);
}


Trelloviz.prototype.onBoardSelected = function (boardId) {
    var $uiwidget = $('<div class="ui-widget">').appendTo("#output");
    var $btn = $('<button>').text('Show Actions').appendTo($uiwidget);
    $btn.button();
    $btn.click(function () {
        this.onShowActionForBoard(boardId);
    });

    Trello.get("boards/" + boardId + "/lists", { cards:"all" }, this.showLists);
}


Trelloviz.prototype.showBoards = function (boards) {
    $("#output").empty();

    var $uiwidget = $('<div class="ui-widget">').appendTo("#output");
    $('<label>').text('Your boards: ').appendTo($uiwidget);
    var $select = $('<select id="combobox">').appendTo($uiwidget);

    $("#combobox").combobox({
            selected:function (event, ui) {
                var boardid = ui.item.value;
                this.onBoardSelected(boardid);
            }
        }
    );

    $.each(boards, function (idx, board) {
        $('<option value=' + board.id + '>').text(board.name).appendTo($select);
    });
};


Trelloviz.prototype.onAuthorize = function () {
    this.updateLoggedIn();

    Trello.members.get("me", function (member) {
        $("#fullName").text(member.fullName);
    });

    Trello.get("members/me/boards", {}, this.showBoards);
};


Trelloviz.prototype.updateLoggedIn = function () {
    var isLoggedIn = (typeof Trello != "undefined") && Trello.authorized();
    $("#connectButton").toggle(!isLoggedIn);
    $("#disconnectButton, #loggedin").toggle(isLoggedIn);
};


Trelloviz.prototype.logout = function () {
    Trello.deauthorize();
    this.updateLoggedIn();
};


Trelloviz.prototype.trelloLogin = function (data, textStatus, jqxhr) {
    Trello.authorize({
        interactive:true,
        type:"popup",
        success:this.onAuthorize,
        expiration:"1hour",
        scope:{ read:true, write:false }
    });
};


Trelloviz.prototype.bindActions = function () {
    $("#connectButton").button();
    $("#connectButton").click(function () {
        jQuery.getScript('https://api.trello.com/1/client.js?key=' + TRELLO_API_KEY, this.trelloLogin);
    });

    $("#disconnectButton").button();
    $("#disconnectButton").click(this.logout);

    this.updateLoggedIn();
};


Trelloviz.prototype.showGraphic = function (viz_data) {
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
        Label:{
            type:'Native', //can be 'Native' or 'HTML'
            size:13,
            family:'monospace',
            color:'silver'
        },
        //enable tips
        Tips:{
            enable:true,
            onShow:function (tip, elem) {
                var tt = document.createElement("span");
                tt.className = "tooltip"
                tt.innerHTML = "" + elem.name + " " + elem.value;
                while (tip.hasChildNodes()) tip.removeChild(tip.firstChild);
                tip.appendChild(tt);
            }
        },
        //add left and right click handlers
        filterOnClick:false,
        restoreOnRightClick:true
    });
    areaChart.loadJSON(viz_data);
};

Trelloviz.prototype.computeVizData = function (data) {
    var vizTimestamps = [];
    var vizPlan = [];
    var vizWiP = [];
    var vizDone = [];

    var idPlan = "500daadf637e1efe2a2348fa";
    var idWiP = "500daadf637e1efe2a2348fb";
    var idDone = "500daadf637e1efe2a2348fc";

    var counterPerList = {};
    var cardToListMap = {};

    counterPerList[idPlan] = 0;
    counterPerList[idWiP] = 0;
    counterPerList[idDone] = 0;

    data.sort(function (a, b) {
        var unixtimestamp_a = Date.parse(a.date);
        var unixtimestamp_b = Date.parse(b.date);
        if (unixtimestamp_a < unixtimestamp_b) return -1;
        if (unixtimestamp_a > unixtimestamp_b) return 1;
        return 0;
    });

    $.each(data, function (idx, trelloAction) {
        console.info(trelloAction.date);
        var unixtimestamp = trelloAction.date;// Date.parse(trelloAction.date);
        console.info(new Date(unixtimestamp));

        if (trelloAction.type == 'createCard') {
            counterPerList[trelloAction.data.list.id]++;
            cardToListMap[trelloAction.data.card.id] = trelloAction.data.list.id;
        } else if (trelloAction.type == 'updateCard') {
            if (trelloAction.data.card.closed == true && trelloAction.data.old.closed == false) {
                counterPerList[cardToListMap[trelloAction.data.card.id]]--;
            }
            if (typeof trelloAction.data.listAfter != "undefined"
                && trelloAction.data.listBefore != "undefined"
                && trelloAction.data.listAfter.id != trelloAction.data.listBefore.id) {
                // verschoben
                counterPerList[trelloAction.data.listAfter.id]++;
                counterPerList[trelloAction.data.listBefore.id]--;
            }
        } else {
            console.info(trelloAction.type);
        }

        vizTimestamps.push(unixtimestamp);
        vizPlan.push(counterPerList[idPlan]);
        vizWiP.push(counterPerList[idWiP]);
        vizDone.push(counterPerList[idDone]);

    });

    var viz_data = {
        'label':['ToDo', 'WiP', 'Done'],
        'values':[]
    };
    for (var i = 0; i < vizTimestamps.length; i++) {
        viz_data.values.push(
            {
                'label':vizTimestamps[i],
                'values':[vizPlan[i], vizWiP[i], vizDone[i]]
            }
        );
    };
    this.showGraphic(viz_data);
};