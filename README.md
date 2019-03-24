# location-based quiz App

This is a **location-based quiz App**. It consists of a quizApp using PhoneGap and Material Design works on Android phones,  a questionApp using Material Design runs in a browser, and a NodeJS server that saves questions through questionApp and loads these questions onto quizApp, then insert the user' submission to the database.


## Requirements

The **system requirements** that the developer used show in the following list:

- Software:
-PhoneGap Developer 1.8.4 APK 
>We build cross-platform _apps_ using HTML, CSS and Javascript with this App.

-Bitvise SSH Client 8.29 
>We use this SSH Server to provide remote access to the UCL server.

- Browser:
-Google Chrome 73
-Firefox Quantum 65.0.2
-Internet Explorer 11
>We use these browsers to run the questionApp
- Hardware
-Motorola Moto G 3rd 
>We use this phone to install PhoneGap and test quizApp.


## Deployment

Please follow the notes below to deploy this App. There are slightly different between the questionApp and quizApp deployment, as due to the github submodule issues, the quizApp works without submodules but questionApp uses submodules.
***NB***The questionApp and quizApp should be deploy and test separately.

### Server
We need to download the HTTP server and copy it onto the specific directory. Then, before running the test, we are supposed to start the server first.

1. Download [httpServer.js](https://github.com/ucl-geospatial/uczlm97_server/blob/master/httpServer.js)
2. Copy httpServer.js to /code directory (the Ubuntu Server )
3. Start httpServer
```
pm2 start httpServer.js
```
###  questionApp
This App uses github submodules. Therefor, the deloyment process is as follows:
1. Check the directory
```
pwd
/home/studentuser/code
```
2.  Connect to the questionApp repository
```
git clone https://github.com/ucl-geospatial/uczlm97_questions.git --recurse-submodules
```
3. Enter the github username and password
4. Change the working directory
```
cd uczlm97_questions/uczlm97/www
```

###  quizApp

Due to the github submodule issues, this quizApp works without submodules. Its deployment steps are:
1. Check the directory
```
pwd
/home/studentuser/code
```
2.  Connect to the questionApp repository
```
git clone https://github.com/ucl-geospatial/uczlm97_quiz.git
```
3. Enter the github username and password
4. Change the working directory
```
cd uczlm97_quiz/uczlm97/www
```

## Tests
After the deployment, you can test the App now.
***NB***The questionApp and quizApp should be deploy and test separately.


###  questionApp
- Start the PhoneGap App Server
> ```
>phonegap serve
>```
- Go to [http://developer.cege.ucl.ac.uk:31289/](http://developer.cege.ucl.ac.uk:31289/) in your browser

- Click a point on the map and fill in the question form, then submit
In the App homepage, we can click on a point on the Leaflet map. The function will help us fill in the latitude and longitude automatically (you can also type in them manually). After finishing the table, we should press the "submit" button to upload the data. 
>Simple question example:
>title: Calculation
>text: 1 + 1 =
>answer_1: 1
>answer_2: 2
>answer_3: 3
>answer_4: 4
>correct answer: 2
>Laititude:0
>Longitude:0

> We can also check the submission at [here](http://developer.cege.ucl.ac.uk:30289/getQuizPoints/30289).
>This URL is based on HTTP port number 30289.
- Switch on / off the question Layer
On the right-hand side, there is a navigation bar. You can load the question point layer through the toggle switch button.
- Click on "Participation Rates"
-my daily rates
-all users data
- Click on "Last Week Questions"
A new map layer showing  map layer showing all the questions added in the last week.
- Click on "Most difficult Questions"
You can see the list of  the 5 most difficult questions.
- Stop PhoneGap server and remove the quizApp code
- Press Ctrl + C to stop the server.
- Go back to /code directory
- Remove the code
>```
>pwd 
>/home/studentuser/code
>rm -Rf uczlm97_questions
>```

###  quizApp
- Start the PhoneGap App Server
```
phonegap serve
```
- Enter the server address
Next, we can start the PhoneGap App and wait for the closet popup quiz. 
>Address example:
>[http://developer.cege.ucl.ac.uk:31289/](http://developer.cege.ucl.ac.uk:31289/).

- Press "Submit Answer"
Getting the popup, we are supposed to submit an answer. 
Meanwhile, we will get the feedback and our scorering records (excluding this latest answer result.)
After that, the colour of marker will change to green or red depending on the submitted answer is correct or wrong.
- Press the icon in the upper right corner and then "Rank"
We will get the user's ranking.
- Press About or HELP to get some help information

- Press the icon in the upper leftcorner 
We can see that our port number is showing on the navigation bar.

- Press "Top 5 Scorers"
We will get top 5 scorer graph in the quiz.
- Press "Last 5 Questions"
We will get last 5 questions that the user answered.
- Stop PhoneGap server and remove the questionApp code
- Press Ctrl + C to stop the server.
- Go back to /code directory
- Remove the code
>```
>cd
>cd code
>pwd
>/home/studentuser/code
>rm -Rf uczlm97_quiz
>```


## Files
This App mainly has three repositories **[uczlm97_quiz](https://github.com/ucl-geospatial/uczlm97_quiz)**, **[uczlm97_questions](https://github.com/ucl-geospatial/uczlm97_questions)** and **[uczlm97_server](https://github.com/ucl-geospatial/uczlm97_server)**. The submodules are **[uczlm97_jsReference](https://github.com/GEOGMLIU/uczlm97_jsReference)**, **[uczlm97_cssReference](https://github.com/GEOGMLIU/uczlm97_cssReference)** and **[uczlm97_imagesReference](https://github.com/GEOGMLIU/uczlm97_imagesReference)**.



.
file                           |function                     |
--- | --- | --- |
uczlm97_server  |`httpServer.js`            |an HTTP sevrer serves data to the quizApp and questionApp|
uczlm97_questions|`createQuestionForm.html`            |a html file contains a question form|
uczlm97_questions|`questionAppHelp.html`            |a help document for questionApp |
uczlm97_questions|`index.html`            |the default ‘index.html’ page that is created for any new PhoneGapApp and is adapted for running custom functions|
uczlm97_questions|`leafletFunction.js`            |the code to get latitude and longitude by a user clicking and fix the number to show 6 decimal places|
uczlm97_questions|`questionsLoad.js`            |the code to load GEOJSON data(quiz point layer)|
uczlm97_questions|`uploadQuestion.js`            |the code is used to check if the submitted question is vaild or not and insert new questions into database|
uczlm97_quiz     |`index.html`|the default ‘index.html’ page that is created for any new PhoneGapApp and is adapted for running custom functions|
uczlm97_quiz     |`quizAppHelp.html`|a help document for quizApp|
uczlm97_quiz     |`quizLoad.js`|the code to load the quiz point layer and show the quiz as a popup|
uczlm97_quiz     |`uploadAnswer.js`|the code to upload answers and check answers are right or wrong|
uczlm97_quiz     |`userTracking.js`|code to track user location and pop up the closest quiz point|
uczlm97_questions&uczlm97_quiz     |`leaflet.awesome-markers.js`|Javascript required for the Leaflet Map|
uczlm97_questions&uczlm97_quiz     |`leaflet.js`|Javascript required for the Leaflet Map|
uczlm97_questions&uczlm97_quiz     |`startup.js`|startup functions contain sepcific code that we want to run when the page is loaded|
uczlm97_questions&uczlm97_quiz     |`utilities.js`|function to get the httpPortNumber and httpsPortNumber|

## Acknowledgments
The **third party code** that have been referenced shows as follows.
>Most of them are from [CEGE0043](https://moodle-1819.ucl.ac.uk/course/view.php?id=1330&section=0). 
-  [HELP documents - format style](https://webdesign.tutsplus.com/articles/)
-  [ Servers and AJAX](https://moodle-1819.ucl.ac.uk/mod/folder/view.php?id=1025047)
- [Port Detection ](https://moodle-1819.ucl.ac.uk/course/view.php?id=1330&section=7)
- [PhoneGap Project on Ubuntu](https://moodle-1819.ucl.ac.uk/course/view.php?id=1330&section=6)
- [Material Design](https://getmdl.io/templates/dashboard/index.html)
- [Leaflet Function](https://moodle-1819.ucl.ac.uk/course/view.php?id=1330&section=5)
- [ D3 – Data Driven Documents](https://moodle-1819.ucl.ac.uk/course/view.php?id=1330&section=9)