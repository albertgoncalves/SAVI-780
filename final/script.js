// tslint script.ts; tsc script.ts;
//
// variables
//
var tileUrl = ("https://b.basemaps.cartocdn.com/dark_all"
    + "/{z}/{x}/{y}.jpg");
var tileOpts = { opacity: 0.775
};
var origin = [40.740,
    -73.925
];
var mapOpts = { keyboard: false
};
var southWest = [40.525, -74.20];
var northEast = [40.975, -73.65];
var bounds = L.latLngBounds(southWest, northEast);
var boundOpts = { animate: false
};
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
//
// shared utility functions
//
var arrayToStr = function (array) { return array.map(function (x) { return x.toString(); }); };
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
var funIfLength = function (myArray, f) { return myArray.length > 0 ? f(myArray)
    : null; };
var smudge = function (colorVal) {
    var newVal = ((colorVal * 0.195) * (Math.random() - 0.5)) + colorVal;
    return newVal < 0 ? "0"
        : newVal.toString();
};
var arrayToHsl = function (_a) {
    var h = _a[0], s = _a[1], l = _a[2];
    return "hsl(" + h + ", " + s + "%, " + l + "%)";
};
var randBetween = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};
var randomHsl = function () {
    var h = randBetween(0, 359);
    var s = randBetween(50, 100);
    var l = randBetween(40, 80);
    return arrayToHsl(arrayToStr([h, s, l]));
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
// geojson loader (and stylist)
//
var mapInput = function (mapVar, linesInput, stationsInput, layerInput, keyInput) {
    var loadData = function (style) { return function (dataVar) {
        var mapData = L.geoJson(dataVar, style);
        var newLayer = mapData.addTo(mapVar);
        // map.fitBounds(mapData.getBounds());
        return newLayer;
    }; };
    var dataToMap = function (dataVar, styleInput) {
        return funIfLength(dataVar, loadData(styleInput));
    };
    var markerToCircle = function () {
        var pointToCircle = function (geoJsonPoint, latlng) { return L.circleMarker(latlng); };
        return { pointToLayer: pointToCircle,
            style: styleCircle()
        };
    };
    var styleCircle = function () { return function (geoJsonFeature) {
        return { radius: 10,
            fillColor: randomHsl(),
            fillOpacity: 0.575,
            stroke: false
        };
    }; };
    var styleLine = function (color) {
        return { style: { color: color },
            weight: 5
        };
    };
    var linesOutput = splitSearch(linesInput.drop, keyInput);
    var stationsOutput = search(stationsInput, keyInput);
    var _ = layerInput !== null ? layerInput.clearLayers()
        : null;
    var lineColor = arrayToHsl(colorMap[keyInput].map(smudge));
    _ = dataToMap(linesOutput.take, styleLine(lineColor));
    var newStations = dataToMap(stationsOutput, markerToCircle());
    //
    // check if the machine is working correctly...
    //
    // const checkOutput = ([rows, column]) => {
    //     console.log(unique(rows.map((row) => row.properties[column])));
    //     console.log(rows.length);
    // };
    // [ [linesOutput.take, "name"] as any
    // , [stationsOutput  , "line"] as any
    // ].forEach(checkOutput);
    return [linesOutput, stationsOutput, newStations];
};
//
// side effects! ...this makes things much easier
//
var selectStop = function (selection) {
    var _a;
    _a = mapInput(map, lines, stations, stationsLayer, selection), lines = _a[0], stations = _a[1], stationsLayer = _a[2];
};
//
// main
//
var refresh = function () { return location.reload(); };
var checkKey = function (keyStroke) {
    return contains(Object.keys(keysToStops).join(", "))(keyStroke.toString());
};
var allStops = arrayToStr(Object.keys(colorMap));
var keysToStops = allStops.reduce(function (obj, stop) {
    obj[keyInputs[stop.toLowerCase()]] = stop;
    return obj;
}, {});
var map = L.map("map", mapOpts).setView(origin, 11);
L.tileLayer(tileUrl, tileOpts).addTo(map);
map.setMaxBounds(bounds);
map.on("drag", function () { return map.panInsideBounds(bounds, boundOpts); });
lines = initLines(lines.features);
stations = stations.features;
var stationsLayer = null;
window.onkeydown = function (e) {
    return e.keyCode
        ? checkKey(e.keyCode)
            ? selectStop(keysToStops[e.keyCode])
            : e.keyCode === 27 ? refresh()
                : e.keyCode === 89 ? map.setView(origin, 11)
                    : null
        : null;
};
//
// demo
//
// ["G", "R", "F"].forEach(selectStop);
