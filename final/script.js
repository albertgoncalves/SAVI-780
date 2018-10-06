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
    var _ = mapLayer !== null === true ? mapLayer.clearLayers()
        : null;
    var mapData = L.geoJson(dataVar);
    mapLayer = mapData.addTo(mapVar);
    map.fitBounds(mapData.getBounds());
    return mapLayer;
};
var mapInput = function (mapVar, linesInput, sttnsInput, pointsLayerA, input) {
    var linesOutput = splitSearch(linesInput.drop, input);
    var sttnsOutput = search(sttnsInput, input);
    loadData(mapVar, linesOutput.take);
    var newLayer = loadData(mapVar, sttnsOutput, pointsLayerA);
    return [linesOutput, sttnsOutput, newLayer];
};
var cloneObj = function (obj) { return JSON.parse(JSON.stringify(obj)); };
//
// main
//
var map = L.map("map", mapOpt).setView(origin, 10);
L.tileLayer(tileUrl).addTo(map);
var linesMap = cloneObj(lines.features);
var sttnsMap = cloneObj(sttns.features);
var sttnsG = search(sttns.features, "G");
var sttnsGR = search(sttnsG, "R");
var sttnsGRF = search(sttnsGR, "F");
var linesG = splitSearch(lines.features, "G"); // matched rows since
var linesR = splitSearch(linesG.drop, "R"); // they are already
var linesF = splitSearch(linesR.drop, "F"); // on the map!
var pointsLayer = null; // initialize points layer ...
// points need to be cleared after each selection
pointsLayer = loadData(map, sttnsG, pointsLayer);
loadData(map, linesG.take); // mapLayer variable can be ignored for lines ...
// lines search pattern will never duplicate
setTimeout(function () {
    pointsLayer = loadData(map, sttnsGRF, pointsLayer);
    loadData(map, linesR.take);
    loadData(map, linesF.take);
}, 3000);
