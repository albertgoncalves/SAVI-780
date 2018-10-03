/* global L */

/* jshint esversion: 6 */
/* jshint -W014 */

const onMapClick = (map) => (e) => {
    const popup = L.popup();
	popup.setLatLng(e.latlng)
		 .setContent("Sunset at " + L.sun.sunset(e.latlng))
		 .openOn(map);
};

const origin  = [-37.82, 175.22];
const map     = L.map('map').setView(origin, 13);
const tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
const dataUrl = ( 'https://cdn.glitch.com'
                + '/baade5a3-f979-48f2-9a28-14daee16fab0%2Fmap'
                + '.geojson?1535912286843'
                );

L.tileLayer(tileUrl).addTo(map);
L.Control.geocoder().addTo(map);

let markers = L.markerClusterGroup();

for (let i = 0; i < addressPoints.length; i++) {
	let a      = addressPoints[i];
	let title  = a[2];
	let marker = L.marker( new L.LatLng(a[0], a[1])
                         , {title: title}
                         );
	marker.bindPopup(title);
	markers.addLayer(marker);
}

// MAIN

map.addLayer(markers);
map.on('click', onMapClick(map));
