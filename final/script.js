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
    "J", "L", "M", "N", "Q", "R", "S"
];
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
var loadData = function (mapVar) { return function (dataVar) {
    var mapData = L.geoJson(dataVar);
    var newLayer = mapData.addTo(mapVar);
    // map.fitBounds(mapData.getBounds());
    return newLayer;
}; };
var checkOutput = function (_a) {
    var rows = _a[0], column = _a[1];
    console.log(unique(rows.map(function (row) { return row.properties[column]; })));
    console.log(rows.length);
};
var mapInput = function (mapVar, linesInput, stationsInput, layerInput, keyInput) {
    var linesOutput = splitSearch(linesInput.drop, keyInput);
    var stationsOutput = search(stationsInput, keyInput);
    var _ = layerInput !== null ? layerInput.clearLayers()
        : null;
    _ = checkLength(linesOutput.take, loadData(mapVar));
    var newStationsLayer = checkLength(stationsOutput, loadData(mapVar));
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
