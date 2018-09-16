/* global keys     */
/* global keysFlip */
/* global L        */

/*jshint esversion: 6 */

const randPoint = (bound) => bound - Math.random() * (bound * 2);

const randCoords = () => [randPoint(75), randPoint(180)];

const randomZoom = () => Math.round(Math.random() * 3) + 5;

// note: arrow notation will define this function as if we were returning the
// value 'map.setView(coords, zoom)' -- won't cause any problems here, but keep
// in mind!
const zoomToCoords = (map, coords, zoom) => map.setView(coords, zoom);

const assignInput = (input) =>
    document.getElementById('keys').innerHTML = input;

const boundsDiff = (map, ax) =>
    map.getBounds()._northEast[ax] - map.getBounds()._southWest[ax];

const boundsCntr = (map, ax) =>
    map.getBounds()._northEast[ax] - (boundsDiff(map, ax) / 2);

const adjustAx = (map, ax, val) => boundsDiff(map, ax) * val;

const randPointInView = (currentBounds) => [randPlacement(map, 'lat'),
                                            randPlacement(map, 'lng')];

const addPointToMap = (newPoint, circleOptions, text) =>
    L.circle(newPoint, circleOptions).addTo(map).bindPopup(text);

// https://www.wrld3d.com/wrld.js/latest/docs/leaflet/L.Circle/
const moveMarker = (marker, newPoint, newOpacity) =>
    marker.setLatLng(newPoint)
          .setStyle({fillOpacity: newOpacity, opacity: newOpacity});

const getEdges = (map) => ({northEdge: map.getBounds()._northEast.lat,
                            southEdge: map.getBounds()._southWest.lat,
                            eastEdge:  map.getBounds()._northEast.lng,
                            westEdge:  map.getBounds()._southWest.lng});

function randPlacement(map, ax) {
    let withinBounds =
        ((Math.random() - 0.5) * boundsDiff(map, ax)) * Math.random();

    return boundsCntr(map, ax) + withinBounds;
}

function pointOffscreen(map) {
    let {0: northEdge,
         1: southEdge,
         2: eastEdge,
         3: westEdge} = getEdges(map);

    let xNew = randPoint(90);
    let yNew = randPoint(180);

    while ((xNew >= westEdge) & (xNew <= eastEdge)) {
        xNew = randPoint(90);
    }

    while ((yNew >= southEdge) & (yNew <= northEdge)) {
        yNew = randPoint(180);
    }
    return [xNew, yNew];
}

const empty        = '';
const tileUrl      = 'https://stamen-tiles.a.ssl.fastly.net/watercolor' +
                     '/{z}/{x}/{y}.jpg';
const tileOptions  = {maxZoom:         18};
const mapOptions   = {doubleClickZoom: false,
                      dragging:        false,
                      keyboard:        false,
                      touchZoom:       false,
                      scrollWheelZoom: false,
                      tap:             false,
                      zoomControl:     false};

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
            let newX = x + adjustAx(map, 'lat', 0.25);
            coords = [newX > 90 ? 90 : newX, y];

        } else if (crntWrd == 'down') {
            let {0: x, 1: y} = coords;
            let newX = x - adjustAx(map, 'lat', 0.25);
            coords = [newX < -90 ? -90 : newX, y];

        } else if (crntWrd == 'left') {
            let {0: x, 1: y} = coords;
            let newY = y - adjustAx(map, 'lng', 0.20);
            coords = [x, newY];

        } else if (crntWrd == 'right') {
            let {0: x, 1: y} = coords;
            let newY = y + adjustAx(map, 'lng', 0.20);
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

var circleOptions = {color:      '#f03',
                     fillColor:  '#f03',
                     fillOpacity: 0.1,
                     radius:      50000};

assignInput(empty);

L.tileLayer(tileUrl, tileOptions).addTo(map);

var markerPos = randPointInView(map.getBounds());
var markerEnd = [80, 1000];
var marker    = addPointToMap(markerPos,
                              circleOptions,
                              "You'll never catch me!");

function runAway(markerFrom, markerTo) {
    let {0: xFrom, 1: yFrom} = markerFrom;
    let {0: xTo,   1: yTo  } = markerTo;

    let xPath = xTo - xFrom;
    let yPath = yTo - yFrom;

    let xNew = xFrom + (xPath * Math.random() * 0.001) + 0.0025;
    let yNew = yFrom + (yPath * Math.random() * 0.001) + 0.0025;

    return [xNew, yNew];
}

// const speed = 10000;
const speed = 50;
// const speed = 10;

setInterval(
    function() {
        let currentBounds = map.getBounds();
        let newOpacity = 0.1;
        // markerPos = runAway(markerPos, markerEnd);
        marker    = moveMarker(marker, markerPos, measureGap(map, markerPos));
    }, speed
);

setInterval(
    function() {
        markerEnd = pointOffscreen(map);
        // console.log([boundsCntr(map, 'lat'), boundsCntr(map, 'lng')]);
        // console.log(markerEnd);
    }, 1000
);

function measureGap(map, markerPos) {
    let {0: latPos, 1: lngPos} = markerPos;

    latBounds = boundsDiff(map, 'lat');
    lngBounds = boundsDiff(map, 'lng');
    latCntr = boundsCntr(map, 'lat');
    lngCntr = boundsCntr(map, 'lng');

    latRatio = Math.abs(latPos - latCntr) / (latBounds);
    lngRatio = Math.abs(lngPos - lngCntr) / (lngBounds);

    let gapRatio = 0.1;

    if (latRatio + lngRatio < 2) {
        gapRatio = (latRatio + lngRatio) / 2 + 0.325;
    }

    if (gapRatio < 0.05) {
        gapRatio = 0.05;
    } else if (gapRatio > 1) {
        gapRatio = 1;
    }

    return gapRatio;
}