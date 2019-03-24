//global variables for storing the location
var clickinglat;
var clickinglng;

//to the clicked latitude and longitude
//the functions adapted from here: 
//https://moodle-1819.ucl.ac.uk/course/view.php?id=1330&section=5
//accessed 16th Jan 2019
function popupClickLocation()
{
	// create a custom popup
	var popup = L.popup();
	// create an event detector to wait for the user's click event and then use the popup to show them where they clicked
	// note that you don't need to do any complicated maths to convert screen coordinates to real world coordiantes - the Leaflet API does this for you
	function onMapClick(e) {
		popup
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(mymap);
		clickinglat=e.latlng.lat;
		clickinglng=e.latlng.lng;
		changeLatlng();
	}
	// now add the click event detector to the map
	mymap.on('click', onMapClick);
	//

}

//automatically change latlng when the user clicked on map
function changeLatlng(){
	alert("Getting the latlng.");
	//enter latlng and format numbers to show 6 decimal places 
	document.getElementById("latitude").value=clickinglat.toFixed(6);
	document.getElementById("longitude").value=clickinglng.toFixed(6);
}

















