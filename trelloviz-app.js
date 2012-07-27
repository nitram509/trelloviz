var showCards = function(cards) {
	var $uiwidget = $('<div class="ui-widget">').appendTo("#output");
    $('<p>').text('Your Cards: ').appendTo($uiwidget);
    $.each(cards, function(idx, card) {
        $('<p style="padding-left: 2em;">').text(card.name + ' (' + card.id+ ')').appendTo($uiwidget);
    });
};

var showActions = function(actions) {
	var $uiwidget = $('<div class="ui-widget">').appendTo("#output");
    $('<p>').text('All Actions: ').appendTo($uiwidget);
    var $ul = $('<ul>').appendTo($uiwidget);
    $.each(actions, function(idx, action) {
        $('<li>').text(action.type + ' (' + action.date+ ')').appendTo($ul);
    });
};

function onListSelected(listId) {
	Trello.get("lists/"+listId+"/cards", {},  showCards);
}

var showLists = function(lists) {
	var $uiwidget = $('<div class="ui-widget">').appendTo("#output");
    $('<label>').text('Your Lists: ').appendTo($uiwidget);
    var $select = $('<select id="comboboxLists">').appendTo($uiwidget);

    $("#comboboxLists").combobox({
    		selected: function(event, ui) {
    			var listid = ui.item.value;
    			onListSelected(listid);
    		}
	   	}
    );
    
    $.each(lists, function(idx, list) {
        $('<option value='+list.id+'>').text(list.name).appendTo($select);
    });
};

function onShowActionForBoard(boardId) {
	Trello.get("boards/"+boardId+"/actions", {fields:"data,type,date"},  showActions);
}

function onBoardSelected(boardId) {
	var $uiwidget = $('<div class="ui-widget">').appendTo("#output");
	var $btn = $('<button>').text('Show Actions').appendTo($uiwidget);
	$btn.button();
	$btn.click(function() {
		onShowActionForBoard(boardId);
	});
	
	Trello.get("boards/"+boardId+"/lists", { cards :"all" },  showLists);
}

var showBoards = function(boards) {
    $("#output").empty();
    
    var $uiwidget = $('<div class="ui-widget">').appendTo("#output");
    $('<label>').text('Your boards: ').appendTo($uiwidget);
    var $select = $('<select id="combobox">').appendTo($uiwidget);

    $("#combobox").combobox({
    		selected: function(event, ui) {
    			var boardid = ui.item.value;
    			onBoardSelected(boardid);
    		}
	   	}
    );
    
    $.each(boards, function(idx, board) {
        $('<option value='+board.id+'>').text(board.name).appendTo($select);
    });
};

var onAuthorize = function() {
    updateLoggedIn();
    
    Trello.members.get("me", function(member) {
        $("#fullName").text(member.fullName);
    });
    
    Trello.get("members/me/boards", {},  showBoards);
};

var updateLoggedIn = function() {
    var isLoggedIn = (typeof Trello != "undefined") && Trello.authorized();
    $("#connectButton").toggle(!isLoggedIn);
    $("#disconnectButton, #loggedin").toggle(isLoggedIn);        
};
    
var logout = function() {
    Trello.deauthorize();
    updateLoggedIn();
};
            
var trelloLogin = function(data, textStatus, jqxhr) {
	Trello.authorize({
    	interactive:true,
        type: "popup",
        success: onAuthorize,
        expiration: "1hour",
        scope: { read: true, write: false }
    });	
};

var bindActions = function() {

	$("#connectButton").button();
	$("#connectButton").click(function() {
		jQuery.getScript('https://api.trello.com/1/client.js?key='+TRELLO_API_KEY, trelloLogin);
	});
	
	$("#disconnectButton").button();
	$("#disconnectButton").click(logout);
	
	updateLoggedIn();
};
