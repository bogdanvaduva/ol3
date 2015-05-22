goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.control');
goog.require('ol.control.OverviewMap');
goog.require('ol.interaction');
goog.require('ol.interaction.DragRotateAndZoom');
goog.require('ol.layer.Tile');
goog.require('ol.source.OSM');


var overviewMapControl = new ol.control.OverviewMap({
  // see in overviewmap-custom.html to see the custom CSS used
  className: 'ol-overviewmap ol-custom-overviewmap',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM({
        'url': 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
      })
    })
  ],
  collapseLabel: '\u00BB',
  label: '\u00AB',
  collapsed: false
});

var map = new ol.Map({
  controls: ol.control.defaults().extend([
    overviewMapControl
  ]),
  interactions: ol.interaction.defaults().extend([
    new ol.interaction.DragRotateAndZoom()
  ]),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  target: 'map',
  view: new ol.View({
    center: [500000, 6000000],
    zoom: 7
  })
});

var setNewExtent = function (overviewDiv) {
   var offset = overviewDiv.helper.position();
   var divSize = [overviewDiv.helper.width(), overviewDiv.helper.height()];
   var mapSize = map.getSize();
   var c = map.getView().getResolution();
   var xMove = offset.left * (Math.abs(mapSize[0] / divSize[0]));
   var yMove = offset.top * (Math.abs(mapSize[1] / divSize[1]));
   var bottomLeft = [0 + xMove, mapSize[1] + yMove];
   var topRight = [mapSize[0] + xMove, 0 + yMove];
   var left = map.getCoordinateFromPixel(bottomLeft);
   var top = map.getCoordinateFromPixel(topRight);
   var extent = [left[0], left[1], top[0], top[1]];
   map.getView().fitExtent(extent, map.getSize());
   map.getView().setResolution(c);
};

$(document).ready(function (e) {

$.getScript("http://code.jquery.com/ui/1.11.3/jquery-ui.min.js", function(data, textStatus, jqxhr) {
	if (jqxhr.status===200) {
		$(".ol-overviewmap-box").draggable({drag: function (event, ui) {  }});
		$(".ol-overviewmap-box").on("dragstop", function (event, ui) {
		   setNewExtent(ui);
		   /* After drag the box left and top are off */
		  $(".ol-overviewmap-box").css("left", "auto");
		  $(".ol-overviewmap-box").css("top", "auto");
		});
	}
});

});