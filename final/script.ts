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

const tileUrl: string   = ( "https://stamen-tiles.a.ssl.fastly.net/toner/"
                          + "{z}/{x}/{y}.png"
                          );
const origin : number[] = [  40.7128
                          , -74.0060
                          ];
// const mapOpt            = { doubleClickZoom: false
//                           , dragging       : false
//                           , keyboard       : false
//                           , scrollWheelZoom: false
//                           , tap            : false
//                           , touchZoom      : false
//                           , zoomControl    : false
//                           };

const allStops    = [ "1", "2", "3", "4", "5", "6", "7"
                    , "A", "B", "C", "D", "E", "F", "G"
                    , "J", "L", "M", "N", "Q", "R", "S"
                    , "Z"
                    ];
const keysToStops = allStops.reduce(
    (obj, stop) => {
        obj[keyInputs[stop.toLowerCase()]] = stop;
        return obj;
    }, {}
);
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
const checkLength = (myArray, f) => myArray.length > 0 ? f(myArray)
                                                       : null;
const checkKey    = (keyStroke)  => {
    return contains(Object.keys(keysToStops).join(", "))(keyStroke.toString());
};
const refresh     = ()           => location.reload();
const smudge      = (colorVal)   => {
    const newVal = ((colorVal * 0.15) * (Math.random() - 0.5)) + colorVal;
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
// geojson loader
//
const loadData = (mapVar, style) => (dataVar) => {
    const mapData  = L.geoJson(dataVar, style);
    const newLayer = mapData.addTo(mapVar);
    // map.fitBounds(mapData.getBounds());

    return newLayer;
};

const checkOutput = ([rows, column]) => {
    console.log(unique(rows.map((row) => row.properties[column])));
    console.log(rows.length);
};

const pointToCircle = (geoJsonPoint, latlng) => L.circleMarker(latlng);

const markerToCircle = (color) => {
    return { pointToLayer: pointToCircle
           , style       : styleCircle(color)
           };
};

const styleCircle   = (color) => (geoJsonFeature) => {
    return { fillColor  : color
           , radius     : 6
           , fillOpacity: 1
           , stroke     : false
           };
};

const lineStyle = (inputColor) => {
    return { style:  { color: inputColor
                     }
           , weight: 5
           };
};

const mapInput = (mapVar, linesInput, stationsInput, layerInput, keyInput) => {
    const linesOutput    = splitSearch(linesInput.drop, keyInput);
    const stationsOutput = search(stationsInput       , keyInput);

    let _ = layerInput !== null ? layerInput.clearLayers()
                                : null;

    const color = arrayToHsl(colorMap[keyInput]);

    _                      = checkLength( linesOutput.take
                                        , loadData( mapVar
                                                  , lineStyle(color)
                                                  )
                                        );
    const newStationsLayer = checkLength( stationsOutput
                                        , loadData( mapVar
                                                  , markerToCircle(color)
                                                  )
                                        );

    [ [linesOutput.take, "name"] as any
    , [stationsOutput  , "line"] as any
    ].forEach(checkOutput);

    return [linesOutput, stationsOutput, newStationsLayer];
};

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

// ["G", "R", "F"].forEach(selectStop);
