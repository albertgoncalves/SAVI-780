declare var L: any;

interface TileOptions {
    maxZoom: number;
}

const rgbToHex = (rgb) => {
    const hex = Number(rgb).toString(16);
    return hex.length < 2 ? "0" + hex
                          : hex;
};

const getColor = (featureLayer) => {
    const featIn: string = featureLayer.properties.rt_symbol;
    return featIn === "G" ? "rbg(0,0,0,1)" // "#FF5500"
                          : "#38A800";
};
const styleLines = (featureLayer) => {
    console.log(getColor(featureLayer));
    return { color  : getColor(featureLayer)
           , opacity: 0.7
           , weight : 10
           };
};
const getResp = (response) => response.json();
const getData = (data)     => {
    const mapData = L.geoJson(
        data, {style: styleLines}
    );
    mapData.addTo(map);
    map.fitBounds(mapData.getBounds());
    console.log(data);
    console.log(mapData);
};
const loadData = (url) => {
    fetch(url)
        .then(getResp)
        .then(getData);
};

const origin: number[] = [40.7128, -74.0060];
const tileOpt: object  = {maxZoom: 18} as TileOptions;
const tileUrl: string  = ( "https://stamen-tiles.a.ssl.fastly.net/toner/"
                         + "{z}/{x}/{y}.png"
                         );
const dataUrl: string  = ( "https://data.cityofnewyork.us/resource/"
                         + "s7zz-qmyz.geojson"
                         + "?$limit=15"
                         );

const map = L.map("map").setView(origin, 5);

// MAIN

L.tileLayer(tileUrl, tileOpt).addTo(map);
loadData(dataUrl);
