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

// function assignKeywd(keyword) {
//     document.getElementById('keyword').innerHTML = keyword;
// }

function latDiff(map) {
    return map.getBounds()._northEast.lat - map.getBounds()._southWest.lat;
}

function lngDiff(map) {
    return map.getBounds()._northEast.lng - map.getBounds()._southWest.lng;
}

// const keywords  = ['Yes', 'No'];
// const kwdLower  = keywords.map((kw) => (kw.toLowerCase()));
const empty     = '';
var currentWord = empty;

var coords = randCoords();
// var zoom   = randomZoom();
var zoom = 3;
var mapOptions = {
    doubleClickZoom: false,
    dragging: false,
    keyboard: false,
    touchZoom: false,
    scrollWheelZoom: false,
    tap: false,
    zoomControl: false
};
var map = L.map('map', mapOptions).setView(coords, zoom);
var tileOptions = {maxZoom: 18};
var tileUrl =
    'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg';

window.onkeydown = function(e) {
    let keyCode = e.keyCode ? e.keyCode : e.which;
    let key = keysFlip[keyCode];

    if (key === 'enter') {
        // if (kwdLower.indexOf(currentWord) >= 0) {
        // //     assignKeywd('match found!');
        // //     currentWord = empty;
        // } else if (currentWord == 'random') {
        if (currentWord == 'random') {
            coords = randCoords();
            zoomToCoords(map, coords, zoom);

        } else if (currentWord == 'up') {
            let {0: x, 1: y} = coords;
            let new_x = x + latDiff(map) * 0.25;
            coords = [new_x > 90 ? 90 : new_x, y];
            map.setView(coords, zoom);

        } else if (currentWord == 'down') {
            let {0: x, 1: y} = coords;
            let new_x = x - latDiff(map) * 0.25;
            coords = [new_x < -90 ? -90 : new_x, y];
            map.setView(coords, zoom);

        } else if (currentWord == 'left') {
            let {0: x, 1: y} = coords;
            let new_y = y - lngDiff(map) * 0.20;
            coords = [x, new_y];
            map.setView(coords, zoom);

        } else if (currentWord == 'right') {
            let {0: x, 1: y} = coords;
            let new_y = y + lngDiff(map) * 0.20;
            coords = [x, new_y];
            map.setView(coords, zoom);

        } else if (currentWord == 'in') {
            let newZoom = zoom + 1;
            zoom = newZoom > tileOptions.maxZoom ? tileOptions.maxZoom
                                                 : newZoom;
            map.setView(coords, zoom);
            // console.log(zoom);

        } else if (currentWord == 'out') {
            let newZoom = zoom - 1;
            zoom = newZoom < 0 ? 0
                               : newZoom;
            map.setView(coords, zoom);
            // console.log(zoom);
        }

    } else if (key === 'space') {
        // assignKeywd(empty);
        currentWord += ' ';
        assignInput(currentWord);

    } else if ((key === 'backspace') ||
               (key === 'delete')    ||
               (key === 'esc')) {
        // assignKeywd(empty);
        currentWord = empty;
        assignInput(currentWord);

    } else if (key.length > 1) {
        // pass

    } else if (currentWord.length > 20) {
        currentWord = empty;

    } else {
        // assignKeywd(empty);
        currentWord += key;
        assignInput(currentWord);
    }
};

assignInput(empty);
// assignKeywd(empty);

L.tileLayer(tileUrl, tileOptions).addTo(map);
