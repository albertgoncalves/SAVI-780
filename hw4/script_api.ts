// $ tslint script_api.ts ; tsc script_api.ts

declare var L       : any;
declare var hslToHex: any;

// via https://gis.stackexchange.com/questions/243136/geojson-add-and-format-line-features-to-a-leaflet-map

const loadData = (mapVar, url: string) => {

    const getResp = (response): object => response.json();

    const getColor = (featIn: string): string => {
        return featIn === "0" ? "#38A800"
                              : hslToHex( Math.random()
                                        , (0.75 * Math.random()) + 0.25
                                        , (0.25 * Math.random()) + 0.4
                                        );
    };

    const styleLines = (featureLayer): object => {
        // console.log(getColor(featureLayer));
        return { color    : getColor(featureLayer.properties.rt_symbol)
               , lineJoin : "round"
               , opacity  : (0.2 * Math.random()) + 0.8
               , weight   : 10
               };
    };

    const getData = (aMapVar) => (data: object) => {
        const mapData = L.geoJson( data
                                 , {style: styleLines}
                                 );
        mapData.addTo(aMapVar);
        aMapVar.fitBounds(mapData.getBounds());
        console.log(data);
        console.log(mapData);
    };

    fetch(url)
        .then(getResp)
        .then(getData (mapVar));
};

interface TileOpts { maxZoom: number;
                     opacity: number;
                   }

const origin : number[] = [  40.7128
                          , -74.0060
                          ];
const tileOpt: TileOpts = { maxZoom: 18
                          , opacity: 0.5
                          };
const tileUrl: string   = ( "https://stamen-tiles.a.ssl.fastly.net/toner/"
                          + "{z}/{x}/{y}.png"
                          );
const dataUrl: string   = ( "https://data.cityofnewyork.us/resource/"
                          + "s7zz-qmyz.geojson"
                          + "?$limit=100"
                          );

// MAIN

const map = L.map("map").setView(origin, 5);
L.tileLayer(tileUrl, tileOpt).addTo(map);
loadData(map, dataUrl);
