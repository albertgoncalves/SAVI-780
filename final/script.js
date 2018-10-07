// tslint script.ts; tsc script.ts;
var tileUrl = ("https://stamen-tiles.a.ssl.fastly.net/toner/"
    + "{z}/{x}/{y}.png");
var origin = [40.7128,
    -74.0060
];
var mapOpt = { doubleClickZoom: false,
    dragging: false,
    keyboard: false,
    scrollWheelZoom: false,
    tap: false,
    touchZoom: false,
    zoomControl: false
};
//
// shared utility functions
//
var contains = function (mainString) { return function (subString) {
    return mainString.indexOf(subString) >= 0 ? true
        : false;
}; };
var dashes = function (str) { return "-" + str + "-"; };
var checkField = function (searchTerm, field) {
    return function (row) {
        var column = row.properties[field];
        return contains(column)(dashes(searchTerm));
    };
};
var cloneObj = function (obj) { return JSON.parse(JSON.stringify(obj)); };
var initLines = function (linesObj) { return ({ take: [], drop: linesObj }); };
var unique = function (myArray) {
    return (myArray.filter(function (v, i, a) { return a.indexOf(v) === i; }));
};
var checkLength = function (myArray, f) { return myArray.length > 0 ? f(myArray)
    : null; };
//
// station search pattern
//
var search = function (featureArray, searchTerm) {
    return featureArray.filter(checkField(searchTerm, "line"));
};
//
// line search pattern
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
    _ = layerInput !== null ? layerInput.clearLayers()
        : null;
    var newLayer = checkLength(stationsOutput, loadData(mapVar));
    _ = checkLength(linesOutput.take, loadData(mapVar));
    [[linesOutput.take, "name"],
        [stationsOutput, "line"]
    ].forEach(checkOutput);
    return [linesOutput, stationsOutput, newLayer];
};
//
// main
//
// const map = L.map("map", mapOpt).setView(origin, 12);
var map = L.map("map").setView(origin, 12);
L.tileLayer(tileUrl).addTo(map);
lines = cloneObj(initLines(lines.features));
stations = cloneObj(stations.features);
var _;
var stationsLayer = null;
var runSelection = function (selection) {
    var _a;
    _a = mapInput(map, lines, stations, stationsLayer, selection), lines = _a[0], stations = _a[1], stationsLayer = _a[2];
};
["G", "R", "F"].forEach(runSelection);
// location.reload();
