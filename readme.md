# Airplane Shadow
![GIF-2023-02-26-16-34-56](https://github.com/BoratBorat10/plane_shadow/assets/110756460/3e9ff217-9843-4ca7-90ae-b9cf18074ca8)


## Overview

For many living under the approach path for a busy international airport is a reason the demand lower rent. But for me it held a great opportunity. One day walking around the neighborhood I heard the now familiar noise of a airplane flying low for landing and a few seconds later i was enveloped for an instant in darkness. Before i could realize what had happened it had already passed. I could not believe it, it was the planes shadow!

I could not let this special experience be a one time occurrence. Being engulfed for an instant in the shadow of a 44 thousand ton beast flying above you was something that i had to experience again. But how? My mind raced. I quickly sketched up a diagram and realized that I only need a few key pieces of information to make it all work. I then set out to build a proof of conspent.

## Calculation

In order to calculate the position of a the shadow one needs to gather the following information: 

- Airplane location (Lat, Lon)
- Airplane height
-  Sun position (altitude, azimuth)

Live airplane information is retrieved via [Airlabs API](https://airlabs.co/docs/flights). Sun position is uses the [Suncalc](https://github.com/mourner/suncalc) JavaScript library. 

With this information the of the location where the shadow will be cast is just some trigonometry and Geodesic calculations using the [Geodesy](https://www.movable-type.co.uk/scripts/geodesy-library.html) library,

![image](https://github.com/BoratBorat10/plane_shadow/assets/110756460/8be7d680-cfaa-43b4-ae16-a21f344df3ff)



## Validation

The code had been written, the UI build. I am consistently projecting the calculated position of shadows cast from overhead airplanes. But sitting in front of the computer there I have no idea if any of this actually translates to the real world. There is only one way to find out.

Loading the site on my phone I headed out to the beach, situated myself squarely in the expected trajectory and waited for a plane to approach.

And then...

![GIF-2023-02-10-15-39-52- beach](https://github.com/BoratBorat10/plane_shadow/assets/110756460/6674101e-b6b3-4803-8fd7-76227cb31a58)

It works! We now have a reliable method of predicting when and where the shadow from the airplane will be cast. This opens up the opportunity to consistently experience this phenomenon, as well as being able to prepare in advance to capture it on camera.

## Features

### Sun Slider

Using the slider above the map, one can scroll through the trajectory of aircraft shadow for the whole day. Planes land using an [ILS](https://en.wikipedia.org/wiki/Instrument_landing_system) which result and extremely precise and reliable approaches (displayed as a permanent red line on the map).

Thus, knowing the exact path used for approach, we can calculate the shadow trajectory for the different sun positions thought out the day.

This can be used to know at what times one can expect shadows above their home. When sliding the shadow line, the corresponding  time is updated above the slider. 

![shadow line](C:\Users\Yaron\Documents\Plane Shadow docs\shadow line.gif)

### Airplane Information

Clicking on a Airplane will bring up its flight information. Clicking on a shadow will display the name of the plane casting it. This is useful from crowded areads.

![image](https://github.com/BoratBorat10/plane_shadow/assets/110756460/d294786c-b5fe-486e-97b9-c45da44718d8)


### Runway Detection

Is is useful to know which runways are currently in use since they affect the approach pattern. For example I would get shadows in my neighborhood only when runway 12 was active.

Using historical flight data I generated buffers using the [Shapely](https://shapely.readthedocs.io/en/stable/reference/shapely.buffer.html) Python package. I expotred the coordinates of the buffers to GeoJson wichce Leaflet accespt.

Using [Turf.js](https://turfjs.org/), the program can now recognize if airplanes are contained inside the geographic buffer (and in addition they are at the correct height and heading) and figure out the which runway is now active for approaches. 

![image](https://github.com/BoratBorat10/plane_shadow/assets/110756460/247cc19f-3e02-4b3a-b200-a72539bd3f70)

## Conclusion

As far as proving the initial concept and creating a interface to visualize the results, this project has been a great success. I have many more features I would want to add, such as using the JavaScript [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) to notify the user of near by shadows, among other. I learned so much new methods and skills and really enjoyed the creative process of giving life to an idea.

