#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import geopandas as gpd
import matplotlib.pyplot as plt


def subway_filename(stem):
    return 'data/subway_{}.geojson'.format(stem)


def selector(gdf, line_col, line_char):
    return gdf.loc[gdf[line_col].str.contains(line_char)].copy()


def select_line(lines, sttns, line_char):
    my_lines = selector(lines, 'name', line_char)
    my_sttns = selector(sttns, 'line', line_char)

    return my_lines, my_sttns


def add_dash(string):
    return '-{}-'.format(string)


def prepare_data():
    lines = gpd.read_file(subway_filename('lines'))
    sttns = gpd.read_file(subway_filename('entrances'))

    lines['name'] = lines['name'].astype(str)
    sttns['name'] = sttns['name'].astype(str)
    sttns['line'] = sttns['line'].astype(str)

    lines['name'] = lines['name'].apply(add_dash)
    sttns['line'] = sttns['line'].apply(add_dash)
    lines['name'] = lines['name'].str.replace('-W-' , '-Q-')
    sttns['line'] = sttns['line'].str.replace('-FS-', '-S-')
    sttns['line'] = sttns['line'].str.replace('-GS-', '-S-')
    sttns['line'] = sttns['line'].str.replace('-H-' , '-S-')

    return lines, sttns


def list_stops():
    return [ '1', '2', '3', '4', '5', '6', '7'
           , 'A', 'B', 'C', 'D', 'E', 'F', 'G'
           , 'J', 'L', 'M', 'N', 'Q', 'R', 'S'
           ]


if __name__ == '__main__':
    lines, sttns = prepare_data()

    kwargs = {'column': 'name', 'alpha': 0.25}

    for stop in map(add_dash, list_stops()):
        title = stop.replace('-', '')

        my_lines, my_sttns = select_line(lines, sttns, stop)

        fig, ax = plt.subplots(figsize=(5, 6.5))
        kwargs['ax'] = ax

        my_lines.plot(**kwargs)
        if len(my_sttns) > 0:
            my_sttns.plot(**kwargs)

        ax.set_title(title)
        ax.set_aspect('equal')

        plt.tight_layout()
        plt.savefig('tmp/{}.png'.format(title))
        plt.close()
