var rgbToHex = function (rgb) {
    var hex = Number(rgb).toString(16);
    return hex.length < 2 ? "0" + hex
        : hex;
};
var getColor = function (featureLayer) {
    var featIn = featureLayer.properties.rt_symbol;
    return featIn === "G" ? "rbg(0,0,0,1)" // "#FF5500"
        : "#38A800";
};
var styleLines = function (featureLayer) {
    console.log(getColor(featureLayer));
    return { color: getColor(featureLayer),
        opacity: 0.7,
        weight: 10
    };
};
var getResp = function (response) { return response.json(); };
var getData = function (data) {
    var mapData = L.geoJson(data, { style: styleLines });
    mapData.addTo(map);
    map.fitBounds(mapData.getBounds());
    console.log(data);
    console.log(mapData);
};
var loadData = function (url) {
    fetch(url)
        .then(getResp)
        .then(getData);
};
var origin = [40.7128, -74.0060];
var tileOpt = { maxZoom: 18 };
var tileUrl = ("https://stamen-tiles.a.ssl.fastly.net/toner/"
    + "{z}/{x}/{y}.png");
var dataUrl = ("https://data.cityofnewyork.us/resource/"
    + "s7zz-qmyz.geojson"
    + "?$limit=15");
var map = L.map("map").setView(origin, 5);
// MAIN
L.tileLayer(tileUrl, tileOpt).addTo(map);
loadData(dataUrl);
