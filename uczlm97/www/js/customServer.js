// express is the server that forms part of the nodejs program
var express = require('express');
var app = express();

var http = require('http');
var fs = require('fs');
var httpServer = http.createServer(app);
var configtext = ""+fs.readFileSync("/home/studentuser/certs/postGISConnection.js");

// now convert the configruation file into the correct format -i.e. a name/value pair array
var configarray = configtext.split(",");
var config = {};
for (var i = 0; i < configarray.length; i++) {
  var split = configarray[i].split(':');
  config[split[0].trim()] = split[1].trim();
}


console.log(config);

var pg = require('pg');
var pool = new pg.Pool(config)

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


httpServer.listen(4480);

// adding functionality to allow cross-domain queries when PhoneGap is running a server
app.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	next();
});

app.post('/reflectData',function(req,res){
  // note that we are using POST here as we are uploading data
  // so the parameters form part of the BODY of the request rather than the RESTful API
  console.dir(req.body);

  // for now, just echo the request back to the client
  res.send(req.body);
});


app.post('/uploadQuestion',function(req,res){
	// note that we are using POST here as we are uploading data
	// so the parameters form part of the BODY of the request rather than the RESTful API
	console.dir(req.body);

  pool.connect(function(err,client,done) {
    if(err){
     console.log("not able to get connection "+ err);
     res.status(400).send(err);
   }
      // pull the geometry component together
      // note that well known text requires the points as longitude/latitude !
      // well known text should look like: 'POINT(-71.064544 42.28787)'
      var param1 = req.body.question_title;
      var param2 = req.body.question_text;
      var param3 = req.body.answer_1;
      var param4 = req.body.answer_2;
      var param5 = req.body.answer_3;
      var param6 = req.body.answer_4;
      var param7 = req.body.port_id;
      var param8 =req.body.correct_answer ; 

      var geometrystring = "st_geomfromtext('POINT("+req.body.longitude+ " "+req.body.latitude +")',4326)";
      var querystring = "INSERT into public.quizquestion (question_title,question_text,answer_1,answer_2, answer_3, answer_4,port_id,correct_answer,location) values ";
      querystring += "($1,$2,$3,$4,$5,$6,$7,$8,";
      querystring += geometrystring + ")";
      console.log(querystring);
      client.query( querystring,[param1,param2,param3,param4,param5,param6,param7,param8],function(err,result) {
        done();
        if(err){
         console.log(err);
         res.status(400).send(err);
       }
       else {
        res.status(200).send("Question "+ req.body.question_text+ " has been inserted");
      }
    });
    });
});


app.post('/uploadAnswer',function(req,res){
  // note that we are using POST here as we are uploading data
  // so the parameters form part of the BODY of the request rather than the RESTful API
  console.dir(req.body);

  pool.connect(function(err,client,done) {
    if(err){
      console.log("not able to get connection "+ err);
      res.status(400).send(err);
    }

    var param1 =  req.body.port_id ;
    var param2 =  req.body.question_id ;
    var param3 =  req.body.answer_selected;
    var param4 =  req.body.correct_answer ;


    var querystring = "INSERT into public.quizanswers (port_id, question_id, answer_selected, correct_answer) values (";
    querystring += "$1,$2,$3,$4)";
    console.log(querystring);
    client.query(querystring,[param1,param2,param3,param4],function(err,result) {
      done();
      if(err){
       console.log(err);
       res.status(400).send(err);
     }
     console(req.body.port_id);
     res.status(200).send("Answer inserted for user "+req.body.port_id);
   });
  });
});

app.get('/getQuizPoints/:port_id', function (req,res) {
 pool.connect(function(err,client,done) {
  if(err){
    console.log("not able to get connection "+ err);
    res.status(400).send(err);
  }
  var colnames = "id, question_title, question_text, answer_1,";
  colnames = colnames + "answer_2, answer_3, answer_4, port_id, correct_answer";
  console.log("colnames are " + colnames);

          // now use the inbuilt geoJSON functionality
          // and create the required geoJSON format using a query adapted from here:
          // http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
          // note that query needs to be a single string with no line breaks so built it up bit by bit
          var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
          querystring += "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, ";
          querystring += "row_to_json((SELECT l FROM (SELECT "+colnames + " ) As l      )) As properties";
          querystring += "   FROM public.quizquestion As lg ";
          querystring += " where port_id = $1 limit 100  ) As f ";
          console.log(querystring);
          var port_id = req.params.port_id; //
          // run the second query
          client.query(querystring,[port_id],function(err,result){
            //call `done()` to release the client back to the pool
            done();
            if(err){
              console.log(err);
              res.status(400).send(err);
            }
            res.status(200).send(result.rows);
          });
        });

});

// user is told how many questions they have answered correctly 
//when they answer a question (xxxx is the port_id of the particular person)
app.get('/getCorrectAnsNum/:port_id', function (req,res) {
 pool.connect(function(err,client,done) {
  if(err){
    console.log("not able to get connection "+ err);
    res.status(400).send(err);
  }
  var colnames = "id, question_id, answer_selected, correct_answer,";
  colnames = colnames + "port_id";
  console.log("colnames are " + colnames);
  var querystring = "select array_to_json (array_agg(c)) from (SELECT COUNT(*) AS num_questions from public.quizanswers where (answer_selected = correct_answer) and port_id = $1) c ";
          // now use the inbuilt geoJSON functionality
          // and create the required geoJSON format using a query adapted from here:
          // http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
          // note that query needs to be a single string with no line breaks so built it up bit by bit


          console.log(querystring);
          var port_id = req.params.port_id; //
          // run the second query
          client.query(querystring,[port_id],function(err,result){
            //call `done()` to release the client back to the pool
            done();
            if(err){
              console.log(err);
              res.status(400).send(err);
            }
            res.status(200).send(result.rows);
          });
        });

});

//user is given their ranking (in comparison to all other users)
app.get('/getRanking/:port_id', function (req,res) {
 pool.connect(function(err,client,done) {
  if(err){
    console.log("not able to get connection "+ err);
    res.status(400).send(err);
  }
  var colnames = "id, question_id, answer_selected, correct_answer,";
  colnames = colnames + "port_id";
  console.log("colnames are " + colnames);
  var querystring = "select array_to_json (array_agg(hh)) from (select c.rank from (SELECT b.port_id, rank()over (order by num_questions desc) as rank from (select COUNT(*) AS num_questions, port_id from public.quizanswers where answer_selected = correct_answer group by port_id) b) c where c.port_id = $1) hh";
          /*
          var querystring ="select array_to_json (array_agg(hh)) from ";
          querystring=querystring+"(select c.rank from (SELECT b.port_id, rank()over (order by num_questions desc) as rank ";
          querystring=querystring+"from (select COUNT(*) AS num_questions, port_id ";
          querystring=querystring+"from public.quizanswers where answer_selected = correct_answer";
          querystring=querystring+"group by port_id) b) c ";
          querystring=querystring+"where c.port_id = $1) hh";
          */


          // now use the inbuilt geoJSON functionality
          // and create the required geoJSON format using a query adapted from here:
          // http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
          // note that query needs to be a single string with no line breaks so built it up bit by bit


          console.log(querystring);
          var port_id = req.params.port_id; //
          // run the second query
          client.query(querystring,[port_id],function(err,result){
            //call `done()` to release the client back to the pool
            done();
            if(err){
              console.log(err);
              res.status(400).send(err);
            }
            res.status(200).send(result.rows);
          });
        });

});

//graph showing top 5 scorers in the quiz
app.get('/getTopScorers/:port_id', function (req,res) {
 pool.connect(function(err,client,done) {
  if(err){
    console.log("not able to get connection "+ err);
    res.status(400).send(err);
  }
  var colnames = "id, question_id, answer_selected, correct_answer,";
  colnames = colnames + "port_id";
  console.log("colnames are " + colnames);
        // var querystring = "select array_to_json (array_agg(c)) from (select rank() over (order by num_questions desc) as rank , port_id from (select COUNT(*) AS num_questions, port_id from public.quizanswers where answer_selected = correct_answer group by port_id) b limit 5) c";

        var querystring = "select array_to_json (array_agg(c)) from "
        querystring=querystring+"(select rank() over (order by num_questions desc) as rank , port_id ";
        querystring=querystring+"from (select COUNT(*) AS num_questions, port_id ";
        querystring=querystring+"from public.quizanswers ";
        querystring=querystring+"where answer_selected = correct_answer ";
        querystring=querystring+"group by port_id) b limit 5) c;";

          // now use the inbuilt geoJSON functionality
          // and create the required geoJSON format using a query adapted from here:
          // http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
          // note that query needs to be a single string with no line breaks so built it up bit by bit


          console.log(querystring);
          var port_id = req.params.port_id; //
          // run the second query
          //client.query(querystring,[port_id],function(err,result){
          client.query(querystring,function(err,result){
            //call `done()` to release the client back to the pool
            done();
            if(err){
              console.log(err);
              res.status(400).send(err);
            }
            res.status(200).send(result.rows);
          });
        });

});

//graph showing daily participation rates for the past week 
//(how many questions have been answered, and how many answers were correct)
app.get('/getMyDailyRates/:port_id', function (req,res) {
 pool.connect(function(err,client,done) {
  if(err){
    console.log("not able to get connection "+ err);
    res.status(400).send(err);
  }
  var colnames = "id, question_id, answer_selected, correct_answer,";
  colnames = colnames + "port_id";
  console.log("colnames are " + colnames);

  var querystring = "select array_to_json (array_agg(c)) ";
  querystring=querystring+"from ";
  querystring=querystring+"(select * from public.participation_rates where port_id = $1) c ";


          // now use the inbuilt geoJSON functionality
          // and create the required geoJSON format using a query adapted from here:
          // http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
          // note that query needs to be a single string with no line breaks so built it up bit by bit


          console.log(querystring);
          var port_id = req.params.port_id; //
          // run the second query
          client.query(querystring,[port_id],function(err,result){
            //call `done()` to release the client back to the pool
            done();
            if(err){
              console.log(err);
              res.status(400).send(err);
            }
            res.status(200).send(result.rows);
          });
        });

});

app.get('/getAllRates/:port_id', function (req,res) {
 pool.connect(function(err,client,done) {
  if(err){
    console.log("not able to get connection "+ err);
    res.status(400).send(err);
  }
  var colnames = "id, question_id, answer_selected, correct_answer,";
  colnames = colnames + "port_id";
  console.log("colnames are " + colnames);

  var querystring = "select  array_to_json (array_agg(c)) from ";
  querystring=querystring+"(select day, sum(questions_answered) as questions_answered, sum(questions_correct) as questions_correct ";
  querystring=querystring+"from public.participation_rates ";
  querystring=querystring+"group by day) c ";

          // now use the inbuilt geoJSON functionality
          // and create the required geoJSON format using a query adapted from here:
          // http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
          // note that query needs to be a single string with no line breaks so built it up bit by bit


          console.log(querystring);
          //var port_id = req.params.port_id; //
          // run the second query
          client.query(querystring,function(err,result){
            //call `done()` to release the client back to the pool
            done();
            if(err){
              console.log(err);
              res.status(400).send(err);
            }
            res.status(200).send(result.rows);
          });
        });

});

//map layer showing all the questions added in the last week (by any user).
app.get('/getLatestQuestions/:port_id', function (req,res) {
 pool.connect(function(err,client,done) {
  if(err){
    console.log("not able to get connection "+ err);
    res.status(400).send(err);
  }
  var colnames = "id, question_id, answer_selected, correct_answer,";
  colnames = colnames + "port_id";
  console.log("colnames are " + colnames);

  var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
  querystring=querystring+"(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, ";
  querystring=querystring+"row_to_json((SELECT l FROM (SELECT id, question_title, question_text, answer_1, answer_2, answer_3, answer_4, port_id, correct_answer) As l ";
  querystring=querystring+" )) As properties";
  querystring=querystring+" FROM public.quizquestion  As lg limit 100  ) As f";
          // now use the inbuilt geoJSON functionality
          // and create the required geoJSON format using a query adapted from here:
          // http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
          // note that query needs to be a single string with no line breaks so built it up bit by bit


          console.log(querystring);
         // var port_id = req.params.port_id; //
          // run the second query
          client.query(querystring,function(err,result){
            //call `done()` to release the client back to the pool
            done();
            if(err){
              console.log(err);
              res.status(400).send(err);
            }
            res.status(200).send(result.rows);
          });
        });

});

//Questions App: list of the 5 most difficult questions (via a menu option) 
//– i.e. where most wrong answers were given
app.get('/getMostDiff/:port_id', function (req,res) {
 pool.connect(function(err,client,done) {
  if(err){
    console.log("not able to get connection "+ err);
    res.status(400).send(err);
  }
  var colnames = "id, question_id, answer_selected, correct_answer,";
  colnames = colnames + "port_id";
  console.log("colnames are " + colnames);

  var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
  querystring=querystring+"(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, ";
  querystring=querystring+"row_to_json((SELECT l FROM (SELECT id, question_title, question_text, answer_1, answer_2, answer_3, answer_4, port_id, correct_answer) As l ";
  querystring=querystring+" )) As properties";
  querystring=querystring+" FROM public.quizquestion  As lg limit 100  ) As f";
          // now use the inbuilt geoJSON functionality
          // and create the required geoJSON format using a query adapted from here:
          // http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
          // note that query needs to be a single string with no line breaks so built it up bit by bit


          console.log(querystring);
         // var port_id = req.params.port_id; //
          // run the second query
          client.query(querystring,function(err,result){
            //call `done()` to release the client back to the pool
            done();
            if(err){
              console.log(err);
              res.status(400).send(err);
            }
            res.status(200).send(result.rows);
          });
        });

});

//map showing the last 5 questions that the user answered (colour coded 
//depending on whether they were right/wrong the first time they answered the question)
app.get('/getLast5/:port_id', function (req,res) {
 pool.connect(function(err,client,done) {
  if(err){
    console.log("not able to get connection "+ err);
    res.status(400).send(err);
  }
  var colnames = "id, question_id, answer_selected, correct_answer,";
  colnames = colnames + "port_id";
  console.log("colnames are " + colnames);       
          var querystring ="SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
          querystring=querystring+"(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, ";
          querystring=querystring+"row_to_json((SELECT l FROM (SELECT id, question_title, question_text, answer_1, answer_2, answer_3, answer_4, port_id, correct_answer, answer_correct) As l ";
          querystring=querystring+")) As properties ";
          querystring=querystring+"FROM ";
          querystring=querystring+"(select a.*, b.answer_correct from public.quizquestion a inner join ";
          //querystring=querystring+"inner join ";
          querystring=querystring+"(select question_id, answer_selected=correct_answer as answer_correct ";
          querystring=querystring+"from public.quizanswers ";
          querystring=querystring+"where port_id = $1 ";
          querystring=querystring+"order by timestamp desc ";
          querystring=querystring+"limit 5) b ";
          querystring=querystring+"on a.id = b.question_id) as lg) As f ";
          


          // now use the inbuilt geoJSON functionality
          // and create the required geoJSON format using a query adapted from here:
          // http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
          // note that query needs to be a single string with no line breaks so built it up bit by bit


          console.log(querystring);
          var port_id = req.params.port_id; //
          // run the second query
          client.query(querystring,[port_id],function(err,result){
            //call `done()` to release the client back to the pool
            done();
            if(err){
              console.log(err);
              res.status(400).send(err);
            }
            res.status(200).send(result.rows);
          });
        });

});

//------------------------------lack of user location--------------------------------------------------------
app.get('/getClosestPoints/:port_id', function (req,res) {
 pool.connect(function(err,client,done) {
  if(err){
    console.log("not able to get connection "+ err);
    res.status(400).send(err);
  }
  var colnames = "id, question_id, answer_selected, correct_answer,";
  colnames = colnames + "port_id";
  console.log("colnames are " + colnames);

  var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
  querystring=querystring+"(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, ";
  querystring=querystring+"row_to_json((SELECT l FROM (SELECT id, question_title, question_text, answer_1, answer_2, answer_3, answer_4, port_id, correct_answer) As l ";
  querystring=querystring+" )) As properties";
  querystring=querystring+" FROM   (select c.* from public.quizquestion c";
  querystring=querystring+"inner join (select id, st_distance(a.location, st_geomfromtext('POINT(XXX, YYY)',4326)) as distance ";
  querystring=querystring+"from public.quizquestion a ";
  querystring=querystring+"order by distance asc ";
  querystring=querystring+"limit 5) b ";
  querystring=querystring+"on c.id = b.id ) as lg) As f ";
          // now use the inbuilt geoJSON functionality
          // and create the required geoJSON format using a query adapted from here:
          // http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
          // note that query needs to be a single string with no line breaks so built it up bit by bit


          console.log(querystring);
          var port_id = req.params.port_id; //
          // run the second query
          client.query(querystring,[port_id],function(err,result){
            //call `done()` to release the client back to the pool
            done();
            if(err){
              console.log(err);
              res.status(400).send(err);
            }
            res.status(200).send(result.rows);
          });
        });

});

app.get('/getClosestPoints/:port_id', function (req,res) {
 pool.connect(function(err,client,done) {
  if(err){
    console.log("not able to get connection "+ err);
    res.status(400).send(err);
  }
  var colnames = "id, question_id, answer_selected, correct_answer,";
  colnames = colnames + "port_id";
  console.log("colnames are " + colnames);

  var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
  querystring=querystring+"(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, ";
  querystring=querystring+"row_to_json((SELECT l FROM (SELECT id, question_title, question_text, answer_1, answer_2, answer_3, answer_4, port_id, correct_answer) As l ";
  querystring=querystring+" )) As properties";
  querystring=querystring+" FROM public.quizquestion  As lg limit 100  ) As f";
          // now use the inbuilt geoJSON functionality
          // and create the required geoJSON format using a query adapted from here:
          // http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
          // note that query needs to be a single string with no line breaks so built it up bit by bit


          console.log(querystring);
         // var port_id = req.params.port_id; //
          // run the second query
          client.query(querystring,function(err,result){
            //call `done()` to release the client back to the pool
            done();
            if(err){
              console.log(err);
              res.status(400).send(err);
            }
            res.status(200).send(result.rows);
          });
        });

});



app.get('/getGeoJSON/:tablename/:geomcolumn', function (req,res) {
 pool.connect(function(err,client,done) {
   if(err){
     console.log("not able to get connection "+ err);
     res.status(400).send(err);
   }

   var colnames = "";
   var param1 = req.params.tablename;
   var param2 = req.params.geomcolumn;
   console.log(req.params.tablename);
   console.log(req.params.geomcolumn);
        	// first get a list of the columns that are in the table
       	// use string_agg to generate a comma separated list that can then be pasted into the next query
       	var querystring = "select string_agg(colname,',') from ( select column_name as colname ";
       	querystring += " FROM information_schema.columns as colname ";
       	querystring += " where table_name   = $1";
       	querystring += " and column_name <> $2";
        querystring += " and data_type <> 'USER-DEFINED') as cols ";

        console.log(querystring);

        	// now run the query
        	client.query(querystring,[param1,param2],function(err,result){
          //call `done()` to release the client back to the pool
          done();
          if(err){
            console.log(err);
            res.status(400).send(err);
          }
          colnames = result.rows[0]['string_agg'];
          console.log("colnames are " + colnames);

          // now use the inbuilt geoJSON functionality
          // and create the required geoJSON format using a query adapted from here:
          // http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
          // note that query needs to be a single string with no line breaks so built it up bit by bit

          var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
          querystring += "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg." + req.params.geomcolumn+")::json As geometry, ";
          querystring += "row_to_json((SELECT l FROM (SELECT "+colnames + ") As l      )) As properties";
          querystring += "   FROM "+req.params.tablename+"  As lg limit 100  ) As f ";
          console.log(querystring);



          // run the second query
          client.query(querystring,function(err,result){
            //call `done()` to release the client back to the pool
            done();
            if(err){
              console.log(err);
              res.status(400).send(err);
            }
            res.status(200).send(result.rows);
          });

        });
        });
});


app.get('/', function (req, res) {
  // run some server-side code
  console.log('the http server has received a request');
  res.send('Hello World from the http server');
});


// finally - serve static files for requests that are not met by any of the
// code above
// serve static files - e.g. html, css
app.use(express.static(__dirname));
