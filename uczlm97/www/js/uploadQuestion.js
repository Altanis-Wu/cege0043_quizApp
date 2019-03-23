// the global variable that holds the request
var questionclient; 

//this function is set to get a vaild question
//and then upload it 
//the following methods adapted from here: 
//https://moodle-1819.ucl.ac.uk/mod/folder/view.php?id=1025065
//accessed 1st March 2019
function startQuestionUpload() {
	//if the question is invaild, break and stop uploading process
	completeform:{
		//some parameters for storing the data
		var question_title = document.getElementById("question_title").value;
		var question_text = document.getElementById("question_text").value;

		var answer_1 = document.getElementById("answer_1").value;
		var answer_2 = document.getElementById("answer_2").value;
		var answer_3 = document.getElementById("answer_3").value;
		var answer_4 = document.getElementById("answer_4").value;
		var correct_answer = document.getElementById("correct_answer").value;

		var latitude = document.getElementById("latitude").value;
		var longitude = document.getElementById("longitude").value;
	
		//all the required fields cannot be empty
		if (question_title){
		}
		else{			
			alert("Please type in the question title!");
			break completeform;
		}
		if (question_text){
		}
		else{		
			alert("Please type in the question text!");
			break completeform;
		}
		if (answer_1){
		}
		else{
			alert("Please type in the answer_1!");
			break completeform;
		}
		if (answer_2){
		}
		else{
			alert("Please type in the answer_2!");
			break completeform;
		}
		if (answer_3){
		}
		else{
			alert("Please type in the answer_3!");
			break completeform;
		}
		if (answer_4){
		}
		else{
			alert("Please type in the answer_4!");
			break completeform;
		}

		//need to type in a number between 1-4 for the correct answer field
		if(correct_answer==1||correct_answer==2||correct_answer==3||correct_answer==4){
		}
		else{
			alert("Please enter the vaild correct answer!");
			break completeform;
		}
		//users have to enter vaild latlng
		if ((latitude>=-90&&latitude<=90)&&(longitude>=-180&&longitude<=180)){
		}
		else{
			alert("Please enter the vaild latitude and longitude or click on the map to get the latlng!");
			break completeform;
		}

		//RegExp to find if there is any character NOT between -180 and 180)
		var regDec=/^(-?\d+\.)?-?\d+$/;

		if(regDec.test(latitude)&&regDec.test(longitude)){
		}
		else{
			alert("Please enter the vaild latitude and longitude or click on the map to get the latlng!");
			break completeform;
		}
		//a string holding the context which are waiting to be posted
		var postString = "question_title="+ question_title +"&question_text="+question_text+"&answer_1="+answer_1
		+"&answer_2="+answer_2+"&answer_3="+answer_3+"&answer_4="+answer_4+"&correct_answer="+correct_answer+"&latitude="+ latitude+"&longitude="+longitude;
		processQuestion(postString);
	}
}


function processQuestion(postString) {
	questionclient = new XMLHttpRequest();
	postString = postString + "&port_id=" + httpPortNumber;
	var url = 'http://developer.cege.ucl.ac.uk:'+ httpPortNumber + "/uploadQuestion";
	questionclient.open('POST',url,true);
	questionclient.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	questionclient.onreadystatechange = questionUploaded;
	questionclient.send(postString);
}

// create the code to wait for the response from the data server, 
//and process the response once it is received
function questionUploaded() {
	// this function listens out for the server to say that the data is ready - i.e. has state 4
	if (questionclient.readyState == 4) {
		// change the DIV to show the response
		document.getElementById("dataUploadResult").innerHTML = questionclient.responseText;
	}
}