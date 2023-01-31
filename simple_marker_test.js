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
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value
 
var marker = L.marker([32.07,34.78]).addTo(map)
const ele =500

var shadow_test = new LatLon(32.07,34.78).destinationPoint(1500,300);
var shadowtestmarker = L.marker([shadow_test._lat,shadow_test._lon]).addTo(map);
console.log(shadow_test._lat,shadow_test._lon)





var shadow_marker = L.marker([32.07,34.78]).addTo(map)

var date = new Date()
console.log(shadow_marker)
//chnages the date with the slider
document.getElementById('slider').addEventListener('input', function (){
    var value = this.value
    
    date.setHours(this.value)


});
slider.oninput = function() {
    output.innerHTML = this.value;
  } 

document.getElementById('slider').addEventListener('input', function (){
var sunpos= SunCalc.getPosition(date,32.07,34.78)

var sunazi =  ((sunpos.azimuth * (180.0/Math.PI))) //0 is south so 180 needs to be added- took me hours to get this
var sunalt =  (sunpos.altitude * 180.0/Math.PI)

var shadowlen = (ele / Math.tan(sunpos.altitude))

//var startpoint = new LatLon(32.07,34.78)
var endpoint = new LatLon(32.07,34.78).destinationPoint(shadowlen,(sunazi+360))




shadow_marker.setLatLng([endpoint._lat, endpoint._lon])
console.log(date)
//var line = L.polyline([32.07,34.78],[shadow_pos._lon,shadow_pos._lat],{color:'black'}).addTo(map)



const para = document.getElementById("info")
    para.textContent = `Time: ${date}, alt: ${sunalt}, azi: ${sunazi+180}, shadow len: ${shadowlen}`




});
