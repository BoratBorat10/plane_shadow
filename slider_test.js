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


//chnages the date with the slider
document.getElementById('slider').addEventListener('input', function (){
    var value = this.value
    date = new Date()
    date.setHours(this.value)
});


//plane vars
var plane_start_lat = 32.069344
var plane_start_lon = 34.760834
var plane_end_lat = 32.0070064
var plane_end_lon = 34.8806463
var planehight = 647


//import SunCalc
var date = new Date(2023,0,29,13,0)
var newDate = date.setHours(5)
console.log("dates:",date, Date(newDate))
var sunnow = SunCalc.getPosition(date,32.046108,34.7817992)
var sunnowazi =  ((sunnow.azimuth * (180.0/Math.PI)) +180) //0 is south so 180 needs to be added- took me hours to get this
var sunnowalt =  (sunnow.altitude * 180.0/Math.PI)

/*
slider.oninput = function(date,slidersun) {
    
    var slidersun = SunCalc.getPosition(date,32.046108,34.7817992)
    return slidersun
    console.log(slidersun.altitude)


}

*/



//sun vars
var sunalt = sunnowalt
var sunang = sunnowazi

var sunaltradians = (sunalt * (Math.PI/180))

// Shadows vars
    // there is a need to conver the alt from degrees to radians for the tan operation
    //shadow lencth clculation = hight/tan(sun_alltitude)
var shadowlen = (planehight / Math.tan(sunaltradians))
var shadowang = (sunang-180)





//top info date and sun location
const para = document.getElementById("info")
para.textContent = `NOW: ${date} Sun Azi: ${sunnowazi}. Sun Alt: ${sunnowalt}.`


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



const plane_ar = []
//function that takes point, hight, sun 
function shadow_point (geotrack, sunnow,array){

    for (var i in geotrack){
        
        
        var shadowlatlon = L.latLng({lat:geotrack[i].properties.lon, lng: geotrack[i].properties.lat});
        
        var shadow_len = geotrack[i].properties.ele/ Math.tan(sunnow.altitude)
        
        const shadow_pos = new LatLon(geotrack[i].properties.lon, geotrack[i].properties.lat).destinationPoint(shadow_len,(sunnow.azimuth))
        
        array.push({'lng': geotrack[i].properties.lat,'lat': geotrack[i].properties.lon, 'ele': geotrack[i].properties.ele})
        
        
        
}
//create a line fomr the array
var planeline = L.polyline(plane_ar,{color:'red'}).addTo(map);
}


shadow_point(geotrack,sunnow,plane_ar);


console.log(plane_ar)
console.log(plane_ar[1].lng)


const shadow_ar = []

function shadow_point_2 (array,shadow_ar){
    
    
    
    for (var i in array){
       var shadow_len = array[i].ele / Math.tan(sunnow.altitude);
        var shadow_pos = new LatLon(array[i].lng, array[i].lat).destinationPoint(shadow_len,(sunnow.azimuth));
        //console.log(array[1])
        shadow_ar.push({'lng': array[i].lng,'lat': array[i].lat, 'shadow_len': shadow_len})
    }
console.log (shadow_ar)
 

}




//const shadow_ar = plane_ar.map(shadow_point_2)



// Update the current slider value (each time you drag the slider handle). updates info bar
slider.oninput = function() {
    output.innerHTML = date;
  
    var slidersun = SunCalc.getPosition(date,32.046108,34.7817992)
    
    shadow_point_2(plane_ar,shadow_ar)
    
    //create a line fomr the array
    var shadowline = L.polyline(shadow_ar,{color:'black'}).addTo(map);

  
    const para = document.getElementById("info")
      para.textContent = `NOW: ${date} Sun Azi: ${slidersun.azimuth}. Sun Alt: ${slidersun.altitude}.`
      console.log("ran")
  } 


//now button resets date (doesnt work)
document.getElementById('nowbutton').onclick =function(date){
    date = Date()
    console.log("now pressed")
}



//L.marker([geotrack[44].properties.lat,geotrack[1].properties.lon]).addTo(map)

