//global variable for storing the user current location Marker
var userMarker;
//global variables so that can use the user current location in the other function
var userlat;
var userlng;

//the method for tracking user location
//code adapted from here: 
//https://moodle-1819.ucl.ac.uk/course/view.php?id=1330&section=5
//accessed 16th Jan 2019
function trackLocation() 
{
	//alert("user tracking!");
	if (navigator.geolocation) {
		navigator.geolocation.watchPosition(showPosition);
	} 
	else {
		//document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
		alert("Geolocation is not supported by this browser.");
	}
}

//show the current location and
//call the function so that the closest quiz can popup automatically
//code adapted from here: 
//https://moodle-1819.ucl.ac.uk/course/view.php?id=1330&section=5
//accessed 16th Jan 2019
function showPosition(position) 
{
	if (userMarker)
	{
		//the refresh rate depends on moving distance
		//avoiding updating too frequent
		if(calculateDistance(userlat,userlng,position.coords.latitude, position.coords.longitude,  'K')>=0.01){
			mymap.removeLayer(userMarker);
			userlat = position.coords.latitude;
			userlng = position.coords.longitude;
			closestFormPoint();
		}
	}
	//the marker will not update
	//unless the user move 10 meters away from the last spot
	else{
		userMarker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap).bindPopup("<b>You were here at: </b>" + position.coords.latitude + ',' + position.coords.longitude);
		userlat = position.coords.latitude;
		userlng = position.coords.longitude;
		closestFormPoint();
	}
}

//code adapted from
//https://moodle-1819.ucl.ac.uk/mod/folder/view.php?id=1025047
//accessed 20th March 2019
function closestFormPoint() {  
	// take the leaflet formdata layer  
	// go through each point one by one  
	// and measure the distance to Warren Street  
	// for the closest point show the pop up of that point  
	var minDistance = 100000000000;  
	var closestFormPoint = 0; 
	QuizPointLayer.eachLayer(function(layer) 
	{   
		alert(userlat,userlng);
		var distance = calculateDistance(userlat, 
			userlng,layer.getLatLng().lat, layer.getLatLng().lng,  'K');
		//alert(distance);
		if (distance < minDistance){    
			minDistance = distance;    
			closestFormPoint = layer.feature.properties.id; 
			//alert(closestFormPoint);
		} 
		
	});  
 	// for this to be a proximity alert, the minDistance must be   
 	// closer than a given distance - you can check that here  
 	// using an if statement 

	// show the popup for the closest point  
	QuizPointLayer.eachLayer(function(layer) {   
		//alert(layer.feature.properties.id);
		if (layer.feature.properties.id == closestFormPoint){    
			//alert("hey3");
			layer.openPopup();   
		}  
	}); 
	
} 

//calculate distance between two points
// code adapted from 
//https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-inyour-web-apps.html
function calculateDistance(lat1, lon1, lat2, lon2, unit) 
{
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	subAngle = Math.acos(subAngle);
	subAngle = subAngle * 180/Math.PI; // convert the degree value returned by acos back to degrees from radians
	dist = (subAngle/360) * 2 * Math.PI * 3956; // ((subtended angle in degrees)/360) * 2 * pi * radius )
	// where radius of the earth is 3956 miles
	if (unit=="K") { dist = dist * 1.609344 ;} // convert miles to km
	if (unit=="N") { dist = dist * 0.8684 ;} // convert miles to nautical miles
	return dist;
}


/*
function getDistance() 
{
	//alert('getting distance');
	// getDistanceFromPoint is the function called once the distance has been found
	navigator.geolocation.getCurrentPosition(getDistanceFromMultiplePoints);
}

function getDistance2()
{
	navigator.geolocation.getCurrentPosition(getDistanceFromPoint);
	alert("Calculating Distance...");
}

function getDistanceFromPoint(position) 
{
	alert("Calculating Distance2...");
	// find the coordinates of a point using this website:
	// these are the coordinates for cruciform hub
	var lat = 51.524616;
	var lng =  -0.13818;
	// return the distance in kilometers
	var distance = calculateDistance(position.coords.latitude, position.coords.longitude, lat,lng, 'K');
	alert("Calculating Distance3...");
	alert("Distance:" + distance);
	document.getElementById('showDistance').innerHTML = "Distance: " + distance;
	
	//alert("You're " + distance + "km away from UCL fixed point")
	/*if (distance < 0.1) {
		alert("You're within 100 meter of UCL.");
	}
	else{
		alert("hey! /n You're out of controlled now! :)");
	}
}


function getDistanceFromMultiplePoints(position)
{
	var minDist = 100000000000;
	var closetQuake="";
	for (var i = 0; i < earthquakes.features.length; i++) {
		var obj = earthquakes.features[i];
		var distance = calculateDistance(position.coords.latitude,position.coords.longitude,
			obj.geometry.coordinates[0], obj.geometry.coordinates[1], 'K');
		if (distance < minDist) {
			minDist = distance;
			closetQuake=obj.properties.place;
		}
	}
	alert("Earthquake: " + closetQuake + " is distance " + minDist + "away");
}
*/