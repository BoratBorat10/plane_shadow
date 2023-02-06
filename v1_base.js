import LatLon, { Dms } from 'https://cdn.jsdelivr.net/npm/geodesy@2/latlon-spherical.js';
import {geotrack} from './geo_track.js'
import { airlab } from './airlab.js';
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


//red plane line
var planeline = L.polyline(plane_ar,{color:'red',}).addTo(map)






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
setInterval(nowlinemove,1000)//updates everysecond
function nowlinemove(){
    nowline.clearLayers()// clears the layer from the previuos line
    var nowdate = new Date()
    var now_ar = [] //creates empty array
    shadowcalc(plane_ar,now_ar,nowdate)//populates now_ar using the current time param
    var nowlinemove = L.polyline(now_ar,{color:'orange'})
    
    var nowpos= SunCalc.getPosition(nowdate,plane_ar[i].lat,plane_ar[i].lng)
    
    if ((nowpos.altitude* 180.0/Math.PI) > 0){
        nowlinemove.addTo(nowline)
        };
    

    }


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


cresent.push({'lat': plane_ar[20].lat, 'lng':plane_ar[20].lng})

//console.log('creshen:',cresent)
L.polyline(cresent,{color:'blue'}).addTo(map)

//draws the yellow connecting lines
var pointpair = []
for (var i in plane_ar){
   

    var pointpair = [[plane_ar[i].lat,plane_ar[i].lng],[new_ar[i].lat,new_ar[i].lng]]
    L.polyline(pointpair,{color:'yellow'}).addTo(pointline);
   

}

/*    Markers for testing- diplayes each shadow point for point[20]
var testmark1 = L.marker([plane_ar[20].lat,plane_ar[20].lng]).addTo(map)
var testmark2 = L.marker([new_ar[20].lat,new_ar[20].lng]).addTo(map)
*/


//update the top info row

    
    document.getElementById('date').textContent= sliderdate
    document.getElementById('sunpos').textContent= `alt: ${sunalt}, azi: ${sunazi+180}, shadow len: ${shadowlen}`
    
   
});

//now button resets date (doesnt work)
document.getElementById('nowbutton').onclick =function(date){
    //date = Date()
    console.log("now pressed",date)
    document.getElementById('date').textContent= date
    slider.setAttribute('value',slider.value +10 )
    console.log(slider.max  )

    
}


//every time fetch api button is pressed- this is to minimize api calls
document.getElementById('fetchbutton').onclick= function(){
//remove the [0] when working on the real thing
console.log(airlab[0])
console.log([[airlab[0].response[1].lng],[airlab[0].response[1].lng]])
for (i in airlab[0].response){
    //if the arrival airport is LLBG and the alt is not 0 (ie. not on the gound)
    if (airlab[0].response[i].arr_icao ='LLBG' && airlab[0].response[i].alt > 0 ){
    L.marker([airlab[0].response[i].lat,airlab[0].response[i].lng]).bindPopup(airlab[0].response[i].hex).addTo(liveplane)
    }
}
}

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
