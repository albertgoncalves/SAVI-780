// $ tslint script.ts; tsc script.ts;
// via https://gis.stackexchange.com/questions/243136/geojson-add-and-format-line-features-to-a-leaflet-map
var loadData = function (mapVar, url) {
    var getResp = function (response) { return response.json(); };
    var getColor = function (featIn) {
        return featIn === "0" ? "#38A800"
            : hslToHex(Math.random(), (0.75 * Math.random()) + 0.25, (0.25 * Math.random()) + 0.4);
    };
    var styleLines = function (featureLayer) {
        // console.log(getColor(featureLayer));
        return { color: getColor(featureLayer.properties.rt_symbol),
            lineJoin: "round",
            opacity: (0.2 * Math.random()) + 0.8,
            weight: 10
        };
    };
    var getData = function (aMapVar) { return function (data) {
        var mapData = L.geoJson(data, { style: styleLines });
        mapData.addTo(aMapVar);
        aMapVar.fitBounds(mapData.getBounds());
        console.log(data);
        console.log(mapData);
    }; };
    fetch(url)
        .then(getResp)
        .then(getData(mapVar));
};
var origin = [40.7128,
    -74.0060
];
var tileOpt = { maxZoom: 18,
    opacity: 0.5
};
var tileUrl = ("https://stamen-tiles.a.ssl.fastly.net/toner/"
    + "{z}/{x}/{y}.png");
var dataUrl = ("https://data.cityofnewyork.us/resource/"
    + "s7zz-qmyz.geojson"
    + "?$limit=100");
// MAIN
var map = L.map("map").setView(origin, 5);
L.tileLayer(tileUrl, tileOpt).addTo(map);
loadData(map, dataUrl);
