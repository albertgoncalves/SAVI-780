/* global keys     */
/* global keysFlip */
/* global L        */

/* jshint -W104 */
/* jshint -W119 */

function randPoint(bound) {
    return bound - Math.random() * (bound * 2);
}

function randCoords() {
    return [randPoint(75), randPoint(180)];
}

function randomZoom() {
    return Math.round(Math.random() * 3) + 5;
}

function zoomToCoords(map, coordsArray, zoom) {
    map.setView(coordsArray, zoom);
}

function assignInput(input) {
    document.getElementById('keys').innerHTML = input;
}

function boundsDiff(map, ax) {
    return map.getBounds()._northEast[ax] - map.getBounds()._southWest[ax];
}

function boundsCntr(map, ax) {
    return map.getBounds()._northEast[ax] - (boundsDiff(map, ax) / 2);
}

function adjustLat(map) {
    return boundsDiff(map, 'lat') * 0.15;
}

function adjustLng(map) {
    return boundsDiff(map, 'lng') * 0.20;
}

function randPlacement(map, ax) {
    let withinBounds =
        ((Math.random() - 0.5) * boundsDiff(map, ax)) * Math.random();

    return boundsCntr(map, ax) + withinBounds;
}

function randPointInView(currentBounds) {
    return [randPlacement(map, 'lat'),
            randPlacement(map, 'lng')];
}

function addPointToMap(newPoint, cirleOptions, text) {
    return L.circle(newPoint, circleOptions).addTo(map).bindPopup(text);
}

function moveMarker(marker, newPoint) {
    return marker.setLatLng(newPoint);
}

const empty        = '';
const tileUrl      = 'https://stamen-tiles.a.ssl.fastly.net/watercolor' +
                     '/{z}/{x}/{y}.jpg';
const tileOptions  = {maxZoom: 18};
const mapOptions   = {
    doubleClickZoom: false,
    dragging:        false,
    keyboard:        false,
    touchZoom:       false,
    scrollWheelZoom: false,
    tap:             false,
    zoomControl:     false
};

var crntWrd = empty;
var coords  = randCoords();
var zoom    = randomZoom();
var map     = L.map('map', mapOptions).setView(coords, zoom);

window.onkeydown = function(e) {
    let keyCode = e.keyCode ? e.keyCode : e.which;
    let key     = keysFlip[keyCode];

    if (key === 'enter') {
        if (crntWrd == 'random') {
            coords = randCoords();
            zoom   = randomZoom();

        } else if (crntWrd == 'up') {
            let {0: x, 1: y} = coords;
            let newX = x + adjustLat(map);
            coords = [newX > 90 ? 90 : newX, y];

        } else if (crntWrd == 'down') {
            let {0: x, 1: y} = coords;
            let newX = x - adjustLat(map);
            coords = [newX < -90 ? -90 : newX, y];

        } else if (crntWrd == 'left') {
            let {0: x, 1: y} = coords;
            let newY = y - adjustLng(map);
            coords = [x, newY];

        } else if (crntWrd == 'right') {
            let {0: x, 1: y} = coords;
            let newY = y + adjustLng(map);
            coords = [x, newY];

        } else if (crntWrd == 'in') {
            let newZoom = zoom + 1;
            zoom = newZoom > tileOptions.maxZoom ? tileOptions.maxZoom
                                                 : newZoom;
        } else if (crntWrd == 'out') {
            let newZoom = zoom - 1;
            zoom = newZoom < 0 ? 0
                               : newZoom;
        }

        // console.log(coords, zoom);
        map.setView(coords, zoom);

    } else if (key === 'space') {
        crntWrd += ' ';

    } else if ((crntWrd.length > 20) ||
               (key === 'backspace') ||
               (key === 'delete')    ||
               (key === 'esc')) {
        crntWrd = empty;

    } else if (key.length > 1) {
        // pass

    } else {
        crntWrd += key;
    }

    assignInput(crntWrd);
};

var circleOptions = {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.75,
    radius: 50000
};

assignInput(empty);

L.tileLayer(tileUrl, tileOptions).addTo(map);

var markerPos = randPointInView(map.getBounds());
var markerEnd = [80, 1000];
var marker    = addPointToMap(markerPos, "You'll never catch me!");

function runAway(markerFrom, markerTo) {
    let {0: xFrom, 1: yFrom} = markerFrom;
    let {0: xTo,   1: yTo  } = markerTo;

    let xPath = xTo - xFrom;
    let yPath = yTo - yFrom;

    let xNew = xFrom + (xPath * Math.random() * 0.0001);
    let yNew = yFrom + (yPath * Math.random() * 0.0001);

    return [xNew, yNew];
}

const speed = 10000;
// const speed = 50;
// const speed = 10;

setInterval(
    function() {
        let currentBounds = map.getBounds();
        markerPos = runAway(markerPos, markerEnd);
        marker    = moveMarker(marker, markerPos);
    }, speed
);

function pointOffscreen(map) {
    let centerLat = boundsCntr(map, 'lat');
    let centerLng = boundsCntr(map, 'lng');

    let xFlip = centerLat >= 0 ? -1 : 1;
    let xNew = randPoint(90) * xFlip;

    let yFlip = centerLat >= 0 ? -1 : 1;
    let yNew = randPoint(180) * yFlip;

    return [xNew, yNew];
}

setInterval(
    function() {
        markerEnd = pointOffscreen(map);
        // console.log([boundsCntr(map, 'lat'), boundsCntr(map, 'lng')]);
        // console.log(markerEnd);
    }, 10000
);
