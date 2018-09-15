/* global L */

var map = L.map('map').setView([34.03, -82.20], 5);

var tileUrl = 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
var tileOpt = {
    maxZoom: 18
};
var dataUrl = (
    'https://cdn.glitch.com/baade5a3-f979-48f2-9a28-14daee16fab0%2Fmap' +
    '.geojson?1535912286843'
);

L.tileLayer(tileUrl, tileOpt).addTo(map);

fetch(dataUrl)
    .then(
        function(response) {
            return response.json();
        }
    )
    .then(
        function(data) {
            L.geoJson(data).addTo(map);
        }
    );

/*
function getResp(response) {
    return response.json();
}

function getData(data) {
    L.geoJson(data).addTo(map);
}
*/

/*
// This doesn't work.
fetch(dataUrl)
    .then(getResp(response))
    .then(getData(data));
*/

/*
// This does.
fetch(dataUrl)
    .then(
        function(response) {
            return getResp(response);
        }
    )
    .then(
        function(data) {
            getData(data);
        }
    );
*/

// click button mouse down
map.on(
    'mousedown', function () {
        console.log('mousedown');
    }
);

// release mouse button
map.on(
    'mouseup', function () {
        console.log('mouseup');
    }
);

// click button mouse down
map.on(
    'preclick', function () {
        console.log('preclick');
    }
);

map.on(
    'click', function () {
        console.log('click');
    }
);

map.on(
    'dblclick', function () {
        console.log('dblclick');
    }
);

map.on(
    'moveend', function () {
        console.log('moveend');
    }
);

// key press listener while also clicking on the map
map.on(
    'keypress', function (event) {
        console.log(event);
    }
);
