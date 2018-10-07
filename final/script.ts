// tslint script.ts; tsc script.ts;

declare var L     : any;
declare var lines : any;
declare var sttns : any;

interface Row     { properties: any; // not much type safety here...
                  }

interface Splits  { take: Row[];
                    drop: Row[];
                  }

// interface MapOpts { doubleClickZoom: boolean;
//                     dragging       : boolean;
//                     keyboard       : boolean;
//                     scrollWheelZoom: boolean;
//                     tap            : boolean;
//                     touchZoom      : boolean;
//                     zoomControl    : boolean;
//                   }

const tileUrl: string   = ( "https://stamen-tiles.a.ssl.fastly.net/toner/"
                          + "{z}/{x}/{y}.png"
                          );
const origin : number[] = [  40.7128
                          , -74.0060
                          ];
// const mapOpt : MapOpts  = { doubleClickZoom: false
//                           , dragging       : false
//                           , keyboard       : false
//                           , scrollWheelZoom: false
//                           , tap            : false
//                           , touchZoom      : false
//                           , zoomControl    : false
//                           };

//
// shared utility functions
//
const contains   = (mainString: string) => (subString: string): boolean => {
    return mainString.indexOf(subString) >= 0 ? true
                                              : false;
};
const dashes     = (str: string): string => `-${str}-`;
const checkField = (searchTerm: string, field: string) =>
                   (row: Row): boolean => {
    const column: string = row.properties[field];
    return contains(column)(dashes(searchTerm));
};
const cloneObj   = (obj)      => JSON.parse(JSON.stringify(obj));
const initLines  = (linesObj) => ({take: [], drop: linesObj});

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
const loadData = (mapVar, dataVar) => {
    const mapData  = L.geoJson(dataVar);
    const newLayer = mapData.addTo(mapVar);
    map.fitBounds(mapData.getBounds());

    return newLayer;
};

const unique = (myArray) => myArray.filter((v, i, a) => a.indexOf(v) === i);

const mapInput = (mapVar, linesInput, sttnsInput, layerInput, keyInput) => {
    let _; // trash collector
    const linesOutput = splitSearch(linesInput.drop, keyInput);
    const sttnsOutput = search(sttnsInput, keyInput);

    // clear existing points
    _ = layerInput !== null ? layerInput.clearLayers()
                            : null;
    // load new points, return layer
    const newLayer = sttnsOutput.length > 0 ? loadData(mapVar, sttnsOutput)
                                            : null;

    // load new lines, layer not needed
    _ = linesOutput.take.length > 0 ? loadData(mapVar, linesOutput.take)
                                    : null;

    // check output
    [ {rows: linesOutput.take, column: "name"} as any
    , {rows: sttnsOutput     , column: "line"} as any
    ].forEach(
        (obj) => {
            console.log(
                unique(obj.rows.map((row) => row.properties[obj.column]))
            );
            console.log(obj.rows.length);
        }
    );

    return [linesOutput, sttnsOutput, newLayer];
};

//
// main
//
// const map = L.map("map", mapOpt).setView(origin, 10);
const map = L.map("map").setView(origin, 10);
L.tileLayer(tileUrl).addTo(map);

let linesMap   = cloneObj(initLines(lines.features));
let sttnsMap   = cloneObj(sttns.features);
let sttnsLayer = null;

const runSelection = (selection) => {
    [linesMap, sttnsMap, sttnsLayer] = mapInput( map
                                               , linesMap
                                               , sttnsMap
                                               , sttnsLayer
                                               , selection
                                               );
};

["G", "R", "F"].forEach(runSelection);
