/* global L */

/* jshint esversion: 6 */

const getResp    = (response) => response.json();
const rowToPopup = (layer)    => layer.feature.properties.complaint_type;
const loadData   = (borough)  => {
    let fullUrl  = dataUrl + '?borough=' + borough + params;

    fetch(fullUrl)
        .then(getResp)
        .then(getData);
};
const getData    = (data)     => {
    let complaintData = L.geoJson(data);
    let _ = complaintLayer !== null ? complaintLayer.clearLayers()
                                    : null;

    complaintData.bindPopup(rowToPopup);
    complaintLayer = complaintData.addTo(map);
    map.fitBounds(complaintData.getBounds());
};

const map     =   L.map('map').setView([34.03, -82.20], 5);
const tileUrl =  'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
const tileOpt =  {maxZoom: 18};
const dataUrl =  'https://data.cityofnewyork.us/resource/fhrw-4uyv.geojson';
const params  = ('&complaint_type=Smoking'             +
                 "&$where=created_date > '2017-01-30'" +
                 'and latitude is not null'            +
                 '&$limit=20');
const buttons = {'.load-data-brooklyn': 'BROOKLYN',
                 '.load-data-queens'  : 'QUEENS'};

// MAIN

var complaintLayer = null;

L.tileLayer(tileUrl, tileOpt).addTo(map);

Object.keys(buttons).forEach(
    (button) => {
        document.querySelector(button)
                .addEventListener('click', () => loadData(buttons[button]));
    }
);
