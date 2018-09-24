// $ tslint script.ts ; tsc script.ts

declare var L: any;

// via https://gist.github.com/mjackson/5311256

const hslToRgb = (h: number, s: number, l: number): number[] => {
    return s === 0 ? [l, l, l]
                   : hslHelper(h, s, l);
};

const hue2rgb = (pqt: number[]): number => {
    const [p, q, t] = pqt;
    const tt = t < 0 ? t + 1
             : t > 1 ? t - 1
                     : t;
    return tt < (1 / 6) ? p + (q - p) * 6 * tt
         : tt < (1 / 2) ? q
         : tt < (2 / 3) ? p + (q - p) * ((2 / 3) - tt) * 6
                        : p;
};

const hslHelper = (hh: number, ss: number, ll: number): number[] => {
    const q   = ll < 0.5 ? ll * (1 + ss)
                         : ll + ss - ll * ss;
    const p   = 2 * ll - q;
    const rgb = [ [p, q, hh + (1 / 3)] // r
                , [p, q, hh          ] // g
                , [p, q, hh - (1 / 3)] // b
                ];
    return rgb.map((x) => hue2rgb(x) * 255);
};

const rgbToHex = (rgb: number): string => {
    const  hex = Number(rgb).toString(16);
    return hex.length < 2 ? "0" + hex
                          : hex;
};

const fullColorHex = (r: number, g: number, b: number): string => {
    const [red, green, blue] = [r, g, b].map((x) => rgbToHex(x));
    return "#" + red + green + blue;
};

const applyHslToHex = (h: number, s: number, l: number): string => {
    const [r, g, b] = hslToRgb(h, s, l).map((x) => Math.floor(x));
    return fullColorHex(r, g, b);
};

const getColor = (featIn: string): string => {
    return featIn === "0" ? "#38A800"
                          : applyHslToHex( Math.random()
                                         , (0.75 * Math.random()) + 0.25
                                         , (0.25 * Math.random()) + 0.4
                                         );
};

// via https://gis.stackexchange.com/questions/243136/geojson-add-and-format-line-features-to-a-leaflet-map

const styleLines = (featureLayer): object => {
    // console.log(getColor(featureLayer));
    return { color    : getColor(featureLayer.properties.rt_symbol)
           , lineJoin : "round"
           , opacity  : (0.2 * Math.random()) + 0.8
           , weight   : 10
           };
};

const getResp = (response): object => response.json();

const getData = (mapVar) => (data: object) => {
    const mapData = L.geoJson(
        data, {style: styleLines}
    );
    mapData.addTo(mapVar);
    mapVar.fitBounds(mapData.getBounds());
    console.log(data);
    console.log(mapData);
};

const loadData = (mapVar, url: string) => {
    fetch(url)
        .then(getResp)
        .then(getData (mapVar));
};

interface TileOptions {
    maxZoom: number;
    opacity: number;
}

const origin : number[]    = [  40.7128
                             , -74.0060
                             ];
const tileOpt: TileOptions = { maxZoom: 18
                             , opacity: 0.5
                             };
const tileUrl: string      = ( "https://stamen-tiles.a.ssl.fastly.net/toner/"
                             + "{z}/{x}/{y}.png"
                             );
const dataUrl: string      = ( "https://data.cityofnewyork.us/resource/"
                             + "s7zz-qmyz.geojson"
                             + "?$limit=100"
                             );

// MAIN

const map = L.map("map").setView(origin, 5);
L.tileLayer(tileUrl, tileOpt).addTo(map);
loadData(map, dataUrl);
