//startup functions for quiz App
function quizStartup(){
	//alert("quizStartup!");
	document.addEventListener('DOMContentLoaded', function(){
		getPort();
		// automatically get user location  when the quiz App starts 
		trackLocation();
		// Quiz points load automatically when the quiz App starts 
		startQuizLoad();
	}, false);
}


//startup functions for question App
function questionStartup(){
	document.addEventListener('DOMContentLoaded', function(){
		getPort();
		loadW3HTML();	
		popupClickLocation();
	}, false);
}

function loadW3HTML() {
	w3.includeHTML();
}