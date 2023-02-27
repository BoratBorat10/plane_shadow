import LatLon, { Nvector, Dms } from 'https://cdn.jsdelivr.net/npm/geodesy@2/latlon-nvector-spherical.js';
import * as track from './geo_track.js'
import * as airlab from './airlab.js';
import * as buffer from './objects/buffers.js';
import * as object from './objects/objects.js';



navigator.geolocation.getCurrentPosition(function(){console.log(GeolocationPosition)})
alert(GeolocationPosition)



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
for (var i in track.track12){
    plane_ar.push({'lat': track.track12[i].properties.lon, 'lng': track.track12[i].properties.lat, 'ele': track.track12[i].properties.ele})   
}

//create layers
var active_polyline = L.featureGroup().addTo(map)//create layer
var layerControl = L.control.layers(null, pointline).addTo(map);


// layer for the yellow connecting lines. Off by defult
var pointline = L.layerGroup()
layerControl.addOverlay(pointline, "Point Connect");

var nowline = L.layerGroup()
layerControl.addOverlay(nowline, "Now Line");
map.addLayer(nowline)// on by defult

//layer for live plane markers
var liveplane = L.layerGroup()
layerControl.addOverlay(liveplane, "Live Plane")
map.addLayer(liveplane)// on by defult

//layer for buffers
var bufferlayer = L.layerGroup()
layerControl.addOverlay(bufferlayer, "Buffers")

L.geoJson(buffer.buffer12, {'color': 'green'}).addTo(bufferlayer);
L.geoJson(buffer.buffer21).addTo(bufferlayer);
L.geoJson(buffer.buffer30, {'color': 'yellow'}).addTo(bufferlayer);

//red plane line
var planeline = L.polyline(plane_ar,{color:'red',}).addTo(map)

//layer for RWY21
var rnwy21 = L.layerGroup()
layerControl.addOverlay(rnwy21, "Runway 21");





//fuction takes a point and a geojson of a buffer and retuns true if within
function within(point,geojson){
    var latlon_ar = [] //creates a array of latlons
    for (var i in geojson[0].features[0].geometry.coordinates[0][0]){
       var latlon = new LatLon(geojson[0].features[0].geometry.coordinates[0][i][1],geojson[0].features[0].geometry.coordinates[0][i][0])
       latlon_ar.push(latlon) 
       

    }
    point.isEnclosedBy(latlon_ar)
    
    return point.isEnclosedBy(latlon_ar) //returns true or false
}

var shadow_ar = [] //create empty array for shadows;



const date = new Date() //takes curent date

var  sliderdate = new Date(date)



  

//var sunpos= SunCalc.getPosition(date,plane_ar[1].lat,plane_ar[1].lng)
//var sunalt =  (sunpos.altitude * 180.0/Math.PI)

//console.log(sunalt)


//chnages the date with the slider
document.getElementById('slider').addEventListener('input', function (){
    
    var hours = Math.floor(slider.value / 60)
    var minutes = slider.value % 60
    
    
    sliderdate.setHours(hours,minutes)
    // the slider supplies 0-23 number and this corresoponds to a hour of the day that is re set
});

//chnages the value diaplay under the slider
slider.oninput = function() {
    output.innerHTML = this.value;
    pointline.clearLayers()//clears the yellow connecting line- just stuck in here and is somehow works to clear them beofre the next one is drawn

} 


//function that takes a point and reterns its shadow point
function shadowcalc(start_array,end_array,time){
for (var i in start_array){

    var sunpos= SunCalc.getPosition(time,start_array[i].lat,start_array[i].lng)

    var sunazi =  ((sunpos.azimuth * (180.0/Math.PI))) //0 is south so 180 needs to be added- took me hours to get this
    var sunalt =  (sunpos.altitude * 180.0/Math.PI)

    var shadowlen = (start_array[i].ele / Math.tan(sunpos.altitude))

    var endpoint = new LatLon(start_array[i].lat,start_array[i].lng).destinationPoint(shadowlen,(sunazi))

    end_array.push({'lat': endpoint._lat, 'lng': endpoint._lon, 'shadowlen': shadowlen})
}
}


//the now orange line
setInterval(nowlinemove,250)//updates everysecond
function nowlinemove(){
    nowline.clearLayers()// clears the layer from the previuos line
    var nowdate = new Date()
    var now_ar = [] //creates empty array
    shadowcalc(plane_ar,now_ar,nowdate)//populates now_ar using the current time param
    var nowlinemove = L.polyline(now_ar,{color:'orange'})
    
    var nowpos= SunCalc.getPosition(nowdate,plane_ar[i].lat,plane_ar[i].lng) //it was i before 12 and somehow worked- idk
    
    if ((nowpos.altitude* 180.0/Math.PI) > 0){
        nowlinemove.addTo(nowline)
        };
    

    }




var  new_ar = []

//when the slider changes:
document.getElementById('slider').addEventListener('input', function (){
var sunpos= SunCalc.getPosition(sliderdate,32.07,34.78)

var sunazi =  ((sunpos.azimuth * (180.0/Math.PI))) //0 is south so 180 needs to be added- took me hours to get this
var sunalt =  (sunpos.altitude * 180.0/Math.PI)

var shadowlen = (ele / Math.tan(sunpos.altitude))
var new_ar = []
//var startpoint = new LatLon(32.07,34.78)
//var endpoint = new LatLon(32.067627,34.764091).destinationPoint(shadowlen,(sunazi+360))
//shadow_marker.setLatLng([endpoint._lat, endpoint._lon])
active_polyline.clearLayers();
shadowcalc(plane_ar,new_ar,sliderdate)
var shadowline = L.polyline(new_ar,{color:'black'})

if (sunalt > 0){
shadowline.addTo(active_polyline)
};




//draws the yellow connecting lines
var pointpair = []
for (var i in plane_ar){
   

    var pointpair = [[plane_ar[i].lat,plane_ar[i].lng],[new_ar[i].lat,new_ar[i].lng]]
    L.polyline(pointpair,{color:'yellow'}).addTo(pointline);
   

}
/*
console.log(object.habima)
for (var i in new_ar){
    var point = new LatLon(new_ar[i].lat,new_ar[i].lng)
    console.log(point)
    within(point,object.habima)
}
*/

//update the top info row

    
    document.getElementById('date').textContent= ((sliderdate.toString()).slice(3,21))//cuts off of the GMT part at the end
    document.getElementById('sunpos').textContent= `. Alt: ${Math.round(sunalt)}, Azi: ${Math.round(sunazi+180)}`
    
});

//now button resets date (doesnt work)
document.getElementById('nowbutton').onclick =function(date){
    //date = Date()
    console.log("now pressed",date)
    document.getElementById('date').textContent= date
    slider.setAttribute('value',slider.value +10 )
    console.log(slider.max  )

    
}
var air_source= airlab.airlab

//every time fetch api button is pressed- this is to minimize api calls
document.getElementById('fetchbutton').onclick= function(){
//remove the [0] when working on the real thing
console.log(air_source[0])
console.log(air_source[0].response[2].alt)
for (i in air_source[0].response){
    //if the arrival airport is LLBG and the alt is not 0 (ie. not on the gound)
    if ((air_source[0].response[i].arr_icao =='LLBG' && air_source[0].response[i].alt > 0 )){
    L.marker([air_source[0].response[i].lat,air_source[0].response[i].lng]).bindPopup(air_source[0].response[i].hex).addTo(liveplane)
        console.log("if true:",air_source[0].response[i].hex)
}
}
}

/*
-----time test-----.
console.log('time test:')
console.log(track.timed12[0].features[0].properties.track_seg_point_id)
console.log(Date.parse(track.timed12[0].features[0].properties.time))
for ( i in track.timed12[0].features){

console.log(`{'${track.timed12[0].features[i].properties.track_seg_point_id}' : ${Date.parse(track.timed12[0].features[i].properties.time)-(Date.parse(track.timed12[0].features[0].properties.time))}}`)
}
*/
/*    
    //fetch flight data section
fetch('airlab.json')

//fetch('https://airlabs.co/api/v9/flights?api_key=02615d93-395d-4ad0-883e-b99d81c413ba&bbox=29.563,33.760,33.321,36.002')
.then((response) => response.json())
.then((data) => {

    console.log(data)
for (i in data.states){
    L.marker([data.response[i].lng],data.response[i].lng).bindPopup(data.response[i].flight_iata).addTo(map)
}
//L.marker([data.states[1][6],data.states[1][5]]).addTo(map)
})

}
*/



//create plane array
var track21_ar = []
for (var i in track.track21){
    track21_ar.push({'lat': track.track21[i].geometry.coordinates[1], 'lng': track.track21[i].geometry.coordinates[0], 'ele':track.track21[i].geometry.coordinates[2]})   
}

//red plane line for 21
var line21 = L.polyline(track21_ar,{color:'green', opacity:0.4}).addTo(map)

document.getElementById('slider').addEventListener('input', function (){
    var sunpos= SunCalc.getPosition(sliderdate,32.07,34.78)
    
    var sunazi =  ((sunpos.azimuth * (180.0/Math.PI))) //0 is south so 180 needs to be added- took me hours to get this
    var sunalt =  (sunpos.altitude * 180.0/Math.PI)
    
    var shadowlen = (ele / Math.tan(sunpos.altitude))
    var shaow21_ar = []
    //var startpoint = new LatLon(32.07,34.78)
    //var endpoint = new LatLon(32.067627,34.764091).destinationPoint(shadowlen,(sunazi+360))
    //shadow_marker.setLatLng([endpoint._lat, endpoint._lon])
    rnwy21.clearLayers();
    shadowcalc(track21_ar,shaow21_ar,sliderdate)
    var shadowline = L.polyline(shaow21_ar,{color:'black'})
   
    if (sunalt > 0){
    shadowline.addTo(rnwy21)
    };



//draws the yellow connecting lines
var pointpair2 = []


for (var i in track21_ar){
    var pointpair2 = [[track21_ar[i].lat,track21_ar[i].lng],[shaow21_ar[i].lat,shaow21_ar[i].lng]]
    L.polyline(pointpair2,{color:'red', weight:1}).addTo(pointline);

}
   

}
)