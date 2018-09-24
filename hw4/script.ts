// $ tslint script.ts ; tsc script.ts

declare var L: any;

interface TileOptions {
    maxZoom: number;
    opacity: number;
}

// via https://gist.github.com/mjackson/5311256

const hslToRgb = (h: number, s: number, l: number): number[] => {
    const hslHelper = (hh: number , ss: number , ll: number ): number[] => {
        const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
        const p = 2 * ll - q;

        const r = hue2rgb(p, q, hh + (1 / 3));
        const g = hue2rgb(p, q, hh);
        const b = hue2rgb(p, q, hh - (1 / 3));

        return [r, g, b].map((x) => x * 255);
    };

    return s === 0 ? [l, l, l]
                   : hslHelper(h, s, l);
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
    const  hex = Number(rgb).toString(16);
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
    return featIn === "0" ? "#38A800"
                          : applyHslToHex( Math.random()
                                         , Math.random()
                                         , Math.random()
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

const origin : number[] = [40.7128, -74.0060];
const tileOpt: object   = { maxZoom: 18
                          , opacity: 0.5
                          } as TileOptions;
const tileUrl: string   = ( "https://stamen-tiles.a.ssl.fastly.net/toner/"
                          + "{z}/{x}/{y}.png"
                          );
// const tileUrl: string   = ( "https://b.tiles.mapbox.com/v4/mapbox.pencil/"
//                           + "{z}/{x}/{y}.png?access_token="
//                           + "pk.eyJ1IjoienZlcmlrIiwiYSI6IjVLMGxwbGsifQ."
//                           + "pdb83NbjTrfl9ibbdjPSsg"
//                           );
const dataUrl: string   = ( "https://data.cityofnewyork.us/resource/"
                          + "s7zz-qmyz.geojson"
                          + "?$limit=100"
                          );

const map = L.map("map").setView(origin, 5);

// MAIN

L.tileLayer(tileUrl, tileOpt).addTo(map);
loadData(map, dataUrl);
