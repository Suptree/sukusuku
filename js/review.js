//アクセスキーを設定
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFpa2ltaW5vYmUiLCJhIjoiY2s2MzkyMnM3MDJkYzNtbXBmNXF6ZXJ0aCJ9.mUuWuj5Q11f4kDhgJY6KXA';

// 最初の位置を設定
var map = new mapboxgl.Map({
container: 'map',
center: [137.38357, 34.762559],
zoom: 13,
style: 'mapbox://styles/mapbox/streets-v9'
});

//mapの位置にピンをさす
var marker = new mapboxgl.Marker()
  .setLngLat(map.getCenter())
  .addTo(map);

//時間を求める関数
function getNow() {
	var now = new Date();
	var year = now.getFullYear();
	var mon = now.getMonth()+1; //１を足すこと
	var day = now.getDate();
	var hour = now.getHours();
	var min = now.getMinutes();
	var sec = now.getSeconds();
	//出力用
	var s = year + "	" + mon + "/" + day + "		" + hour + "時" + min + "分" + sec + "秒";
	return s;
}

//レビュー
function func1() {
	  var input_message = document.getElementById("input_message").value;
	  input_message = input_message ;
	  const str = document.getElementById("color3").value;
	  document.getElementById("output_message").innerHTML += "---------------------------------------" + "<br>" + "<strong>"+str+"</strong>"+"<br>" + input_message + "<br>" + getNow() + "<br>";
	}

//指定の範囲までジャンプする
document.getElementById('fit').addEventListener('click', function() {
map.fitBounds([
[137.38357+0.04, 34.762559+0.04],
[137.38357-0.04, 34.762559-0.04]
]);
});

//緯度経度の計算
map.on('mousemove', function(e) {
document.getElementById('info').innerHTML =
// e.point is the x, y coordinates of the mousemove event relative
// to the top-left corner of the map
// JSON.stringify(e.point) +
// '<br />' +
// e.lngLat is the longitude, latitude geographical position of the event
JSON.stringify(e.lngLat.wrap());
});

// ズームと回転の機能を画面に追加
map.addControl(new mapboxgl.NavigationControl());

//全画面
map.addControl(new mapboxgl.FullscreenControl());

/////////////////////////////////////人類レビュー計画///////////////////////////////////////////////




//////////////////////////////////////吹き出し表示///////////////////////////////////////////////

map.on('load', function() {
	var input_message = document.getElementById("input_message").value;
	  input_message = input_message ;
	  const str = document.getElementById("color3").value;
map.addLayer({
'id': 'places',
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
'<strong><font size="5">素晴らしい！！</font></strong><p>色々な設備が整っていてとても助かります。またここを利用したいと思います！サイコー！！！</p>'+ getNow(),
'icon': 'music'
},
'geometry': {
'type': 'Point',
'coordinates': [137.38357, 34.762559]
}
}
]
}
},
'layout': {
'icon-image': '{icon}-15',
'icon-allow-overlap': true
}
});

// 吹き出しを作るけど, マップにはまだ加えない.
var popup = new mapboxgl.Popup({
closeButton: false,
closeOnClick: false
});

map.on('mouseenter', 'places', function(e) {
// カーソルをチェンジ
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

map.on('mouseleave', 'places', function() {
map.getCanvas().style.cursor = '';
popup.remove();
});
});
