// $ tslint script_no_api.ts ; tsc script_no_api.ts

declare var data    : any;
declare var L       : any;
declare var hslToHex: any;

// via https://gis.stackexchange.com/questions/243136/geojson-add-and-format-line-features-to-a-leaflet-map

const loadData = (mapVar, aData) => {

    const getColor = (featIn: string): string => {
        return featIn === "0" ? "#38A800"
                              : hslToHex( Math.random()
                                        , (0.2 * Math.random()) + 0.6
                                        , (0.4 * Math.random()) + 0.4
                                        );
    };

    const styleLines = (featureLayer): object => {
        // console.log(getColor(featureLayer));
        return { color    : getColor(featureLayer.properties.rt_symbol)
               , lineJoin : "round"
               , opacity  : (0.5 * Math.random()) + 0.5
               , weight   : 10
               };
    };

    const getData = (aMapVar) => (bData: object) => {
        const mapData = L.geoJson( bData
                                 , {style: styleLines}
                                 );
        mapData.addTo(aMapVar);
        aMapVar.fitBounds(mapData.getBounds());
        console.log(bData);
        console.log(mapData);
    };

    getData(mapVar)(aData);
};

const buttonHtml = (strInsert: string): string => {
    return `<button id="button">${strInsert}</button>`;
};

const assignInput = (targetId: string, content: string) => {
    document.getElementById(targetId).innerHTML = content;
};

const assignButton = (buttonId: string, f) => {
    document.querySelector(buttonId)
            .addEventListener("click", f);
};

const loadButton = () => {
    assignInput("input", buttonHtml("Go for it."));
    assignButton("button", buttonActions);
};

const buttonActions = () => {
    loadData(map, data);
    assignInput("input", buttonHtml("Keeping going!"));
    assignButton("button", () => loadData(map, data));
};

interface TileOpts { maxZoom: number;
                     opacity: number;
                   }

interface MapOpts  { doubleClickZoom: boolean;
                     dragging       : boolean;
                     keyboard       : boolean;
                     scrollWheelZoom: boolean;
                     tap            : boolean;
                     touchZoom      : boolean;
                     zoomControl    : boolean;
                   }

const tileOpt: TileOpts = { maxZoom: 18
                          , opacity: 0.25
                          };
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

// MAIN

const map = L.map("map", mapOpt).setView(origin, 8);
L.tileLayer(tileUrl, tileOpt).addTo(map);
setTimeout(loadButton, 1500);
