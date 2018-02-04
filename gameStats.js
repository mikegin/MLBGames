//global reference to the boxscore, needed for onlick="toggle(this)"
var boxscore;

$(function () {
	var dir = sessionStorage.getItem("0");

	var statsJSON = "http://gd2.mlb.com" + dir + "/boxscore.json";

	$.getJSON( statsJSON )
	.done( function (data) {
		console.log(data);
		boxscore = data.data.boxscore;
		createInningsTable();
		createTeamToggle();
		
	});
});

function createInningsTable() {
	var innings = boxscore.linescore.inning_line_score;

	var tableContents;

	//create header row
	tableContents += "<tr>";
	tableContents += "<th>" + "</th>";
	$.each(
	    innings ,
	    function(i,v) {
	    	tableContents += "<th>" + v.inning + "</th>";
	    }
	);
	tableContents += "<th>" + "R" + "</th>";
	tableContents += "<th>" + "H" + "</th>";
	tableContents += "<th>" + "E" + "</th>";
	tableContents += "</tr>";


	//create home team row
	tableContents += "<tr>";
	tableContents += "<td>" + 
		boxscore.home_team_code.toUpperCase() + "</td>";
	$.each(
	    innings ,
	    function(i,v) {
	    	tableContents += "<td>" + v.home + "</td>";
	    }
	);
	tableContents += "<td>" + 
		boxscore.linescore.home_team_runs + "</td>";
	tableContents += "<td>" + 
		boxscore.linescore.home_team_hits + "</td>";
	tableContents += "<td>" + 
		boxscore.linescore.home_team_errors + "</td>";

	//create away team row
	tableContents += "<tr>";
	tableContents += "<td>" + 
		boxscore.away_team_code.toUpperCase() + "</td>";
	$.each(
	    innings ,
	    function(i,v) {
	    	tableContents += "<td>" + v.away + "</td>";
	    }
	);
	tableContents += "<td>" + 
		boxscore.linescore.away_team_runs + "</td>";
	tableContents += "<td>" + 
		boxscore.linescore.away_team_hits + "</td>";
	tableContents += "<td>" + 
		boxscore.linescore.away_team_errors + "</td>";

	tableContents += "</tr>";

	$("#innings").append(tableContents);
}

function createTeamToggle() {
	var homeTextNode = document.createTextNode(boxscore.home_sname);
	var awayTextNode = document.createTextNode(boxscore.away_sname);

	var homeTeam = document.getElementById("homeTeam");
	var awayTeam = document.getElementById("awayTeam");

	homeTeam.appendChild(homeTextNode);
	awayTeam.appendChild(awayTextNode);

	addBold(homeTeam);
	createPlayerStatsTable("homeTeam");
}

function toggle(team) {
	var other;
	if(team.id === "homeTeam") {
		other = document.getElementById("awayTeam");
	} else {
		other = document.getElementById("homeTeam");
	}

	if(team.firstChild.tagName !== "B") {
		addBold(team);
		removeBold(other);
		createPlayerStatsTable(team.id);
	}
}

function createPlayerStatsTable(teamId) {
	clearTable("playerStats");

	var teamIndex
	if(teamId === "awayTeam") {
		teamIndex = 1;
	} else {
		teamIndex = 0;
	}

	var team = boxscore.batting[teamIndex];

	var tableContents;
	tableContents += "<tr>";
	tableContents += "<th>" + "Name" + " </th>";
	tableContents += "<th>" + "R" + " </th>";
	tableContents += "<th>" + "H" + " </th>";
	tableContents += "<th>" + "RBI" + " </th>";
	tableContents += "<th>" + "BB" + " </th>";
	tableContents += "<th>" + "SO" + " </th>";
	tableContents += "<th>" + "AVG" + " </th>";
	tableContents += "</tr>";


	$.each(
		team.batter,
		function(i, v) {
			tableContents += "<tr>";
			tableContents += "<td>" + v.name_display_first_last + "</td>";
			tableContents += "<td>" + v.r + "</td>";
			tableContents += "<td>" + v.h + "</td>";
			tableContents += "<td>" + v.rbi + "</td>";
			tableContents += "<td>" + v.bb + "</td>";
			tableContents += "<td>" + v.so + "</td>";
			tableContents += "<td>" + v.avg + "</td>";
			tableContents += "</tr>";
		}
	);


	$("#playerStats").append(tableContents);
}