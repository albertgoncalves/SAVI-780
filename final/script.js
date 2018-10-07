// tslint script.ts; tsc script.ts;
// interface MapOpts { doubleClickZoom: boolean;
//                     dragging       : boolean;
//                     keyboard       : boolean;
//                     scrollWheelZoom: boolean;
//                     tap            : boolean;
//                     touchZoom      : boolean;
//                     zoomControl    : boolean;
//                   }
var tileUrl = ("https://stamen-tiles.a.ssl.fastly.net/toner/"
    + "{z}/{x}/{y}.png");
var origin = [40.7128,
    -74.0060
];
// const mapOpt : MapOpts  = { doubleClickZoom: false
//                           , dragging       : false
//                           , keyboard       : false
//                           , scrollWheelZoom: false
//                           , tap            : false
//                           , touchZoom      : false
//                           , zoomControl    : false
//                           };
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
var loadData = function (mapVar, dataVar, mapLayer) {
    if (mapLayer === void 0) { mapLayer = null; }
    mapLayer = clearLayer(mapLayer);
    var mapData = L.geoJson(dataVar);
    mapLayer = mapData.addTo(mapVar);
    map.fitBounds(mapData.getBounds());
    return mapLayer;
};
var clearLayer = function (pointsLayerB) {
    return pointsLayerB !== null === true ? pointsLayerB.clearLayers()
        : null;
};
var mapInput = function (mapVar, linesInput, sttnsInput, pointsLayerA, input) {
    var linesOutput = splitSearch(linesInput.drop, input);
    var sttnsOutput = search(sttnsInput, input);
    var _ = linesOutput.take.length > 0 ? loadData(mapVar, linesOutput.take)
        : null; // pass
    var newLayer = sttnsOutput.length > 0 ? loadData(mapVar, sttnsOutput, pointsLayerA)
        : clearLayer(pointsLayerA);
    return [linesOutput, sttnsOutput, newLayer];
};
var cloneObj = function (obj) { return JSON.parse(JSON.stringify(obj)); };
var initLines = function (linesObj) {
    return ({ take: [], drop: linesObj });
};
//
// main
//
// const map = L.map("map", mapOpt).setView(origin, 10);
var map = L.map("map").setView(origin, 10);
L.tileLayer(tileUrl).addTo(map);
var linesMap = cloneObj(initLines(lines.features));
var sttnsMap = cloneObj(sttns.features);
var pointsLayer = null;
var runSelection = function (selection) {
    var _a;
    _a = mapInput(map, linesMap, sttnsMap, pointsLayer, selection), linesMap = _a[0], sttnsMap = _a[1], pointsLayer = _a[2];
};
["G"].forEach(runSelection);
