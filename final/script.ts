// tslint script.ts; tsc script.ts;

declare var L       : any;
declare var lines   : any;
declare var stations: any;
// declare var location: Location;

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
const mapOpt            = { doubleClickZoom: false
                          , dragging       : false
                          , keyboard       : false
                          , scrollWheelZoom: false
                          , tap            : false
                          , touchZoom      : false
                          , zoomControl    : false
                          };

//
// shared utility functions
//
const contains    = (mainString: string) => (subString: string): boolean => {
    return mainString.indexOf(subString) >= 0 ? true
                                              : false;
};
const dashes      = (str: string): string => `-${str}-`;
const checkField  = (searchTerm: string, field: string) =>
                    (row: Row): boolean => {
    const column: string = row.properties[field];
    return contains(column)(dashes(searchTerm));
};
const cloneObj    = (obj)        => JSON.parse(JSON.stringify(obj));
const initLines   = (linesObj)   => ({take: [], drop: linesObj});
const unique      = (myArray)    => {
    return (myArray.filter((v, i, a) => a.indexOf(v) === i));
};
const checkLength = (myArray, f) => myArray.length > 0 ? f(myArray)
                                                       : null;
//
// station search pattern
//
const search = (featureArray: Row[], searchTerm: string): Row[] => {
    return featureArray.filter(checkField(searchTerm, "line"));
};

//
// line search pattern
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

    _ = layerInput !== null ? layerInput.clearLayers()
                            : null;

    const newLayer = checkLength(stationsOutput  , loadData(mapVar));
    _              = checkLength(linesOutput.take, loadData(mapVar));

    [ [linesOutput.take, "name"] as any
    , [stationsOutput  , "line"] as any
    ].forEach(checkOutput);

    return [linesOutput, stationsOutput, newLayer];
};

//
// main
//
// const map = L.map("map", mapOpt).setView(origin, 12);
const map = L.map("map").setView(origin, 12);
L.tileLayer(tileUrl).addTo(map);

lines    = cloneObj(initLines(lines.features));
stations = cloneObj(stations.features);

let _;
let stationsLayer = null;

const runSelection = (selection) => {
    [lines, stations, stationsLayer] = mapInput( map
                                               , lines
                                               , stations
                                               , stationsLayer
                                               , selection
                                               );
};

["G", "R", "F"].forEach(runSelection);
// location.reload();
