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
const ele =670


//create plane array
const plane_ar = []
for (var i in geotrack){
    plane_ar.push({'lat': geotrack[i].properties.lon, 'lng': geotrack[i].properties.lat, 'ele': geotrack[i].properties.ele})   
}
var active_polyline = L.featureGroup().addTo(map)

//red plane line
var planeline = L.polyline(plane_ar,{color:'red'}).addTo(map)

console.log('first plane_ar', plane_ar)





var shadow_ar = [] //create empty array for shadows;



var date = new Date() //takes curent date

//var sunpos= SunCalc.getPosition(date,plane_ar[1].lat,plane_ar[1].lng)
//var sunalt =  (sunpos.altitude * 180.0/Math.PI)

//console.log(sunalt)


//chnages the date with the slider
document.getElementById('slider').addEventListener('input', function (){
    
    var hours = Math.floor(slider.value / 60)
    var minutes = slider.value % 60
    
    var value = this.value
    
    date.setHours(hours,minutes)
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

var times = SunCalc.getTimes((date),32.07,34.78)
console.log(times)
console.log(SunCalc.getPosition(times.sunriseEnd,32.07,34.78))


/*ark function
function create_ark(array){
    var times = SunCalc.getTimes(date,32.07,34.78)
    var highpos= SunCalc.getPosition(times.sunrise,32.07,34.78)
    var midpos= SunCalc.getPosition(times.solarNoon,32.07,34.78)
    var lowpos= SunCalc.getPosition(times.sunset,32.07,34.78)

    console.log(array[20].lat,array[20].lng)
    function alterpos(sunpos){
        sunpos.altitude = (sunpos.altitude * 180.0/Math.PI);
        sunpos.azimuth = ((sunpos.azimuth * (180.0/Math.PI)))//need 180?
    }
alterpos(highpos)
alterpos(midpos)
alterpos(lowpos)

        function shadow_cords(array,sunpos){
            
        var shadowlen = (array[20].ele / Math.tan(sunpos.altitude))
        var endpoint = new LatLon(array[20].lat,array[20].lng).destinationPoint(shadowlen,(sunpos.azimuth))
        
        return [endpoint._lat, endpoint.lon]



}
    
var ark_array = [(shadow_cords(plane_ar,highpos)),(shadow_cords(plane_ar,midpos)),(shadow_cords(plane_ar,lowpos))]
console.log('ark array',ark_array)

L.polyline(ark_array,{color:'blue'}).addTo(map)
    


}

create_ark(plane_ar)
*/


var  new_ar = []
var  cresent = []
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

if (sunalt > 0){
shadowline.addTo(active_polyline)
};



cresent.push({'lat': plane_ar[20].lat, 'lng':plane_ar[20].lng})

//console.log('creshen:',cresent)
L.polyline(cresent,{color:'blue'}).addTo(map)



var testmark1 = L.marker([plane_ar[20].lat,plane_ar[20].lng]).addTo(map)

var testmark2 = L.marker([new_ar[20].lat,new_ar[20].lng]).addTo(map)

var testmark3 = L.marker([new_ar[14].lat,new_ar[14].lng])

console.log("shadowclalc testing:")
//console.log(new_ar)

//update the top info row

    
    document.getElementById('date').textContent= date
    document.getElementById('sunpos').textContent= `alt: ${sunalt}, azi: ${sunazi+180}, shadow len: ${shadowlen}`
    
   
});

//now button resets date (doesnt work)
document.getElementById('nowbutton').onclick =function(date){
    date = Date()
    console.log("now pressed",date)
    document.getElementById('date').textContent= date

    
}