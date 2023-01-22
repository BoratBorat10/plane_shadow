import LatLon, { Dms } from 'https://cdn.jsdelivr.net/npm/geodesy@2/latlon-spherical.js';
import {noUiSlider} from 'https://cdn.bootcss.com/noUiSlider/15.6.1/nouislider.js'
import {geotrack} from './node_modules/geo_track.js'

var map = L.map('map',{
    center: [32.03993,34.82497],
    zoom: 13
    });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


//slider
var rangeSlider = document.getElementById('slider');

noUiSlider.create(rangeSlider, {
    start: [180],
    range: {
        'min': [0],
        'max': [360]
    }
});
var sliderpos = slider.noUiSlider.get()
console.log(sliderpos)


rangeSlider.addEventListener

//plane vars
var plane_start_lat = 32.069344
var plane_start_lon = 34.760834
var plane_end_lat = 32.0070064
var plane_end_lon = 34.8806463
var planehight = 647

//import SunCalc
var date = new Date()
var sunnow = SunCalc.getPosition(date,32.046108,34.7817992)
var sunnowazi =  ((sunnow.azimuth * (180.0/Math.PI)) +180) //0 is south so 180 needs to be added- took me hours to get this
var sunnowalt =  (sunnow.altitude * 180.0/Math.PI)

//sun vars
var sunalt = sunnowalt
var sunang = sunnowazi

var sunaltradians = (sunalt * (Math.PI/180))

// Shadows vars
    // there is a need to conver the alt from degrees to radians for the tan operation
    //shadow lencth clculation = hight/tan(sun_alltitude)
var shadowlen = (planehight / Math.tan(sunaltradians))
var shadowang = (sunang-180)


//
const shadow_start = new LatLon(plane_start_lat,plane_start_lon).destinationPoint(shadowlen,shadowang)

console.log("test", geotrack[6].properties.lon)//this is the method!


// the plane flight track in red
var planetrack = [[geotrack[8].properties.lon,geotrack[8].properties.lat],[geotrack[32].properties.lon,geotrack[32].properties.lat]]
        L.polyline(planetrack,{color:'red', opacity:1}).addTo(map);

// the shadow track in black
//var shadowtrack = [[shadow_start.lat, shadow_start.lon],[plane_end_lat,plane_end_lon]]
    //L.polyline(shadowtrack,{color:'black', opacity:0.5, stroke:true}).addTo(map);

//top info date and sun location
const para = document.getElementById("info")
para.textContent = `NOW: ${date} Sun Azi: ${sunnowazi}. Sun Alt: ${sunnowalt}. Slider pos: ${sliderpos}`


//plane markers
    var geojsonMarkerOptions = {
        radius: 4,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };    
L.geoJSON(geotrack, {pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions);
}}
).addTo(map);


console.log("geo test:", geotrack[1].properties.lat,geotrack[1].properties.lon)
console.log(sunnow)
console.log(
    
    "azi:", ((sunnow.azimuth * (180.0/Math.PI)) +180), //0 is south so 180 needs to be added- took me hours to get this
    "alt:", (sunnow.altitude * 180.0/Math.PI)
)



//function that takes point, hight, sun 
function shadow_point (geotrack, sunnow,){

    for (var i in geotrack){
        var shadowlatlon = L.latLng({lat:geotrack[i].properties.lon, lng: geotrack[i].properties.lat});
        
        var shadow_len = geotrack[i].properties.ele/ Math.tan(sunnow.azimuth)
        
        const shadow_pos = new LatLon(geotrack[i].properties.lon, geotrack[i].properties.lat).destinationPoint(shadow_len,(sunnow.azimuth)-180)
        
        L.marker(shadow_pos).addTo(map);
        console.log(shadow_pos)
    
    
        //draw shadow line
        //var planetrack = [[geotrack[i].properties.lon,geotrack[i].properties.lat],[geotrack[-1].properties.lon,geotrack[6].properties.lat]]
        //L.polyline(planetrack,{color:'black', opacity:1}).addTo(map);}
   
   
   
   //return console.log("function",geotrack[44].properties.lat)


}}


shadow_point(geotrack,sunnow);

//L.marker([geotrack[44].properties.lat,geotrack[1].properties.lon]).addTo(map)

