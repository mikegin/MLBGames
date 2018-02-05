function getMLBGames() {
	
	var gamesDate = new Date(document.getElementById("gamesDate").value);

	if(validDate(gamesDate)) {
		//-------date formating---------
		var date = gamesDate.getDate() + 1;
		var month = gamesDate.getMonth() + 1;
		var year = gamesDate.getFullYear();

		if(date < 10) { date = "0" + date; }
		if(month < 10) { month = "0" + month; }
		//--------------------------------

		//mlb json api feed
		var mlbAPI = "http://gd2.mlb.com/components/game/mlb/" +
			"year_" + year + 
			"/month_" + month + 
			"/day_" + date + 
			"/master_scoreboard.json";

		$.getJSON( mlbAPI )
		.done(function (data) {
			var gamesJson = data.data.games.game;

			createGamesTable(gamesJson);
			
			console.log(data);
		});
	}	
}

function createGamesTable(gamesJson) {

	clearTable("gamesTable");

	//no games
	if(!gamesJson) {
		addGameToTable(0, null, false);
	}
	//multiple games
	else if(Object.prototype.toString.call( gamesJson ) === "[object Array]") {
		$.each(
		    gamesJson ,
		    function(i,v) {
		    	addGameToTable(i, v, true);
		    }
		);
	}
	//single game 
	else {
		addGameToTable(0, gamesJson, true);	
	}
}

function addGameToTable(gameIndex, game, hasGames) {

	var tableContents; 

	if(!hasGames) {
		tableContents = "<tr>" + "<td>" + "No games today" + "</td>" + "</tr>";
		$("#gamesTable").append(tableContents);
	} else {
		var homeId = game.home_team_name;
		var awayId = game.away_team_name;

		//replace spacing, add gameIndex for unique identification
		homeId = homeId.replace(/\s/g, "_") + gameIndex;
		awayId = awayId.replace(/\s/g, "_") + gameIndex;

		var tableContents = createGameTBody(game, homeId, awayId);

		var favTeam = document.getElementById("favTeam");
		var favTeamName;
		if(favTeam.selectedIndex > -1) {
			favTeamName = favTeam.options[favTeam.selectedIndex].text;
		}
		
		//put favourite team games first
    	if(game.home_team_name === favTeamName || 
    			game.away_team_name === favTeamName) {
			$("#gamesTable").prepend(tableContents);
		} else {
			$("#gamesTable").append(tableContents);	
		}

		//bold winning team
		if(game.hasOwnProperty("linescore")) {
			var home = Number(game.linescore.r.home);
			var away = Number(game.linescore.r.away);
    		if(home > away) {
				addBoldToTableRow(homeId);
    		} else if (home < away) {
    			addBoldToTableRow(awayId);
    		}
    	}
	}	    	
}

function createGameTBody(game, homeId, awayId) {
	tableContents = "<tbody data-directory=" + game.game_data_directory + 
	" data-status=" + game.status.status + " onclick=getGameStats(this)>";

	//add home row
	tableContents += "<tr id=" + homeId + ">";
	tableContents += "<td>" + game.home_team_name + "</td>";
	tableContents += "<td>";
	if(game.hasOwnProperty("linescore")) {
		tableContents += game.linescore.r.home;
	}
	tableContents += "</td>";
	tableContents += "</tr>";

	//add away row
	tableContents += "<tr id=" + awayId + ">"; 
	tableContents += "<td>" + game.away_team_name + "</td>";
	tableContents += "<td>";
	if(game.hasOwnProperty("linescore")) {
		tableContents += game.linescore.r.away;
	}
	tableContents += "</td>";
	tableContents += "</tr>";

	//add status
	tableContents += "<tr>" + "<td>" + game.status.status + "</td>" + "</tr>";

	tableContents += "</tablebody>";

	return tableContents;
}

function getGameStats(game) {
	var statusBlacklist = ["Cancelled", "Postponed", "Preview"];

	var status = $(game).data("status");

	if(!contains.call(statusBlacklist, status)) {
		var dir = $(game).data("directory");
		
		sessionStorage.setItem("0", dir);

		window.location.href = "gameStats.html";
	}
}

function populateFavouriteSelect() {
	var teamList = ["Blue Jays", "Orioles", "White Sox", "Indians", "Tigers", 
		"Astros", "City Royals", "Angels", "Twins", "Yankees", "Athletics", 
		"Mariners", "Rays", "Rangers", "Diamondbacks", "Braves", "Cubs", "Reds",
		"Rockies", "Dodgers", "Marlins", "Brewers", "Mets", "Phillies", 
		"Pirates", "Padres", "Giants", "Cardinals", "Nationals"];

	teamList.sort();

	var selectFav = document.getElementById("favTeam");

	if(selectFav.childNodes.length === 0) {
		$.each(
		    teamList ,
		    function(i,v) {
		    	var option = document.createElement("option");
		    	option.text = v;
		    	selectFav.appendChild(option);
		    }
		);
	}
}
