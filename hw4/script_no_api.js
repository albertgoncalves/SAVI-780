// $ tslint script_no_api.ts ; tsc script_no_api.ts
// via https://gis.stackexchange.com/questions/243136/geojson-add-and-format-line-features-to-a-leaflet-map
var loadData = function (mapVar, aData) {
    var getColor = function (featIn) {
        return featIn === "0" ? "#38A800"
            : hslToHex(Math.random(), (0.2 * Math.random()) + 0.6, (0.4 * Math.random()) + 0.4);
    };
    var styleLines = function (featureLayer) {
        // console.log(getColor(featureLayer));
        return { color: getColor(featureLayer.properties.rt_symbol),
            lineJoin: "round",
            opacity: (0.5 * Math.random()) + 0.5,
            weight: 10
        };
    };
    var getData = function (aMapVar) { return function (bData) {
        var mapData = L.geoJson(bData, { style: styleLines });
        mapData.addTo(aMapVar);
        aMapVar.fitBounds(mapData.getBounds());
        // console.log(bData);
        // console.log(mapData);
    }; };
    getData(mapVar)(aData);
};
var buttonHtml = function (strInsert) {
    return "<button id=\"button\">" + strInsert + "</button>";
};
var assignInput = function (targetId, content) {
    document.getElementById(targetId).innerHTML = content;
};
var assignButton = function (buttonId, f) {
    document.querySelector(buttonId)
        .addEventListener("click", f);
};
var tileOpt = { maxZoom: 18,
    opacity: 0.5
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
// MAIN
var map = L.map("map", mapOpt).setView(origin, 8);
L.tileLayer(tileUrl, tileOpt).addTo(map);
setTimeout(function () {
    var mapButton = function () {
        assignButton("button", function () { return loadData(map, data); });
    };
    assignInput("input", buttonHtml("Go for it."));
    mapButton();
    assignButton("button", function () {
        assignInput("input", buttonHtml("Keeping going!"));
        mapButton();
    });
}, 500);
