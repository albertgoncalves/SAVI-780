// tslint script.ts; tsc script.ts;

declare var L     : any;
declare var lines : any;
declare var sttns : any;

interface Row     { properties: object; // not much type safety here...
                  }

interface Splits  { take: Row[];
                    drop: Row[];
                  }

interface MapOpts { doubleClickZoom: boolean;
                    dragging       : boolean;
                    keyboard       : boolean;
                    scrollWheelZoom: boolean;
                    tap            : boolean;
                    touchZoom      : boolean;
                    zoomControl    : boolean;
                  }

const tileUrl: string   = ( "https://stamen-tiles.a.ssl.fastly.net/toner/"
                          + "{z}/{x}/{y}.png"
                          );
const origin : number[] = [  40.7128
                          , -74.0060
                          ];
const mapOpt : MapOpts  = { doubleClickZoom: false
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
    const _ = mapLayer !== null === true ? mapLayer.clearLayers()
                                         : null;
    const mapData = L.geoJson(dataVar);
    mapLayer = mapData.addTo(mapVar);
    map.fitBounds(mapData.getBounds());

    return mapLayer;
};

const mapInput = (mapVar, linesInput, sttnsInput, pointsLayerA, input) => {
    const linesOutput = splitSearch(linesInput.drop, input);
    const sttnsOutput = search(sttnsInput, input);
    loadData(mapVar, linesOutput.take);
    const newLayer = loadData(mapVar, sttnsOutput, pointsLayerA);

    return [linesOutput, sttnsOutput, newLayer];
};

const cloneObj = (obj) => JSON.parse(JSON.stringify(obj));

//
// main
//
const map = L.map("map", mapOpt).setView(origin, 10);
L.tileLayer(tileUrl).addTo(map);

let linesMap = cloneObj(lines.features);
let sttnsMap = cloneObj(sttns.features);

const sttnsG   = search(sttns.features, "G");
const sttnsGR  = search(sttnsG        , "R");
const sttnsGRF = search(sttnsGR       , "F");

const linesG = splitSearch(lines.features, "G"); // matched rows since
const linesR = splitSearch(linesG.drop   , "R"); // they are already
const linesF = splitSearch(linesR.drop   , "F"); // on the map!

let pointsLayer = null; // initialize points layer ...
                        // points need to be cleared after each selection
pointsLayer = loadData(map, sttnsG, pointsLayer);
loadData(map, linesG.take); // mapLayer variable can be ignored for lines ...
                            // lines search pattern will never duplicate
setTimeout(
    () => {
        pointsLayer = loadData(map, sttnsGRF, pointsLayer);
        loadData(map, linesR.take);
        loadData(map, linesF.take);
    }, 3000
);
