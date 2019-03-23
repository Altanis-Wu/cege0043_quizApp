/*var xhrNode;

function callDivNodeJSChange() {
	alert("function 1111");
	var url2 = http://developer.cege.ucl.ac.uk:30289/test2.html
	var url = "http://developer.cege.ucl.ac.uk:"+httpPortNumber;
	alert(url);
	xhrNode = new XMLHttpRequest();
	//var url = "http://developer.cege.ucl.ac.uk:"+httpPortNumber;
	//alert(url);
	//xhrNode.open("GET", url, true);
	var filename = document.getElementById("filename").value;
	//alert(filename);

	var fileurl = url + "/" + filename;	
	alert(fileurl);
	alert(url2);
	xhrNode.open("GET", url, true);
	xhrNode.onreadystatechange = processDivNodeJSChange;
	try {
		alert("Welcome guest!");
		xhrNode.setRequestHeader("Content-Type", "application/x-www-formurlencoded");
	}
	catch (e) {
		// this only works in internet explorer
		document.getElementById("ajaxtest").innerHTML = err.message;
	}
	xhrNode.send();
}


function processDivNodeJSChange() {
	alert("function2!!");
	if (xhrNode.readyState < 4) {
		// while waiting response from server
		alert("function3!!");
		document.getElementById('ajaxtest').innerHTML = "Loading...";
	}
	else if (xhrNode.readyState === 4) { 
		alert("function4!!");
		// 4 = Response from server has been completely loaded.
		if (xhrNode.status == 200 && xhrNode.status < 300){
			// http status between 200 to 299 are all successful
			alert("function5!!");
			document.getElementById('ajaxtest').innerHTML = xhrNode.responseText;
		}
	}
}*/

var xhrNode; // define the global variable to process the AJAX request

function callDivChange() {
	xhrNode = new XMLHttpRequest();
	alert("clicking...");
	var filename = document.getElementById("filename").value;
	var url = "http://developer.cege.ucl.ac.uk:"+httpPortNumber;
	//var url2 = "http://developer.cege.ucl.ac.uk:30289/test1.html";
	var fileurl = url + "/" + filename;	
	xhrNode.open("GET", fileurl, true);
	xhrNode.onreadystatechange = processDivChange;
	try {
		alert("Welcome guest!");
		xhrNode.setRequestHeader("Content-Type", "application/x-www-formurlencoded");
	}
	catch (e) {
		// this only works in internet explorer
		document.getElementById("div1").innerHTML = err.message;
	}
	xhrNode.send();
}

function processDivChange() {
	alert("clicking2...");
	if (xhrNode.readyState < 4) // while waiting response from server
	document.getElementById('div1').innerHTML = "Loading...";
	else if (xhrNode.readyState === 4) 
	{ // 4 = Response from server has been completely loaded.
		alert("clicking3..."+xhrNode.status);
		if (xhrNode.status == 200 && xhrNode.status < 300){
			alert("clicking4...");
			// http status between 200 to 299 are all successful
			document.getElementById('div1').innerHTML = xhrNode.responseText;
		}
	}
}
