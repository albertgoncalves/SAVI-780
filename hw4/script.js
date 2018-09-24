// $ tslint script.ts ; tsc script.ts
// via https://gist.github.com/mjackson/5311256
var hslToRgb = function (h, s, l) {
    var hslHelper = function (hh, ss, ll) {
        var q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
        var p = 2 * ll - q;
        var r = hue2rgb(p, q, hh + (1 / 3));
        var g = hue2rgb(p, q, hh);
        var b = hue2rgb(p, q, hh - (1 / 3));
        return [r * 255, g * 255, b * 255];
    };
    return s === 0 ? [l, l, l]
        : hslHelper(h, s, l);
};
var hue2rgb = function (p, q, t) {
    var tt = t < 0 ? t + 1
        : t > 1 ? t - 1
            : t;
    return tt < (1 / 6) ? p + (q - p) * 6 * tt
        : tt < (1 / 2) ? q
            : tt < (2 / 3) ? p + (q - p) * ((2 / 3) - tt) * 6
                : p;
};
var rgbToHex = function (rgb) {
    var hex = Number(rgb).toString(16);
    return hex.length < 2 ? "0" + hex
        : hex;
};
var fullColorHex = function (r, g, b) {
    var red = rgbToHex(Math.floor(r));
    var green = rgbToHex(Math.floor(g));
    var blue = rgbToHex(Math.floor(b));
    return "#" + red + green + blue;
};
var applyHslToHex = function (h, s, l) {
    var _a = hslToRgb(h, s, l), r = _a[0], g = _a[1], b = _a[2];
    return fullColorHex(r, g, b);
};
var getColor = function (featIn) {
    return featIn === "G" ? "#38A800"
        : applyHslToHex(Math.random(), Math.random(), Math.random());
};
// via https://gis.stackexchange.com/questions/243136/geojson-add-and-format-line-features-to-a-leaflet-map
var styleLines = function (featureLayer) {
    // console.log(getColor(featureLayer));
    return { color: getColor(featureLayer.properties.rt_symbol),
        opacity: (0.5 * Math.random()) + 0.5,
        weight: 20
    };
};
var getResp = function (response) { return response.json(); };
var getData = function (mapVar) { return function (data) {
    var mapData = L.geoJson(data, { style: styleLines });
    mapData.addTo(mapVar);
    mapVar.fitBounds(mapData.getBounds());
    console.log(data);
    console.log(mapData);
}; };
var loadData = function (url) {
    fetch(url)
        .then(getResp)
        .then(getData(map));
};
var origin = [40.7128, -74.0060];
var tileOpt = { maxZoom: 18 };
var tileUrl = ("https://stamen-tiles.a.ssl.fastly.net/toner/"
    + "{z}/{x}/{y}.png");
var dataUrl = ("https://data.cityofnewyork.us/resource/"
    + "s7zz-qmyz.geojson"
    + "?$limit=65");
var map = L.map("map").setView(origin, 5);
// MAIN
L.tileLayer(tileUrl, tileOpt).addTo(map);
loadData(dataUrl);
