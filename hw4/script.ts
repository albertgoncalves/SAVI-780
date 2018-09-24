declare var L: any;

interface TileOptions {
    maxZoom: number;
}

// via https://gist.github.com/mjackson/5311256

const hslToRgb = (h: number, s: number, l: number): number[] => {
    if (s === 0) {
        // r = g = b = l; // achromatic
        return [l, l, l];
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        const r = hue2rgb(p, q, h + (1 / 3));
        const g = hue2rgb(p, q, h);
        const b = hue2rgb(p, q, h - (1 / 3));

        return [r * 255, g * 255, b * 255];
    }
};

const hue2rgb = (p: number, q: number, t: number): number => {
    const tt = t < 0 ? t + 1
                     : t > 1 ? t - 1
                             : t;

    return tt < (1 / 6) ? p + (q - p) * 6 * tt
         : tt < (1 / 2) ? q
         : tt < (2 / 3) ? p + (q - p) * ((2 / 3) - tt) * 6
         : p;
};

const rgbToHex = (rgb: number): string => {
    const hex  = Number(rgb).toString(16);
    return hex.length < 2 ? "0" + hex
                          : hex;
};

const fullColorHex = (r: number, g: number, b: number): string => {
    const red   = rgbToHex(Math.floor(r));
    const green = rgbToHex(Math.floor(g));
    const blue  = rgbToHex(Math.floor(b));
    return "#" + red + green + blue;
};

const applyHslToHex = (h: number, s: number, l: number): string => {
    const [r, g, b] = hslToRgb(h, s, l);
    return fullColorHex(r, g, b);
};

const getColor = (featIn: string): string => {
    return featIn === "G" ? "#38A800"
                          : applyHslToHex( Math.random()
                                         , Math.random()
                                         , Math.random()
                                         );
};

// via https://gis.stackexchange.com/questions/243136/geojson-add-and-format-line-features-to-a-leaflet-map

const styleLines = (featureLayer): object => {
    // console.log(getColor(featureLayer));
    return { color  : getColor(featureLayer.properties.rt_symbol)
           , opacity: (0.5 * Math.random()) + 0.5
           , weight : 20
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

const loadData = (url: string) => {
    fetch(url)
        .then(getResp)
        .then(getData (map));
};

const origin : number[] = [40.7128, -74.0060];
const tileOpt: object   = {maxZoom: 18} as TileOptions;
const tileUrl: string   = ( "https://stamen-tiles.a.ssl.fastly.net/toner/"
                          + "{z}/{x}/{y}.png"
                          );
const dataUrl: string   = ( "https://data.cityofnewyork.us/resource/"
                          + "s7zz-qmyz.geojson"
                          + "?$limit=65"
                          );

const map = L.map("map").setView(origin, 5);

// MAIN

L.tileLayer(tileUrl, tileOpt).addTo(map);
loadData(dataUrl);
