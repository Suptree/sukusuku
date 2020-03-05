var data
jQuery.getJSON("https://t-yukami.github.io/egmapjs/test.json", (data) => {
  console.log(data)

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
    for(var i=0;i<data.length;i++){
      var el = document.createElement('div');

      var omutu=0;
      var zyunyuu=0;
      var oyu=0;
      var toire=0;
      if(data[i].オムツ替え_女性対応有無 == "有"){
        omutu=1;
      }
      if(data[i].授乳_女性対応有無 == "有"){
        zyunyuu=1;
      }
      if(data[i].ミルクお湯_女性対応有無 == "有"){
        oyu=1;
      }
      if(data[i].トイレ子連れ_女性対応有無 == "有"){
        toire=1;
      }



      if(omutu == 0 && zyunyuu == 0 && oyu == 0 && toire == 1){
        el.id = 'marker4'
      }
      if(omutu == 0 && zyunyuu == 0 && oyu == 1 && toire == 0){
        el.id = 'marker3'
      }
      if(omutu == 0 && zyunyuu == 0 && oyu == 1 && toire == 1){
        el.id = 'marker10'
      }
      if(omutu == 0 && zyunyuu == 1 && oyu == 0 && toire == 0){
        el.id = 'marker1'
      }
      if(omutu == 0 && zyunyuu == 1 && oyu == 0 && toire == 1){
        el.id = 'marker7'
      }
      if(omutu == 0 && zyunyuu == 1 && oyu == 1 && toire == 0){
        el.id = 'marker6'
      }
      if(omutu == 0 && zyunyuu == 1 && oyu == 1 && toire == 1){
        el.id = 'marker13'
      }
      if(omutu == 1 && zyunyuu == 0 && oyu == 0 && toire == 0){
        el.id = 'marker2'
      }
      if(omutu == 1 && zyunyuu == 0 && oyu == 0 && toire == 1){
        el.id = 'marker9'
      }
      if(omutu == 1 && zyunyuu == 0 && oyu == 1 && toire == 0){
        el.id = 'marker8'
      }
      if(omutu == 1 && zyunyuu == 0 && oyu == 1 && toire == 1){
        el.id = 'marker14'
      }
      if(omutu == 1 && zyunyuu == 1 && oyu == 0 && toire == 0){
        el.id = 'marker5'
      }
      if(omutu == 1 && zyunyuu == 1 && oyu == 0 && toire == 1){
        el.id = 'marker12'
      }
      if(omutu == 1 && zyunyuu == 1 && oyu == 1 && toire == 0){
        el.id = 'marker11'
      }
      if(omutu == 1 && zyunyuu == 1 && oyu == 1 && toire == 1){
        el.id = 'marker15'
      }

      new mapboxgl.Marker(el)
      .setLngLat([ data[i].経度, data[i].緯度 ])
      .addTo(map)
    }
  });
});
