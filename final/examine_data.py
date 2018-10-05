#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import geopandas as gpd
import matplotlib.pyplot as plt


def subway_filename(stem):
    return 'subway_{}.geojson'.format(stem)


def selector(gdf, line_col, line_char):
    return gdf.loc[gdf[line_col].str.contains(line_char)].copy()


def select_line(lines, sttns, line_char):
    my_lines = selector(lines, 'name', line_char)
    my_sttns = selector(sttns, 'line', line_char)

    return my_lines, my_sttns


def prepare_data():
    lines = gpd.read_file(subway_filename('lines'))
    sttns = gpd.read_file(subway_filename('entrances'))

    sttns['line'] = sttns['line'].str.replace(' Express', '')
    sttns['name'] = sttns['name'].astype(str)

    return lines, sttns


def list_stops():
    return [ '1', '2', '3', '4', '5', '6', '7'
           , 'A', 'B', 'C', 'D', 'E', 'F', 'G'
           , 'J', 'L', 'M', 'N', 'Q', 'R'
           , 'S', 'W', 'Z'
           ]


if __name__ == '__main__':
    lines, sttns = prepare_data()

    kwargs = {'column': 'name', 'alpha': 0.25}

    for stop in list_stops():
        my_lines, my_sttns = select_line(lines, sttns, stop)

        fig, ax = plt.subplots(figsize=(5, 6.5))
        kwargs['ax'] = ax

        my_lines.plot(**kwargs)
        if len(my_sttns) > 0:
            my_sttns.plot(**kwargs)

        ax.set_title(stop)
        ax.set_aspect('equal')

        plt.tight_layout()
        plt.savefig('tmp/{}.png'.format(stop))
        plt.close()
