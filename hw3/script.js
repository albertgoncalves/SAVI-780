/* global keys     */
/* global keysFlip */
/* global L        */

/* jshint -W104 */
/* jshint -W119 */

function randPoint(bound) {
    return Math.round(bound - (Math.random() * (bound * 2)), 6);
}

function randCoords() {
    return [randPoint(75), randPoint(180)];
}

function randomZoom() {
    return Math.round(Math.random() * 3, 4) + 4;
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

const empty     = '';
const tileUrl   = 'https://stamen-tiles.a.ssl.fastly.net/watercolor' +
                  '/{z}/{x}/{y}.jpg';

var currentWord = empty;
var coords      = randCoords();
var zoom        = randomZoom();
var tileOptions = {maxZoom: 18};
var mapOptions  = {
    doubleClickZoom: false,
    dragging: false,
    keyboard: false,
    touchZoom: false,
    scrollWheelZoom: false,
    tap: false,
    zoomControl: false
};

function adjustLat(map) {
    return boundsDiff(map, 'lat') * 0.25;
}

function adjustLng(map) {
    return boundsDiff(map, 'lng') * 0.20;
}

var map = L.map('map', mapOptions).setView(coords, zoom);

window.onkeydown = function(e) {
    let keyCode = e.keyCode ? e.keyCode : e.which;
    let key     = keysFlip[keyCode];

    if (key === 'enter') {
        if (currentWord == 'jump') {
            coords = randCoords();
            zoom   = randomZoom();

        } else if (currentWord == 'up') {
            let {0: x, 1: y} = coords;
            let newX = x + adjustLat(map);
            coords = [newX > 90 ? 90 : newX, y];

        } else if (currentWord == 'down') {
            let {0: x, 1: y} = coords;
            let newX = x - adjustLat(map);
            coords = [newX < -90 ? -90 : newX, y];

        } else if (currentWord == 'left') {
            let {0: x, 1: y} = coords;
            let newY = y - adjustLng(map);
            coords = [x, newY];

        } else if (currentWord == 'right') {
            let {0: x, 1: y} = coords;
            let newY = y + adjustLng(map);
            coords = [x, newY];

        } else if (currentWord == 'in') {
            let newZoom = zoom + 1;
            zoom = newZoom > tileOptions.maxZoom ? tileOptions.maxZoom
                                                 : newZoom;
        } else if (currentWord == 'out') {
            let newZoom = zoom - 1;
            zoom = newZoom < 0 ? 0
                               : newZoom;
        }

        map.setView(coords, zoom);

    } else if (key === 'space') {
        currentWord += ' ';

    } else if ((currentWord.length > 20) ||
               (key === 'backspace')     ||
               (key === 'delete')        ||
               (key === 'esc')) {
        currentWord = empty;

    } else if (key.length > 1) {
        // pass

    } else {
        currentWord += key;
    }

    assignInput(currentWord);
};

assignInput(empty);

L.tileLayer(tileUrl, tileOptions).addTo(map);
