/*
fetch('https://data-cloud.flightradar24.com/zones/fcgi/feed.js?faa=1&bounds=33.798%2C31.123%2C31.254%2C35.306')
.then((response) => response.json())
.then((data) => {

    var frData = []
    for (var i in data){
        console.log(data[i][13])
        frData.push(data[i][13])
        //frData[i].push(data[i][2])
    }
console.log(frData)
}
)
*/


async function frData() {
    let obj;
  
    const res = await fetch('https://data-cloud.flightradar24.com/zones/fcgi/feed.js?faa=1&bounds=33.798%2C31.123%2C31.254%2C35.306')
  
    data = await res.json();
   fligt_ar = []
    var obj1 = {data}
   var fligt = {'fli':[]}
    for (var i in obj1.data){
        console.log(obj1.data[i][1],obj1.data[i][2])
        fligt_ar.push({'hex':obj1.data[i][13], 'lat':obj1.data[i][1],'lon':obj1.data[i][2],'dir':obj1.data[i][3], 'speed':obj1.data[i][5],'time':obj1.data[i][10],'dep':obj1.data[i][11], 'arr':obj1.data[i][12], 'relvent':null})
        var obj2 ={ }
    }
console.log((fligt_ar[3]))
  }
  
  frData();
