// tslint script.ts ; tsc script.ts

/* global lines */
/* global sttns */

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
const search = (featureArray: Row[], field: string) =>
               (searchTerm: string): Row[] => {
    return featureArray.filter(checkField(searchTerm, field));
};

const sttnsG   = search(sttns.features, "line")("G");
const sttnsGR  = search(sttnsG        , "line")("R"); // further reduce
const sttnsGRF = search(sttnsGR       , "line")("F"); // selected stops

//
// line search pattern
//
const splitSearch = (featureArray: Row[], field: string) =>
                    (searchTerm: string): Splits => {
    const take = [] as Row[];
    const drop = [] as Row[];
    for (const row of featureArray) {
        checkField(searchTerm, field)(row) ? take.push(row)
                                           : drop.push(row);
    }
    return {take, drop};
};
                                                         // no need to search
const linesG = splitSearch(lines.features, "name")("G"); // matched rows since
const linesR = splitSearch(linesG.drop   , "name")("R"); // they are already
const linesF = splitSearch(linesR.drop   , "name")("F"); // on the map!

//
// geojson loader
//
const loadData = (mapVar, mapLayer = null) => (dataVar) => {
    const _ = mapLayer !== null === true ? mapLayer.clearLayers()
                                         : null;

    const mapData = L.geoJson(dataVar);
    mapLayer = mapData.addTo(mapVar);
    map.fitBounds(mapData.getBounds());

    return mapLayer;
};

//
// main
//
const map = L.map("map", mapOpt).setView(origin, 10);
L.tileLayer(tileUrl).addTo(map);

let pointsLayer = null; // initialize points layers ...
                        // points need to be cleared after each reduction

pointsLayer = loadData(map, pointsLayer)(sttnsG);
loadData(map)(linesG.take); // mapLayer variable can be ignored ...
                            // lines, via search pattern, will never overlap

setTimeout(
    () => {
        pointsLayer = loadData(map, pointsLayer)(sttnsGRF);
        loadData(map)(linesR.take);
        loadData(map)(linesF.take);
    }, 3000
);
