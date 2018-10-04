/* global L */

/* jshint esversion: 6 */
/* jshint -W014 */

const onMapClick = (map) => (e) => {
    const popup = L.popup();
	popup.setLatLng(e.latlng)
		 .setContent("Sunset at " + L.sun.sunset(e.latlng))
		 .openOn(map);
};

const stylePopup = (title) => {
    const context  = { name        : ( "Private Room for two w/ Easy commute"
                                     + "to City"
                                     )
                     , id          : 20286700
                     , room_type   : "Private room"
                     , neighborhood: "Elmhurst"
                     , city        : "Elmhurst"
                     , state       : "NY"
                     , title       : title
                     };
    return context;
};

const origin  = [-37.82, 175.22];
const map     = L.map("map").setView(origin, 16);
const tileUrl = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";

L.tileLayer(tileUrl).addTo(map);
L.Control.geocoder().addTo(map);

// MAIN

const template = document.querySelector(".listing-template").innerHTML;
const markers  = L.markerClusterGroup();

for (const i in addressPoints) {
	const a      = addressPoints[i];
	const title  = a[2];
	const marker = L.marker( new L.LatLng(a[0], a[1])
                           // , {title: title}
                           );

    const filledTemplate = Mustache.render(template, stylePopup(title));

    // console.log(title);
    // console.log(filledTemplate);
    // document.querySelector(".filled-template-area").innerHTML = filledTemplate;

    marker.bindPopup(filledTemplate);
	markers.addLayer(marker);
}

map.addLayer(markers);
map.on("click", onMapClick(map));
