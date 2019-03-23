// the global variables that hold the different requests
var quizclient;
//custom markers that are used to representative of the answered questions;
//the colour depens on it is a correct or wrong answer.
var wrongMarker=L.AwesomeMarkers.icon({
	icon:'play',
	markerColor:'red'});
var correctMarker=L.AwesomeMarkers.icon({
	icon:'play',
	markerColor:'green'});

//the following methods adapted from here: 
//https://moodle-1819.ucl.ac.uk/mod/folder/view.php?id=1025047
//accessed 15th March 2019
function processAnswer(postString) {
	quizclient = new XMLHttpRequest();
	postString = "port_id=" + httpPortNumber + postString;
	var url = 'http://developer.cege.ucl.ac.uk:'+ httpPortNumber + "/uploadAnswer";
	quizclient.open('POST',url,true);
	quizclient.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	quizclient.onreadystatechange = userAnswerUploaded;
	quizclient.send(postString);
}

// create the code to wait for the response from the data server, 
//and process the response once it is received
function userAnswerUploaded() {
	// this function listens out for the server to say that the data is ready - i.e. has state 4
	if (quizclient.readyState == 4) {
		// change the DIV to show the response
		//alert(quizclient.responseText);
		//showCorrectNum();
		document.getElementById("uploadAnswerDiv").innerHTML = quizclient.responseText;
	}
}

//the code to check if user's given answer is right or not
//and call the method to alert how many questions the user has anwered correctly by far(might be the same question)
//and call the method to upload user's answers
function checkAnswer(questionID) {  
	// get the correct answer from the hidden div  
	// NB - do this BEFORE you close the pop-up as when you close the pop-up the DIV is destroyed  
	var answer = document.getElementById("answer"+questionID).innerHTML; 
 	// now check the question radio buttons 
 	var correctAnswer = false;  
 	var answerSelected = 0;  
 	for (var i=1; i < 5; i++) {   
 		if (document.getElementById("answer_"+i).checked){    
 			answerSelected = i;   
 		}   
 		if ((document.getElementById("answer_"+i).checked) && (i == answer)) { 
 			alert ("Well done");
 			showCorrectNum();      
 			correctAnswer = true;   
 		}  
 	}  
 	if (correctAnswer === false) {   
 		// they didn't get it right   
 		showCorrectNum();
 		alert("Better luck next time");  
 	} 

 	// now close the popup   
 	mymap.closePopup();  

 	// the code to upload the answer to the server would go here  
 	// call an AJAX routine using the data  
 	// the answerSelected variable holds the number of the answer     
 	//that the user picked 
 	var question_id = questionID;
 	var correct_answer = answer;
	// now get the radio button values
	var answer_selected=answerSelected;
	var postString = "&question_id="+ question_id +"&answer_selected="+answer_selected+"&correct_answer="+correct_answer;
	//alert (postString);

	//the code to change matching icon colours
	//the colour depending on whether answer was right or wrong
	QuizPointLayer.eachLayer(function(layer) {   
		if (layer.feature.properties.id == question_id){
			if (correctAnswer===true) {
				layer.setIcon(layer.options.icon=correctMarker);  
			}    
			else{
				layer.setIcon(layer.options.icon=wrongMarker);  
			}
		}  
	}); 
	processAnswer(postString);
}