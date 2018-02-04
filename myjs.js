//TODO:
// date in the future? is check needed?	
// refactor names

function getMLBGames() {
	var x = new Date(document.getElementById("myDate").value);

	//-------date formating---------
	var date = x.getDate() + 1;
	var month = x.getMonth() + 1;
	var year = x.getYear() + 1900;

	if(date < 10) { date = "0" + date};
	if(month < 10) { month = "0" + month};
	//--------------------------------

	//mlb json api feed
	var mlbAPI = "http://gd2.mlb.com/components/game/mlb/year_" + year +"/month_" + month + "/day_" + date + "/master_scoreboard.json";

	$.getJSON( mlbAPI)
	.done(function (data) {
		//obtain games JSON
		var gamesJson = data.data.games.game;

		//clear table
		clearTable("myTable");

		//no games
		if(gamesJson === undefined || gamesJson === null) {//go over this, null vs undefined
			addToTable(0, null, false);
		}
		//multiple games
		else if(Object.prototype.toString.call( gamesJson ) === '[object Array]') {
			$.each(
			    gamesJson ,
			    function(i,v) {
			    	addToTable(i, v, true);
			    }
			);
		}
		//single game 
		else {
			addToTable(0, gamesJson, true);	
		}
		console.log(data);
	});
	
}

function addToTable(i, v, hasGames) {
	var tableContents; 

	if(!hasGames) {
		tableContents = "<tr>" + "<td>" + "No games today" + "</td>" + "</tr>";
		$("#myTable").append(tableContents);
	} else {
		var homeId = v.home_team_name;
		homeId = homeId.replace(/\s/g, "_") + i;

		var awayId = v.away_team_name;
		awayId = awayId.replace(/\s/g, "_") + i;

		var tableContents = createGameTBody(v, homeId, awayId);

    	//put jays games first
    	if(v.home_team_name === "Blue Jays" || v.away_team_name === "Blue Jays") {
			$("#myTable").prepend(tableContents);
		} else {
			$("#myTable").append(tableContents);	
		}

		//bold winning team
		if(v.hasOwnProperty('linescore')) {
			var home = Number(v.linescore.r.home);
			var away = Number(v.linescore.r.away);
    		if(home > away) {
				addBoldToTableRow(homeId);
    		} else if (home < away) {
    			addBoldToTableRow(awayId);
    		}
    	}
	}	    	
}

function createGameTBody(v, homeId, awayId) {
	tableContents = "<tbody data-directory=" + v.game_data_directory + " onclick=getGameStats(this)>";

	//add home row
	tableContents += "<tr id=" + homeId + ">";
	tableContents += "<td>" + v.home_team_name + "</td>";
	tableContents += "<td>";
	if(v.hasOwnProperty('linescore')) {
		tableContents += v.linescore.r.home;
	}
	tableContents += "</td>";
	tableContents += "</tr>";

	//add away row
	tableContents += "<tr id=" + awayId + ">"; 
	tableContents += "<td>" + v.away_team_name + "</td>";
	tableContents += "<td>";
	if(v.hasOwnProperty('linescore')) {
		tableContents += v.linescore.r.away;
	}
	tableContents += "</td>";
	tableContents += "</tr>";

	//add status
	tableContents += "<tr>" + "<td>" + v.status.status + "</td>" + "</tr>";

	tableContents += "</tablebody>";

	return tableContents;
}

function getGameStats(game) {
	var dir = $(game).data("directory");

	sessionStorage.setItem('0', dir);

	window.location.href = "gameStats.html";
	
}
