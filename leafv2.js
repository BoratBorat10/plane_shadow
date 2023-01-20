import LatLon, { Dms } from 'https://cdn.jsdelivr.net/npm/geodesy@2/latlon-spherical.js';
import noUiSlider from './nouislider/dist/nouislider.mjs'

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

console.log(shadow_start.lon)//this is the method!








// the plane flight track in red
var planetrack = [[plane_start_lat, plane_start_lon],[plane_end_lat,plane_end_lon]]
        L.polyline(planetrack,{color:'red', opacity:1}).addTo(map);

// the shadow track in black
var shadowtrack = [[shadow_start.lat, shadow_start.lon],[plane_end_lat,plane_end_lon]]
    L.polyline(shadowtrack,{color:'black', opacity:0.5, stroke:true}).addTo(map);




console.log(date)
console.log(sunnow)
console.log(
    
    "azi:", ((sunnow.azimuth * (180.0/Math.PI)) +180), //0 is south so 180 needs to be added- took me hours to get this
    "alt:", (sunnow.altitude * 180.0/Math.PI)
)


//function that takes point, hight, sun 
function shadow_point (point){

}


const para = document.getElementById("info")
para.textContent = `NOW: Sun Azi: ${sunnowazi}. Sun Alt: ${sunnowalt}. Slider pos: ${sliderpos}`

