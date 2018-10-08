// tslint script.ts; tsc script.ts;
var tileUrl = ("https://stamen-tiles.a.ssl.fastly.net/toner/"
    + "{z}/{x}/{y}.png");
var origin = [40.741,
    -73.925
];
// const mapOpt            = { doubleClickZoom: false
//                           , dragging       : false
//                           , keyboard       : false
//                           , scrollWheelZoom: false
//                           , tap            : false
//                           , touchZoom      : false
//                           , zoomControl    : false
//                           };
var colorMap = { 1: [0, 80, 50],
    2: [0, 80, 50],
    3: [0, 80, 50],
    4: [120, 60, 40],
    5: [120, 60, 40],
    6: [120, 60, 40],
    7: [295, 55, 40],
    A: [240, 55, 40],
    C: [240, 55, 40],
    E: [240, 55, 40],
    B: [30, 80, 50],
    D: [30, 80, 50],
    F: [30, 80, 50],
    M: [30, 80, 50],
    G: [100, 80, 55],
    J: [35, 50, 40],
    Z: [35, 50, 40],
    L: [0, 0, 35],
    N: [55, 90, 50],
    Q: [55, 90, 50],
    R: [55, 90, 50],
    W: [55, 90, 50],
    S: [0, 0, 40]
};
var allStops = Object.keys(colorMap).map(function (x) { return x.toString(); });
var keysToStops = allStops.reduce(function (obj, stop) {
    obj[keyInputs[stop.toLowerCase()]] = stop;
    return obj;
}, {});
//
// shared utility functions
//
var contains = function (mainString) { return function (subString) {
    return mainString.indexOf(subString) < 0 ? false
        : true;
}; };
var dashes = function (str) { return "-" + str + "-"; };
var checkField = function (searchTerm, field) {
    return function (row) {
        var column = row.properties[field];
        return contains(column)(dashes(searchTerm));
    };
};
var initLines = function (linesObj) { return ({ take: [], drop: linesObj }); };
var unique = function (myArray) {
    return (myArray.filter(function (v, i, a) { return a.indexOf(v) === i; }));
};
var checkLength = function (myArray, f) { return myArray.length > 0 ? f(myArray)
    : null; };
var checkKey = function (keyStroke) {
    return contains(Object.keys(keysToStops).join(", "))(keyStroke.toString());
};
var refresh = function () { return location.reload(); };
var smudge = function (colorVal) {
    var newVal = ((colorVal * 0.15) * (Math.random() - 0.5)) + colorVal;
    return newVal < 0 ? "0"
        : newVal.toString();
};
var arrayToHsl = function (_a) {
    var h = _a[0], s = _a[1], l = _a[2];
    var _b = [h, s, l].map(smudge), hh = _b[0], ss = _b[1], ll = _b[2];
    return "hsl(" + hh + ", " + ss + "%, " + ll + "%)";
};
//
// station search pattern
//
var search = function (featureArray, searchTerm) {
    return featureArray.filter(checkField(searchTerm, "line"));
};
//
// lines search pattern
//
var splitSearch = function (featureArray, searchTerm) {
    var take = [];
    var drop = [];
    for (var _i = 0, featureArray_1 = featureArray; _i < featureArray_1.length; _i++) {
        var row = featureArray_1[_i];
        checkField(searchTerm, "name")(row) ? take.push(row)
            : drop.push(row);
    }
    return { take: take, drop: drop };
};
//
// geojson loader
//
var loadData = function (mapVar, style) { return function (dataVar) {
    var mapData = L.geoJson(dataVar, style);
    var newLayer = mapData.addTo(mapVar);
    // map.fitBounds(mapData.getBounds());
    return newLayer;
}; };
var checkOutput = function (_a) {
    var rows = _a[0], column = _a[1];
    console.log(unique(rows.map(function (row) { return row.properties[column]; })));
    console.log(rows.length);
};
var pointToCircle = function (geoJsonPoint, latlng) { return L.circleMarker(latlng); };
var markerToCircle = function (color) {
    return { pointToLayer: pointToCircle,
        style: styleCircle(color)
    };
};
var styleCircle = function (color) { return function (geoJsonFeature) {
    return { fillColor: color,
        radius: 6,
        fillOpacity: 1,
        stroke: false
    };
}; };
var lineStyle = function (inputColor) {
    return { style: { color: inputColor
        },
        weight: 5
    };
};
var mapInput = function (mapVar, linesInput, stationsInput, layerInput, keyInput) {
    var linesOutput = splitSearch(linesInput.drop, keyInput);
    var stationsOutput = search(stationsInput, keyInput);
    var _ = layerInput !== null ? layerInput.clearLayers()
        : null;
    var color = arrayToHsl(colorMap[keyInput]);
    _ = checkLength(linesOutput.take, loadData(mapVar, lineStyle(color)));
    var newStationsLayer = checkLength(stationsOutput, loadData(mapVar, markerToCircle(color)));
    [[linesOutput.take, "name"],
        [stationsOutput, "line"]
    ].forEach(checkOutput);
    return [linesOutput, stationsOutput, newStationsLayer];
};
var selectStop = function (selection) {
    var _a;
    _a = mapInput(map, lines, stations, stationsLayer, selection), lines = _a[0], stations = _a[1], stationsLayer = _a[2];
};
//
// main
//
// const map = L.map("map", mapOpt).setView(origin, 11);
var map = L.map("map").setView(origin, 11);
L.tileLayer(tileUrl).addTo(map);
lines = initLines(lines.features);
stations = stations.features;
var stationsLayer = null;
window.onkeydown = function (e) {
    return e.keyCode ? checkKey(e.keyCode) ? selectStop(keysToStops[e.keyCode])
        : e.keyCode === 27 ? refresh()
            : null
        : null;
};
// ["G", "R", "F"].forEach(selectStop);
