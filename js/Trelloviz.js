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

var Trelloviz_Data = new TrellovizData();

var Trelloviz_updateLoggedIn = function () {
    var isLoggedIn = (typeof Trello != "undefined") && Trello.authorized();
    $("#connectButton").toggle(!isLoggedIn);
    $("#disconnectButton, #loggedin").toggle(isLoggedIn);
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
        expiration:"1hour",
        scope:{ read:true, write:false }
    });
};


var Trelloviz_logout = function () {
    Trello.deauthorize();
    Trelloviz_updateLoggedIn();
};

var Trelloviz_bindActions = function () {
    //$( "#dialog-form" ).dialog({ autoOpen: false });

//    $("#settingsButton").button().click(function(){
//        $( "#dialog-form" ).dialog( "open" );
//    });

    $("#connectButton").click(function () {
        jQuery.getScript('https://api.trello.com/1/client.js?key=' + TRELLO_API_KEY, Trelloviz_trelloLogin);
    });

    $("#disconnectButton").click(Trelloviz_logout);

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
    var computed = Trelloviz_Data.computeVizData(data);
    Trelloviz_showGraphic(computed);
};


var Trelloviz_onShowActionForBoard = function (boardId) {
    Trello.get("boards/" + boardId + "/actions", { /* fields:"data,type,date" */ limit:"1000"}, Trelloviz_computeAndShow);
}


var Trelloviz_onBoardSelected = function (boardId) {
    var $uiwidget = $('<div class="ui-widget">').appendTo("#output");
    var $btn = $('<a class="btn btn-primary">').text('Show Chart').appendTo($uiwidget);

    $($btn).click(function (event) {
        Trelloviz_onShowActionForBoard(boardId);
    });

    // currently no lists to display
    // Trello.get("boards/" + boardId + "/lists", { cards:"all" }, Trelloviz_showLists);
}


var Trelloviz_showBoards = function (boards) {
    $("#output").empty();

    var $forminline = $('<form class="form-inline">').appendTo("#output");
    var $controlgroup = $('<div class="control-group">').appendTo($forminline);
    $('<label>').text('Your boards: ').appendTo($controlgroup);
    var $controls = $('<div class="controls">').appendTo($controlgroup);
    var $select = $('<select id="combobox">').appendTo($controls);

    var options = [];

    $.each(boards, function (idx, board) {
        var $opt = $('<option value=' + board.id + '>').text(board.name).appendTo($select);
        options.push($opt[0]);
        $($opt).click(
            function (event) {
                var boardid = event.target.value;
                Trelloviz_onBoardSelected(boardid);
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


var Trelloviz_showSettings = function () {


    var name = $("#name"),
        allFields = $([]).add(name),
        tips = $(".validateTips");

    function updateTips(t) {
        tips
            .text(t)
            .addClass("ui-state-highlight");
        setTimeout(function () {
            tips.removeClass("ui-state-highlight", 1500);
        }, 500);
    }

    function checkLength(o, n, min, max) {
        if (o.val().length > max || o.val().length < min) {
            o.addClass("ui-state-error");
            updateTips("Length of " + n + " must be between " +
                min + " and " + max + ".");
            return false;
        } else {
            return true;
        }
    }

    function checkRegexp(o, regexp, n) {
        if (!( regexp.test(o.val()) )) {
            o.addClass("ui-state-error");
            updateTips(n);
            return false;
        } else {
            return true;
        }
    }

    $("#dialog-form").dialog({
        autoOpen:false,
        height:300,
        width:350,
        modal:true,
        buttons:{
            "Create an account":function () {
                var bValid = true;
                allFields.removeClass("ui-state-error");
                bValid = bValid && checkLength(name, "username", 3, 16);
                bValid = bValid && checkRegexp(name, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter.");

                if (bValid) {
                    $("#users tbody").append("<tr>" +
                        "<td>" + name.val() + "</td>" +
                        "</tr>");
                    $(this).dialog("close");
                }
            },
            Cancel:function () {
                $(this).dialog("close");
            }
        },
        close:function () {
            allFields.val("").removeClass("ui-state-error");
        }
    });
}


var Trelloviz_showGraphic = function (viz_data) {
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

