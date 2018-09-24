/* global L */

/* jshint esversion: 6 */
/* jshint -W014 */

const map     = L.map('map').setView([34.03, -82.20], 5);
const tileUrl = 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
const tileOpt = {maxZoom: 18};
const dataUrl = (
    'https://cdn.glitch.com/baade5a3-f979-48f2-9a28-14daee16fab0%2Fmap' +
    '.geojson?1535912286843'
);

L.tileLayer(tileUrl, tileOpt).addTo(map);

const getResp = (response) => response.json();            // this implies the
const getData = (data)     => L.geoJson(data).addTo(map); // values will be
                                                          // returned

fetch(dataUrl)
    .then(getResp)
    .then(getData)
    .catch(
        (e) => {
            console.log(e);
        }
    );

mouseEvents = [ 'mousedown'
              , 'mouseup'
              , 'preclick'
              , 'click'
              , 'dblclick'
              , 'moveend'
              ];

mouseEvents.forEach(
    (event) => map.on(event, () => console.log(event))
);

// key press listener *only* while holding down mouseclick
map.on('keypress', (event) => console.log(event));
