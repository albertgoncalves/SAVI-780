// tslint script.ts; tsc script.ts;

declare var keyInputs: any;
declare var L        : any;
declare var lines    : any;
declare var stations : any;

interface Row     { properties: any; // not much type safety here...
                  }

interface Splits  { take: Row[];
                    drop: Row[];
                  }

//
// variables
//
const tileUrl: string   = ( "https://stamen-tiles.a.ssl.fastly.net/toner/"
                          + "{z}/{x}/{y}.png"
                          );
const origin : number[] = [  40.741
                          , -73.925
                          ];
// const mapOpt            = { doubleClickZoom: false
//                           , dragging       : false
//                           , keyboard       : false
//                           , scrollWheelZoom: false
//                           , tap            : false
//                           , touchZoom      : false
//                           , zoomControl    : false
//                           };

const colorMap    = { 1: [  0, 80, 50]
                    , 2: [  0, 80, 50]
                    , 3: [  0, 80, 50]
                    , 4: [120, 60, 40]
                    , 5: [120, 60, 40]
                    , 6: [120, 60, 40]
                    , 7: [295, 55, 40]
                    , A: [240, 55, 40]
                    , C: [240, 55, 40]
                    , E: [240, 55, 40]
                    , B: [ 30, 80, 50]
                    , D: [ 30, 80, 50]
                    , F: [ 30, 80, 50]
                    , M: [ 30, 80, 50]
                    , G: [100, 80, 55]
                    , J: [ 35, 50, 40]
                    , Z: [ 35, 50, 40]
                    , L: [  0,  0, 35]
                    , N: [ 55, 90, 50]
                    , Q: [ 55, 90, 50]
                    , R: [ 55, 90, 50]
                    , W: [ 55, 90, 50]
                    , S: [  0,  0, 40]
                    };
const allStops    = Object.keys(colorMap).map((x) => x.toString());
const keysToStops = allStops.reduce(
    (obj, stop) => {
        obj[keyInputs[stop.toLowerCase()]] = stop;
        return obj;
    }, {}
);

//
// shared utility functions
//
const contains    = (mainString: string) => (subString: string): boolean => {
    return mainString.indexOf(subString) < 0 ? false
                                             : true;
};
const dashes      = (str: string): string => `-${str}-`;
const checkField  = (searchTerm: string, field: string) =>
                    (row: Row): boolean => {
    const column: string = row.properties[field];
    return contains(column)(dashes(searchTerm));
};
const initLines   = (linesObj)   => ({take: [], drop: linesObj});
const unique      = (myArray)    => {
    return (myArray.filter((v, i, a) => a.indexOf(v) === i));
};
const funIfLength = (myArray, f) => myArray.length > 0 ? f(myArray)
                                                       : null;
const smudge      = (colorVal)   => {
    const  newVal = ((colorVal * 0.19) * (Math.random() - 0.5)) + colorVal;
    return newVal < 0 ? "0"
                      : newVal.toString();
};
const arrayToHsl  = ([h, s, l])  => {
    const [hh, ss, ll] = [h, s, l].map(smudge);
    return `hsl(${hh}, ${ss}%, ${ll}%)`;
};

//
// station search pattern
//
const search = (featureArray: Row[], searchTerm: string): Row[] => {
    return featureArray.filter(checkField(searchTerm, "line"));
};

//
// lines search pattern
//
const splitSearch = (featureArray: Row[], searchTerm: string): Splits => {
    const take = [] as Row[];
    const drop = [] as Row[];
    for (const row of featureArray) {
        checkField(searchTerm, "name")(row) ? take.push(row)
                                            : drop.push(row);
    }
    return {take, drop};
};

//
// geojson loader (and stylist)
//
const mapInput = (mapVar, linesInput, stationsInput, layerInput, keyInput) => {

    const loadData = (style) => (dataVar) => {
        const mapData  = L.geoJson(dataVar, style);
        const newLayer = mapData.addTo(mapVar);
        // map.fitBounds(mapData.getBounds());

        return newLayer;
    };

    const dataToMap = (dataVar, styleInput) => {
        return funIfLength(dataVar, loadData(styleInput));
    };

    const markerToCircle = (color) => {
        const pointToCircle = (geoJsonPoint, latlng) => L.circleMarker(latlng);

        return { pointToLayer: pointToCircle
               , style       : styleCircle(color)
               };
    };

    const styleCircle   = (color) => (geoJsonFeature) => {
        return { fillColor  : color
               , radius     : 6
               , fillOpacity: 0.5
               , color      : "black"
               , weight     : 2
               , stroke     : true
               };
    };

    const styleLine = (color) => {
        return { style : {color}
               , weight: 5
               };
    };

    const linesOutput    = splitSearch(linesInput.drop, keyInput);
    const stationsOutput = search(stationsInput       , keyInput);

    let _ = layerInput !== null ? layerInput.clearLayers()
                                : null;

    const lineColor = arrayToHsl(colorMap[keyInput]);

    _                 = dataToMap(linesOutput.take, styleLine(lineColor)     );
    const newStations = dataToMap(stationsOutput  , markerToCircle(lineColor));

    //
    // check if the machine is working correctly...
    //
    const checkOutput = ([rows, column]) => {
        console.log(unique(rows.map((row) => row.properties[column])));
        console.log(rows.length);
    };
    [ [linesOutput.take, "name"] as any
    , [stationsOutput  , "line"] as any
    ].forEach(checkOutput);

    return [linesOutput, stationsOutput, newStations];
};

//
// side effects! ...this makes things much easier
//
const selectStop = (selection) => {
    [lines, stations, stationsLayer] = mapInput( map
                                               , lines
                                               , stations
                                               , stationsLayer
                                               , selection
                                               );
};

//
// main
//
const refresh  = ()           => location.reload();
const checkKey = (keyStroke)  => {
    return contains(Object.keys(keysToStops).join(", "))(keyStroke.toString());
};

// const map = L.map("map", mapOpt).setView(origin, 11);
const map = L.map("map").setView(origin, 11);
L.tileLayer(tileUrl).addTo(map);

lines    = initLines(lines.features);
stations = stations.features;

let stationsLayer = null;

window.onkeydown = (e) => {
    return e.keyCode ? checkKey(e.keyCode) ? selectStop(keysToStops[e.keyCode])
                                           : e.keyCode === 27 ? refresh()
                                                              : null
                     : null;
};

//
// demo
//
// ["G", "R", "F"].forEach(selectStop);
