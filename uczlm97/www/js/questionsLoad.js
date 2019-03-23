//global varible for question App
//load and remove the Quiz points
var QuestionPointLayer;
//createavariablethatwillholdtheXMLHttpRequest()
var xhrQuestion;

//automatically change latlng when the user clicked on map
function changeLatlng(){
	alert("Getting the latlng.");
	//enter latlng and format numbers to show 6 decimal places 
	document.getElementById("latitude").value=clickinglat.toFixed(6);
	document.getElementById("longitude").value=clickinglng.toFixed(6);
}

//method to call the other functions to load 
//all the questions points created by my user only
function loadQuestionPoint() 
{
	startQuestionLoad();
}

//to remove all the loaded question points
function removeQuestionPoint() 
{
	//Quiz Points data will be removed
	mymap.removeLayer(QuestionPointLayer);
}	

//to get the questions points from database using
//the functions adapted from here: 
//https://moodle-1819.ucl.ac.uk/mod/folder/view.php?id=1025047
//accessed 10th March 2019
function startQuestionLoad() {
	xhrQuestion = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:"+httpPortNumber;
	url = url + "/getQuizPoints/"+httpPortNumber;
	xhrQuestion.open("GET", url, true);
	xhrQuestion.onreadystatechange = questionPointsResponse;
	xhrQuestion.send();

}

function questionPointsResponse(){
	if (xhrQuestion.readyState == 4) {
		// once the data is ready, process the data
		var questionPointsData = xhrQuestion.responseText;
		loadQuestionLayer(questionPointsData);
	}
}

//convert the received data-which is text
//-toJSON format and add it to the map 
function loadQuestionLayer(questionPointsData){
	//convert the text to JSON 
	var questionPointsDataJSON = JSON.parse(questionPointsData);
	QuestionPointLayer = L.geoJson(questionPointsDataJSON).addTo(mymap);
	mymap.fitBounds(QuestionPointLayer.getBounds());
}
