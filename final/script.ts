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

const colorMap = { 1: 0
                 , 2: 0
                 , 3: 0
                 , 4: 135
                 , 5: 135
                 , 6: 135
                 , 7: 295
                 , A: 250
                 , C: 250
                 , E: 250
                 , B: 30
                 , D: 30
                 , F: 30
                 , M: 30
                 , G: 95
                 , J: 35
                 , Z: 35
                 , L: 0 // need gray!
                 , N: 50
                 , Q: 50
                 , R: 50
                 , W: 50
                 , S: 0 // need gray!
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
const styleCircle   = (color) => (geoJsonFeature) => {
    return { fillColor  : color
           , radius     : 6
           , fillOpacity: 0.75
           , stroke     : false
           };
};

const circleStyle = (color) => {
    return { pointToLayer: pointToCircle
           , style       : styleCircle(color)
           };
};

const lineStyle = (inputColor) => ({style: {color: inputColor}});

const mapInput = (mapVar, linesInput, stationsInput, layerInput, keyInput) => {
    const linesOutput    = splitSearch(linesInput.drop, keyInput);
    const stationsOutput = search(stationsInput       , keyInput);

    let _ = layerInput !== null ? layerInput.clearLayers()
                                : null;

    const color = "hsl(" + colorMap[keyInput].toString() + ", 100%, 50%)";

    _                      = checkLength( linesOutput.take
                                        , loadData(mapVar, lineStyle(color))
                                        );
    const newStationsLayer = checkLength( stationsOutput
                                        , loadData(mapVar, circleStyle(color))
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
// const map = L.map("map", mapOpt).setView(origin, 12);
const map = L.map("map").setView(origin, 12);
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
