var httpPortNumber;
var httpsPortNumber;
function getPort(){
	var portXhr = new XMLHttpRequest();
	portXhr.addEventListener("load", function () {
		var parser = new DOMParser();
		var doc = parser.parseFromString(portXhr.responseText, "application/xml");
		httpPortNumber= doc.getElementsByTagName("node-port-http").item(0).textContent;
		httpsPortNumber= doc.getElementsByTagName("node-port-https").item(0).textContent;
		//console.log("Port : " + httpPortNumber);
	});

	// depending on whether we are in a browser or on a phone
	// the location of the config file is different
	// if we are on a phone then http and https won't be present
	var configLocation = "res/port.xml";
	portXhr.open("get", configLocation, false);
	portXhr.send();
}
