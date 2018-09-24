var hslToRgb = function (h, s, l) {
    if (s === 0) {
        // r = g = b = l; // achromatic
        return [l, l, l];
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        var r = hue2rgb(p, q, h + (1 / 3));
        var g = hue2rgb(p, q, h);
        var b = hue2rgb(p, q, h - (1 / 3));
        return [r * 255, g * 255, b * 255];
    }
};
var hue2rgb = function (p, q, t) {
    if (t < 0) {
        t += 1;
    }
    else if (t > 1) {
        t -= 1;
    }
    if (t < (1 / 6)) {
        return p + (q - p) * 6 * t;
    }
    else if (t < (1 / 2)) {
        return q;
    }
    else if (t < (2 / 3)) {
        return p + (q - p) * ((2 / 3) - t) * 6;
    }
    else {
        return p;
    }
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
    var rgb = hslToRgb(h, s, l);
    // console.log(rgb);
    return fullColorHex(rgb[0], rgb[1], rgb[2]);
};
var getColor = function (featureLayer) {
    var featIn = featureLayer.properties.rt_symbol;
    return featIn === "G" ? "#38A800"
        : applyHslToHex(Math.random(), Math.random(), Math.random());
};
var styleLines = function (featureLayer) {
    // console.log(getColor(featureLayer));
    return { color: getColor(featureLayer),
        opacity: (0.5 * Math.random()) + 0.5,
        weight: 20
    };
};
var getResp = function (response) { return response.json(); };
var getData = function (data) {
    var mapData = L.geoJson(data, { style: styleLines });
    mapData.addTo(map);
    map.fitBounds(mapData.getBounds());
    console.log(data);
    // console.log(mapData);
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
    + "?$limit=65");
var map = L.map("map").setView(origin, 5);
// MAIN
L.tileLayer(tileUrl, tileOpt).addTo(map);
loadData(dataUrl);
