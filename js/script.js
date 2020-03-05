function sendData(lng,lat) {
    var XHR = new XMLHttpRequest();
    url = 'https://map.yahooapis.jp/placeinfo/V1/get?lat=' + lat + '&lon=' + lng + '&appid=dj00aiZpPXF3a25mWGUyOUlrayZzPWNvbnN1bWVyc2VjcmV0Jng9MzA-&output=json';
    // リクエスト
    XHR.open("GET", url,true);

    // 送信
    XHR.responseType = 'json';
    XHR.onreadystatechange = function(){
  	if (XHR.readyState == 4 && XHR.status == 200){
  		// alert(XHR.responseText);
      var key = lng + "-" + lat;

      // sessionStorage.setItem(key, XHR.responseText);
  	}

  }
  XHR.send(null);
}

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFpa2ltaW5vYmUiLCJhIjoiY2s2MzkyMnM3MDJkYzNtbXBmNXF6ZXJ0aCJ9.mUuWuj5Q11f4kDhgJY6KXA';
// mapboxgl.Map コンストラクターから map オブジェクトを作る
// その際、初期値として情報を渡す
// のちのちこの map オブジェクトに色々操作を加える
var map = new mapboxgl.Map({
  // map を紐づける DOM element
  // id もしくは DOM element を指定する
  container: 'map',
  // よくわからない。自分でスタイルを作成できる模様。
  style: 'mapbox://styles/mapbox/streets-v11',
  // 地図の中心地
  center: [137.38357, 34.762559],
  // 拡大倍率 小数点以下も有効  12.6 とか
  zoom: 13
});


// map.on("click", (e)=>alert(e.latlng)  );
map.on("click", function(e){
  //経緯度表示
  // alert(e.lnglats.lat);
  sendData(e.lngLat.lng, e.lngLat.lat);
//   var geojson = {
//   type: 'FeatureCollection',
//   features: [{
//     type: 'Feature',
//     geometry: {
//       type: 'Point',
//       coordinates: [-77.032, 38.913]
//     },
//     properties: {
//       title: 'Mapbox',
//       description: 'Washington, D.C.'
//     }
//   }]
// };
  // create the popup
  var popup = new mapboxgl.Popup({ offset: 25 }).setText(
  'Construction on the Washington Monument began in 1848.'
  );

  // create DOM element for the marker
  var el = document.createElement('div');
  el.id = 'marker';

  new mapboxgl.Marker(el)
    .setLngLat([ e.lngLat.lng, e.lngLat.lat ])
    .setPopup(popup)
    .addTo(map)


    var idd = "places" + e.lngLat.lng + "-" + e.lngLat.lat;

    // sendData(e.lngLat.lng,e.lngLat.lat);

    map.addLayer(
    {
      'id': idd,
      'type': 'symbol',
      'source': {
      'type': 'geojson',
        'data': {
        'type': 'FeatureCollection',
        'features': [
        {
            'type': 'Feature',
            'properties': {
              'description':
              '<strong>Make it Mount Pleasant</strong><p>Make it Mount Pleasant is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>' + e.lngLat.lng,
              'icon': 'theatre'
            },
            'geometry': {
              'type': 'Point',
              'coordinates': [e.lngLat.lng, e.lngLat.lat]
            }
          }
        ]
      }
      },
      'layout': {
        'icon-image': '{icon}-15',
        // 'icon-image': 'https://hiyokoyarou.com/wp-content/uploads/2017/04/iconpittari.png',
        'icon-allow-overlap': true
      }
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.on('mouseenter', idd, function(e) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer';

      var coordinates = e.features[0].geometry.coordinates.slice();
      var description = e.features[0].properties.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
    });

    map.on('mouseleave', idd, function() {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });
});
