#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from examine_data import prepare_data


def export_geojson(gdf, filename):
    gdf.to_file( 'data/subway_{}_reduction.geojson'.format(filename)
               , driver='GeoJSON'
               )


if __name__ == '__main__':
    lines, sttns = prepare_data()

    export_args = [ (lines[['name', 'geometry']], 'lines')
                  , (sttns[['line', 'geometry']], 'sttns')
                  ]

    for gdf, filename in export_args:
        export_geojson(gdf, filename)
