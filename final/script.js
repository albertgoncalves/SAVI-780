// tslint script.ts; tsc script.ts;
var tileUrl = ("https://stamen-tiles.a.ssl.fastly.net/toner/"
    + "{z}/{x}/{y}.png");
var origin = [40.7128,
    -74.0060
];
// const mapOpt            = { doubleClickZoom: false
//                           , dragging       : false
//                           , keyboard       : false
//                           , scrollWheelZoom: false
//                           , tap            : false
//                           , touchZoom      : false
//                           , zoomControl    : false
//                           };
var allStops = ["1", "2", "3", "4", "5", "6", "7",
    "A", "B", "C", "D", "E", "F", "G",
    "J", "L", "M", "N", "Q", "R", "S",
    "Z"
];
var keysToStops = allStops.reduce(function (obj, stop) {
    obj[keyInputs[stop.toLowerCase()]] = stop;
    return obj;
}, {});
var colorMap = { 1: 0,
    2: 0,
    3: 0,
    4: 135,
    5: 135,
    6: 135,
    7: 295,
    A: 250,
    C: 250,
    E: 250,
    B: 30,
    D: 30,
    F: 30,
    M: 30,
    G: 95,
    J: 35,
    Z: 35,
    L: 0 // need gray!
    ,
    N: 50,
    Q: 50,
    R: 50,
    W: 50,
    S: 0 // need gray!
};
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
var styleCircle = function (color) { return function (geoJsonFeature) {
    return { fillColor: color,
        radius: 6,
        fillOpacity: 0.75,
        stroke: false
    };
}; };
var circleStyle = function (color) {
    return { pointToLayer: pointToCircle,
        style: styleCircle(color)
    };
};
var lineStyle = function (inputColor) { return ({ style: { color: inputColor } }); };
var mapInput = function (mapVar, linesInput, stationsInput, layerInput, keyInput) {
    var linesOutput = splitSearch(linesInput.drop, keyInput);
    var stationsOutput = search(stationsInput, keyInput);
    var _ = layerInput !== null ? layerInput.clearLayers()
        : null;
    var color = "hsl(" + colorMap[keyInput].toString() + ", 100%, 50%)";
    _ = checkLength(linesOutput.take, loadData(mapVar, lineStyle(color)));
    var newStationsLayer = checkLength(stationsOutput, loadData(mapVar, circleStyle(color)));
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
// const map = L.map("map", mapOpt).setView(origin, 12);
var map = L.map("map").setView(origin, 12);
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
