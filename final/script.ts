// tslint script.ts; tsc script.ts;

declare var L     : any;
declare var lines : any;
declare var sttns : any;

interface Row     { properties: object; // not much type safety here...
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
const contains = (mainString: string) => (subString: string): boolean => {
    return mainString.indexOf(subString) >= 0 ? true
                                              : false;
};
const dashes = (str: string): string => `-${str}-`;
const checkField = (searchTerm: string, field: string) =>
                   (row: Row): boolean => {
    const column: string = row.properties[field];
    return contains(column)(dashes(searchTerm));
};

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
const loadData = (mapVar, dataVar, mapLayer = null) => {
    mapLayer = clearLayer(mapLayer);

    const mapData = L.geoJson(dataVar);
    mapLayer = mapData.addTo(mapVar);
    map.fitBounds(mapData.getBounds());

    return mapLayer;
};

const clearLayer = (pointsLayerB) => {
    return pointsLayerB !== null === true ? pointsLayerB.clearLayers()
                                          : null;
};

const mapInput = (mapVar, linesInput, sttnsInput, pointsLayerA, input) => {
    const linesOutput = splitSearch(linesInput.drop, input);
    const sttnsOutput = search(sttnsInput, input);
    const _ = linesOutput.take.length > 0 ? loadData(mapVar, linesOutput.take)
                                          : null; // pass
    const newLayer = sttnsOutput.length > 0 ? loadData( mapVar
                                                      , sttnsOutput
                                                      , pointsLayerA
                                                      )
                                            : clearLayer(pointsLayerA);

    return [linesOutput, sttnsOutput, newLayer];
};

const cloneObj = (obj) => JSON.parse(JSON.stringify(obj));

const initLines = (linesObj) => {
    return({take: [], drop: linesObj});
};

//
// main
//
// const map = L.map("map", mapOpt).setView(origin, 10);
const map = L.map("map").setView(origin, 10);
L.tileLayer(tileUrl).addTo(map);

let linesMap = cloneObj(initLines(lines.features));
let sttnsMap = cloneObj(sttns.features);

let pointsLayer = null;

["G"].forEach(
    (selection) => {
        [linesMap, sttnsMap, pointsLayer] = mapInput( map
                                                    , linesMap
                                                    , sttnsMap
                                                    , pointsLayer
                                                    , selection
                                                    );
    }
);
