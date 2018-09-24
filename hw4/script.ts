declare var L: any;

interface TileOptions {
    maxZoom: number;
}

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
    if (t < 0) {
        t += 1;
    } else if (t > 1) {
        t -= 1;
    }

    if (t < (1 / 6)) {
        return p + (q - p) * 6 * t;
    } else if (t < (1 / 2)) {
        return q;
    } else if (t < (2 / 3)) {
        return p + (q - p) * ((2 / 3) - t) * 6;
    } else {
        return p;
    }
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
    const rgb = hslToRgb(h, s, l);
    // console.log(rgb);
    return fullColorHex(rgb[0], rgb[1], rgb[2]);
};

const getColor = (featureLayer): string => {
    const featIn: string = featureLayer.properties.rt_symbol;
    return featIn === "G" ? "#38A800"
                          : applyHslToHex( Math.random()
                                         , Math.random()
                                         , Math.random()
                                         );
};

const styleLines = (featureLayer) => {
    // console.log(getColor(featureLayer));
    return { color  : getColor(featureLayer)
           , opacity: (0.5 * Math.random()) + 0.5
           , weight : 20
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
    // console.log(mapData);
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
                         + "?$limit=65"
                         );

const map = L.map("map").setView(origin, 5);

// MAIN

L.tileLayer(tileUrl, tileOpt).addTo(map);
loadData(dataUrl);
