var userPositon = [0,0];
var gpsMode = 0; //0で位置情報がない,1で位置情報を取得できたことを指す

var dataset=[
  ['34.757598','137.426803'],
  ['35.170915','136.881537'],
  ['34.742052','137.385161'],
  ['34.753687','137.402635']
];

var csvToJson = function(csvStr, userOptions) {
  if (typeof csvStr !== 'string') return null;
  var options = { header : 0, columnName : [], ignoreBlankLine : true };
  if (userOptions) {
      if (userOptions.header) options.header = userOptions.header;
      if (userOptions.columnName) options.columnName = userOptions.columnName;
  }
  var rows = csvStr.split('\n');
  var json = [], line = [], row = '', data = {};
  var i, len, j, len2;
  for (i = 0, len = rows.length; i < len; i++) {
      if ((i + 1) <= options.header) continue;
      if (options.ignoreBlankLine && rows[i] === '') continue;
      line = rows[i].split(',');
      if (options.columnName.length > 0) {
          data = {};
          for (j = 0, len2 = options.columnName.length; j < len2; j++) {
              if (typeof line[j] !== 'undefined') {
                  row = line[j];
                  row = row.replace(/^"(.+)?"$/, '$1');
              } else {
                  row = null;
              }
              data[options.columnName[j]] = row;
          }
          json.push(data);
      } else {
          json.push(line);
      }
  }
  return json;
};

//var jsonObj = csvToJson("baby-ho_20200129.csv");

var mode = 'walking';
var stalat = dataset[0][0];
var stalng = dataset[0][1];
var endlat = dataset[1][0];
var endlng = dataset[1][1];
var geometries = 'geojson';

function getDirection(mode,stalat,stalng,endlat,endlng,geometries){
  var request = new XMLHttpRequest();
  var url = 'https://api.mapbox.com/directions/v5/mapbox/'+mode+'/'+stalng+','+stalat+';'+endlng+','+endlat+'?geometries='+geometries+'&access_token='+mapboxgl.accessToken;
  //console.log(url);
  request.open('GET', url, true);
  request.onload = function () {
    var json = JSON.parse(request.response);
    var data = json.routes[0];
    var route = data.geometry.coordinates;
    var geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };
    console.log('success to get the direction');
    if (map.getSource('route')) {
      map.getSource('route').setData(geojson);
      //console.log('true');
    } else {
      map.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': route
          }
        }
      });
      map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#888',
          'line-width': 8
        }
      });
    }
  };
  request.send();
};


function getUserPos(){

  var obj = navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  /***** ユーザーの現在の位置情報を取得 *****/
  function successCallback(position) {
    var posSum = {
      'lat':position.coords.latitude,
      'lng':position.coords.longitude,
      'alt':position.coords.altitude,
      'option':{
        'acu':position.coords.accuracy,
        'altacu':position.coords.altitudeAccuracy,
        'head':position.coords.heading,
        'spd':position.coords.speed
      }
    };
    //var gpsJSON = JSON.parse( posSum );
    userPositon = [position.coords.latitude,position.coords.longitude]
    gpsMode = 1;
    console.log(userPositon);
  }

  /***** 位置情報が取得できない場合 *****/
  function errorCallback(error) {
    var err_msg = "";
    switch(error.code){
      case 1:
        err_msg = "位置情報の利用が許可されていません";
      break;
      case 2:
        err_msg = "デバイスの位置が判定できません";
      break;
      case 3:
        err_msg = "タイムアウトしました";
      break;
    }
    gpsMode = 0;
    console.log(err_msg);
  }

}

map.addControl(
    new mapboxgl.NavigationControl(), 'bottom-right');
    var size = 200;
    // implementation of CustomLayerInterface to draw a pulsing dot icon on the map
    // see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
    var pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),
      // get rendering context for the map canvas when layer is added to the map
      onAdd: function() {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },
      // called once before every frame where the icon will be used
      render: function() {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;
        var radius = (size / 2) * 0.3;
        var outerRadius = (size / 2) * 0.7 * t + radius;
        var context = this.context;
        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
        context.fill();
        // draw inner circle
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          radius,
          0,
          Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();
        // update this image's data with data from the canvas
        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;
        // continuously repaint the map, resulting in the smooth animation of the dot
        map.triggerRepaint();
        // return `true` to let the map know that the image was updated
        return true;
      }
    };


    map.on('load', function() {
      map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
      map.addSource('points', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [0, 0]
              }
            }
          ]
        }
      });
      map.addLayer({
        'id': 'points',
        'type': 'symbol',
        'source': 'points',
        'layout': {
          'icon-image': 'pulsing-dot'
        }
      });
      //getDirection(mode,stalat,stalng,endlat,endlng,geometries);
      getUserPos();
      var id = setInterval(function(){
        if (gpsMode==1) {
          var marker = new mapboxgl.Marker();
          marker.setLngLat([userPositon[1],userPositon[0]]);
          marker.addTo(map);
          map.flyTo({
            center: [userPositon[1],userPositon[0]],
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
          });
          getDirection(mode,userPositon[0],userPositon[1],endlat,endlng,geometries);
          clearInterval(id);
        } else {
          console.log('error:GPS情報がありません');
        }
      }, 1000);
    });
