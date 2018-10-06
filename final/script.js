// tslint script.ts ; tsc script.ts
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
var search = function (featureArray, field) {
    return function (searchTerm) {
        return featureArray.filter(checkField(searchTerm, field));
    };
};
var sttnsG = search(sttns.features, "line")("G");
var sttnsGR = search(sttnsG, "line")("R"); // further reduce
var sttnsGRF = search(sttnsGR, "line")("F"); // selected stops
//
// line search pattern
//
var splitSearch = function (featureArray, field) {
    return function (searchTerm) {
        var take = [];
        var drop = [];
        for (var _i = 0, featureArray_1 = featureArray; _i < featureArray_1.length; _i++) {
            var row = featureArray_1[_i];
            checkField(searchTerm, field)(row) ? take.push(row)
                : drop.push(row);
        }
        return { take: take, drop: drop };
    };
};
// no need to search
var linesG = splitSearch(lines.features, "name")("G"); // matched rows since
var linesR = splitSearch(linesG.drop, "name")("R"); // they are already
var linesF = splitSearch(linesR.drop, "name")("F"); // on the map!
//
// test map
//
var loadData = function (mapVar, mapLayer) {
    if (mapLayer === void 0) { mapLayer = null; }
    return function (dataVar) {
        var _ = mapLayer !== null === true ? mapLayer.clearLayers()
            : null;
        var mapData = L.geoJson(dataVar);
        mapLayer = mapData.addTo(mapVar);
        map.fitBounds(mapData.getBounds());
        return mapLayer;
    };
};
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
var map = L.map("map", mapOpt).setView(origin, 10);
L.tileLayer(tileUrl).addTo(map);
var pointsLayer = null; // initialize points layers ...
// points need to be cleared after each reduction
pointsLayer = loadData(map, pointsLayer)(sttnsG);
loadData(map)(linesG.take);
loadData(map)(linesR.take); // mapLayer variable can be ignored ...
// lines, via search pattern, will never overlap
setTimeout(function () {
    pointsLayer = loadData(map, pointsLayer)(sttnsGRF);
    loadData(map)(linesF.take);
}, 3000);
