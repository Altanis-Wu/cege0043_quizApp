//startup functions for quiz App
function quizStartup(){
	//alert("quizStartup!");
	document.addEventListener('DOMContentLoaded', function(){
		getPort();
		//get user port number, show as user name
		getUserName();
		// automatically get user location  when the quiz App starts 
		trackLocation();
		// Quiz points load automatically when the quiz App starts 
		startQuizLoad();
		loadW3HTML();
	}, false);
}


//startup functions for question App
function questionStartup(){
	document.addEventListener('DOMContentLoaded', function(){
		getPort();
		loadW3HTML();	
		popupClickLocation();
		//get user port number, show as user name
		getUserName();
	}, false);
}

function loadW3HTML() {
	w3.includeHTML();
}

function getUserName(){
	 document.getElementById("username").innerHTML ="Welcome player: "+ httpPortNumber;
}