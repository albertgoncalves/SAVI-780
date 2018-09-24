// $ tslint script.ts ; tsc script.ts
// via https://gist.github.com/mjackson/5311256
var hslToRgb = function (h, s, l) {
    return s === 0 ? [l, l, l]
        : hslHelper(h, s, l);
};
var hue2rgb = function (pqt) {
    var p = pqt[0], q = pqt[1], t = pqt[2];
    var tt = t < 0 ? t + 1
        : t > 1 ? t - 1
            : t;
    return tt < (1 / 6) ? p + (q - p) * 6 * tt
        : tt < (1 / 2) ? q
            : tt < (2 / 3) ? p + (q - p) * ((2 / 3) - tt) * 6
                : p;
};
var hslHelper = function (hh, ss, ll) {
    var q = ll < 0.5 ? ll * (1 + ss)
        : ll + ss - ll * ss;
    var p = 2 * ll - q;
    var rgb = [[p, q, hh + (1 / 3)] // r
        ,
        [p, q, hh] // g
        ,
        [p, q, hh - (1 / 3)] // b
    ];
    return rgb.map(function (x) { return hue2rgb(x) * 255; });
};
var rgbToHex = function (rgb) {
    var hex = Number(rgb).toString(16);
    return hex.length < 2 ? "0" + hex
        : hex;
};
var fullColorHex = function (r, g, b) {
    var _a = [r, g, b].map(function (x) { return rgbToHex(x); }), red = _a[0], green = _a[1], blue = _a[2];
    return "#" + red + green + blue;
};
var applyHslToHex = function (h, s, l) {
    var _a = hslToRgb(h, s, l).map(function (x) { return Math.floor(x); }), r = _a[0], g = _a[1], b = _a[2];
    return fullColorHex(r, g, b);
};
var getColor = function (featIn) {
    return featIn === "0" ? "#38A800"
        : applyHslToHex(Math.random(), (0.75 * Math.random()) + 0.25, (0.25 * Math.random()) + 0.4);
};
// via https://gis.stackexchange.com/questions/243136/geojson-add-and-format-line-features-to-a-leaflet-map
var styleLines = function (featureLayer) {
    // console.log(getColor(featureLayer));
    return { color: getColor(featureLayer.properties.rt_symbol),
        lineJoin: "round",
        opacity: (0.2 * Math.random()) + 0.8,
        weight: 10
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
var loadData = function (mapVar, url) {
    fetch(url)
        .then(getResp)
        .then(getData(mapVar));
};
var origin = [40.7128,
    -74.0060
];
var tileOpt = { maxZoom: 18,
    opacity: 0.5
};
var tileUrl = ("https://stamen-tiles.a.ssl.fastly.net/toner/"
    + "{z}/{x}/{y}.png");
var dataUrl = ("https://data.cityofnewyork.us/resource/"
    + "s7zz-qmyz.geojson"
    + "?$limit=100");
// MAIN
var map = L.map("map").setView(origin, 5);
L.tileLayer(tileUrl, tileOpt).addTo(map);
loadData(map, dataUrl);
