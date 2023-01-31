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
 

//marker testing
var marker = L.marker([32.067627,34.764091]).addTo(map)
const ele =670


//create plane array
const plane_ar = []
for (var i in geotrack){
    plane_ar.push({'lat': geotrack[i].properties.lon, 'lng': geotrack[i].properties.lat, 'ele': geotrack[i].properties.ele})   
}
//create a line fomr the array
var planeline = L.polyline(plane_ar,{color:'red'}).addTo(map)
console.log(plane_ar)

var shadow_ar = [] //create empty array for shadows



//just shaodw marker to be set.latlon later
var shadow_marker = L.marker([32.07,34.78]).addTo(map)

var date = new Date() //takes curent date

//chnages the date with the slider
document.getElementById('slider').addEventListener('input', function (){
    var value = this.value
    
    date.setHours(this.value)
    // the slider supplies 0-23 number and this corresoponds to a hour of the day that is re set
});

//chnages the value diaplay under the slider
slider.oninput = function() {
    output.innerHTML = this.value;} 


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


console.log(plane_ar[3].ele)

var shadowline = L.polyline(shadow_ar,{color:'black'}).addTo(map)

//when the slider changes:
document.getElementById('slider').addEventListener('input', function (){
var sunpos= SunCalc.getPosition(date,32.07,34.78)

var sunazi =  ((sunpos.azimuth * (180.0/Math.PI))) //0 is south so 180 needs to be added- took me hours to get this
var sunalt =  (sunpos.altitude * 180.0/Math.PI)

var shadowlen = (ele / Math.tan(sunpos.altitude))

//var startpoint = new LatLon(32.07,34.78)
var endpoint = new LatLon(32.067627,34.764091).destinationPoint(shadowlen,(sunazi+360))


shadowcalc(plane_ar,shadow_ar)

console.log(shadow_ar[0])
//console.log(shadow_ar)






shadow_marker.setLatLng([endpoint._lat, endpoint._lon])
var shadowline = L.polyline(shadow_ar,{color:'black'})
shadowline.remove(map);
shadowline.addTo(map)
console.log(plane_ar)


const para = document.getElementById("info")
    para.textContent = `Time: ${date}, alt: ${sunalt}, azi: ${sunazi+180}, shadow len: ${shadowlen}`




});

