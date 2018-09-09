/* global L */

function randPoint(bound) {
    return Math.round(bound - (Math.random() * (bound * 2)), 6);
}

function randCoords() {
    return [randPoint(75), randPoint(180)];
}

function zoomToCoords(map, coordsArray) {
    map.setView(coordsArray, randomZoom());
}

function randomZoom() {
    return Math.round(Math.random() * 3, 4) + 4;
}

// function loadData(map, fetchUrl) {
//     fetch(fetchUrl)
//         .then(
//             function(response) {
//                 return response.json();
//             }
//         )
//         .then(
//             function(data) {
//                 L.geoJson(data).addTo(map);
//             }
//         );
// }

function getCurrentBounds(map) {
    return map.getBounds();
}

function randDiff(center, diff, mod) {
    return center + (((Math.random() - 0.5) * diff) * mod);
}

function randPointInView(currentBounds) {
    var northLat = currentBounds._northEast.lat;
    var southLat = currentBounds._southWest.lat;
    var eastLng = currentBounds._northEast.lng;
    var westLng = currentBounds._southWest.lng;

    var latDiff = northLat - southLat;
    var lngDiff = eastLng - westLng;

    var centerLat = northLat - (latDiff / 2);
    var centerLng = eastLng - (lngDiff / 2);

    var newLat = randDiff(centerLat, latDiff, Math.random());
    var newLng = randDiff(centerLng, lngDiff, Math.random());

    return [newLat, newLng];
}

function addPointToMap(newPoint, observations) {
    return L.marker(newPoint).addTo(map)
            .bindPopup(randomObservation(observations));
}

function moveMarker(marker, newPoint, observations) {
    return marker.setLatLng(newPoint)
                 .bindPopup(randomObservation(observations));
}

function randomObservation(observations) {
    return observations[Math.floor(Math.random() * observations.length)];
}

// if __name__ == '__main__':
// ...more or less

var observations = [
    'This is... <em>somewhere</em>.',

    'I think I was here once.',

    'This area is often referred to as...<br>' +
    'what was it again?',

    '<strong>Very</strong> important things<br>' +
    'happening here!',

    'I think this is<br>' +
    '<strong>New York City</strong>?',

    '<strong>Russia</strong>, for sure.',

    'Without a doubt, this is<br>' +
    '<strong>Alaska</strong>.',

    'Lorem ipsum, <br>' +
    'cantabile, <br>' +
    '... mirabile.',

    'High quality map-making!',

    'Look, <em>most</em> of the information<br>' +
    'is accurate.',

    'Is this marker even<br>' +
    'pointing to land?',

    'This is probably...<br>' +
    '<strong>Finlandia</strong>?',

    'These are pretty tiles.',

    "Isn't there an important bridge<br>somewhere around here?",

    'Hello! Bom dia! Willkommen!',

    'Some of these are just filler.<br>' +
    'You know how it goes.'
    ];

var coords = randCoords();
var mapOptions = {
    dragging: false,
    zoomControl: false
};
var map = L.map('map', mapOptions).setView(coords, randomZoom());
// var map = L.map('map', mapOptions).setView([40, -74], randomZoom());
var tileOptions = {maxZoom: 18};
var tileUrl = 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg';

L.tileLayer(tileUrl, tileOptions).addTo(map);

var currentBounds = getCurrentBounds(map);

var marker1 = addPointToMap(randPointInView(currentBounds), observations);
var marker2 = addPointToMap(randPointInView(currentBounds), observations);
var marker3 = addPointToMap(randPointInView(currentBounds), observations);
var marker4 = addPointToMap(randPointInView(currentBounds), observations);
var marker5 =
    addPointToMap(randPointInView(currentBounds), observations).openPopup();

// var fetchUrlPoints =
//     'https://data.cityofnewyork.us/resource/x9rb-8qrt.geojson';
// var fetchUrlPolygons =
//     'https://data.cityofnewyork.us/resource/cuae-wd7h.geojson';

// loadData(map, fetchUrlPoints);
// loadData(map, fetchUrlPolygons);

setInterval(
    function() {
        coords = randCoords();
        zoomToCoords(map, coords);
        currentBounds = getCurrentBounds(map);
        marker1 = moveMarker(
            marker1, randPointInView(currentBounds), observations
        );
        marker2 = moveMarker(
            marker2, randPointInView(currentBounds), observations
        );
        marker3 = moveMarker(
            marker3, randPointInView(currentBounds), observations
        );
        marker4 = moveMarker(
            marker4, randPointInView(currentBounds), observations
        );
        marker5 = moveMarker(
            marker5, randPointInView(currentBounds), observations
        ).openPopup();
        // console.log(getCurrentBounds(map));
        // console.log(point);
    }, 6000
);
