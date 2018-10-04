/* global L */
/* turf     */

/* jshint esversion: 6 */
/* jshint -W014 */

const map     = L.map('map').setView([40.690, -73.967], 15);
const tileOpt = {maxZoom: 18};
const tileUrl = 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
const dataUrl = ( 'https://cdn.glitch.com/03830164-a70e-47de-a9a1-'
                + 'ad757904d618%2Fpratt-collisions.geojson?1538625759015'
                );

const getResp = (response) => response.json();
const getData = (data)     => {
    [turf.convex, turf.center, turf.centerOfMass, turf.centroid].forEach(
        (f) => L.geoJson(f(data)).addTo(map)
    );
};

L.tileLayer(tileUrl, tileOpt).addTo(map);

fetch(dataUrl)
    .then(getResp)
    .then(getData);
