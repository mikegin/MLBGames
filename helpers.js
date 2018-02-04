function validDate(d) {
	if ( Object.prototype.toString.call(d) === "[object Date]" ) {
	  // it is a date
	  if ( isNaN( d.getTime() ) ) {  // d.valueOf() could also work
	    // date is not valid
	    return false;
	  }
	  else {
	    // date is valid
	    return true;
	  }
	}
	else {
	  // not a date
	  return false;
	}
}

function clearTable(tableId) {
	var table = document.getElementById(tableId);
	while (table.firstChild) {
	    table.removeChild(table.firstChild);
	}

}

function addBoldToTableRow(tableRowId) {
	var tr = document.getElementById(tableRowId);
	for(var i = 0; i < tr.childNodes.length; i++) {
	    addBold(tr.childNodes[i]);
	}
}

function addBold(node) {
	var b = document.createElement('b');
	b.appendChild(node.firstChild);
	node.appendChild(b);
}

function removeBold(node) {
	var text = node.firstChild.firstChild;
	node.removeChild(node.firstChild);
	node.appendChild(text);
}
