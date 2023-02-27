/*
This is the cleaned up version 1. it is based on v1_base. 
This is the first mile stone- the first working version.

Feb 2 2023, 11:03 pm

*/

import LatLon, { Dms } from 'https://cdn.jsdelivr.net/npm/geodesy@2/latlon-spherical.js';
import {geotrack} from './geo_track.js'

var map = L.map('map',{
    center: [32.03993,34.82497],
    zoom: 13
    });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//new slider
var slider = document.getElementById("slider");


 

//marker testing
const ele =670


//create plane array
const plane_ar = []
for (var i in geotrack){
    plane_ar.push({'lat': geotrack[i].properties.lon, 'lng': geotrack[i].properties.lat, 'ele': geotrack[i].properties.ele})   
}



var active_polyline = L.featureGroup().addTo(map)// creats feture group to be use later (most probly can be removed)
var planeline = L.polyline(plane_ar,{color:'red'}).addTo(map) //red plane line
var shadow_ar = [] //create empty array for shadows;
var date = new Date() //takes curent date




//chnages the date with the slider
document.getElementById('slider').addEventListener('input', function (){
    
    var hours = Math.floor(slider.value / 60)
    var minutes = slider.value % 60
    date.setHours(hours,minutes)
   
});


//function that takes a point and reterns its shadow point
function shadowcalc(start_array,end_array){
for (var i in start_array){

    var sunpos= SunCalc.getPosition(date,start_array[i].lat,start_array[i].lng)

    var sunazi =  ((sunpos.azimuth * (180.0/Math.PI))) //0 is south so 180 needs to be added- took me hours to get this
    var sunalt =  (sunpos.altitude * 180.0/Math.PI)

    var shadowlen = (start_array[i].ele / Math.tan(sunpos.altitude))

    var endpoint = new LatLon(start_array[i].lat,start_array[i].lng).destinationPoint(shadowlen,(sunazi))

    end_array.push({'lat': endpoint._lat, 'lng': endpoint._lon, 'shadowlen': shadowlen})
}
}







var  new_ar = []
//when the slider changes:
document.getElementById('slider').addEventListener('input', function (){
var sunpos= SunCalc.getPosition(date,32.07,34.78)

var sunazi =  ((sunpos.azimuth * (180.0/Math.PI))) //0 is south so 180 needs to be added- took me hours to get this
var sunalt =  (sunpos.altitude * 180.0/Math.PI)

var shadowlen = (ele / Math.tan(sunpos.altitude))
var new_ar = []
//var startpoint = new LatLon(32.07,34.78)
//var endpoint = new LatLon(32.067627,34.764091).destinationPoint(shadowlen,(sunazi+360))
//shadow_marker.setLatLng([endpoint._lat, endpoint._lon])
active_polyline.clearLayers();
shadowcalc(plane_ar,new_ar)
var shadowline = L.polyline(new_ar,{color:'black'})

//only draws line if sun altitude is postive ie- daytime
if (sunalt > 0){
shadowline.addTo(active_polyline)
};



//update the top info row


    document.getElementById('date').textContent= date
    document.getElementById('sunpos').textContent= ` alt: ${sunalt}, azi: ${sunazi+180}`
    
   
});

//now button resets date (doesnt work)
document.getElementById('nowbutton').onclick =function(date){
    date = Date()
    console.log("now pressed",date)
    document.getElementById('date').textContent= date

    
}