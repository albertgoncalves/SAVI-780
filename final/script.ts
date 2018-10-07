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
                    ];
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
const loadData = (mapVar) => (dataVar) => {
    const mapData  = L.geoJson(dataVar);
    const newLayer = mapData.addTo(mapVar);
    // map.fitBounds(mapData.getBounds());

    return newLayer;
};

const checkOutput = ([rows, column]) => {
    console.log(unique(rows.map((row) => row.properties[column])));
    console.log(rows.length);
};

const mapInput = (mapVar, linesInput, stationsInput, layerInput, keyInput) => {
    const linesOutput    = splitSearch(linesInput.drop, keyInput);
    const stationsOutput = search(stationsInput       , keyInput);

    let _ = layerInput !== null ? layerInput.clearLayers()
                                : null;

    _                      = checkLength(linesOutput.take, loadData(mapVar));
    const newStationsLayer = checkLength(stationsOutput  , loadData(mapVar));

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
