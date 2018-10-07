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
var cloneObj = function (obj) { return JSON.parse(JSON.stringify(obj)); };
var initLines = function (linesObj) { return ({ take: [], drop: linesObj }); };
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
var loadData = function (mapVar, dataVar) {
    var mapData = L.geoJson(dataVar);
    var newLayer = mapData.addTo(mapVar);
    map.fitBounds(mapData.getBounds());
    return newLayer;
};
var unique = function (myArray) { return myArray.filter(function (v, i, a) { return a.indexOf(v) === i; }); };
var mapInput = function (mapVar, linesInput, sttnsInput, layerInput, keyInput) {
    var _; // trash collector
    var linesOutput = splitSearch(linesInput.drop, keyInput);
    var sttnsOutput = search(sttnsInput, keyInput);
    // clear existing points
    _ = layerInput !== null ? layerInput.clearLayers()
        : null;
    // load new points, return layer
    var newLayer = sttnsOutput.length > 0 ? loadData(mapVar, sttnsOutput)
        : null;
    // load new lines, layer not needed
    _ = linesOutput.take.length > 0 ? loadData(mapVar, linesOutput.take)
        : null;
    // check output
    [{ rows: linesOutput.take, column: "name" },
        { rows: sttnsOutput, column: "line" }
    ].forEach(function (obj) {
        console.log(unique(obj.rows.map(function (row) { return row.properties[obj.column]; })));
        console.log(obj.rows.length);
    });
    return [linesOutput, sttnsOutput, newLayer];
};
//
// main
//
// const map = L.map("map", mapOpt).setView(origin, 10);
var map = L.map("map").setView(origin, 10);
L.tileLayer(tileUrl).addTo(map);
var linesMap = cloneObj(initLines(lines.features));
var sttnsMap = cloneObj(sttns.features);
var sttnsLayer = null;
var runSelection = function (selection) {
    var _a;
    _a = mapInput(map, linesMap, sttnsMap, sttnsLayer, selection), linesMap = _a[0], sttnsMap = _a[1], sttnsLayer = _a[2];
};
["G", "R", "F"].forEach(runSelection);
