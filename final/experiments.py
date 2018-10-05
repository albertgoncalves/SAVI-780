#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd

from examine_data import prepare_data
from examine_data import selector


# def concat_lines(sttns):  # ugly function!
#     sttns['name'] = sttns['boro_name'] + ', ' + sttns['name']

#     grouped_stations = \
#         sttns.groupby('name')['line'].apply(lambda x: '-'.join(x))
#     grouped_stations = pd.DataFrame(grouped_stations)     \_ # nice tho!
#     grouped_stations['name'] = grouped_stations.index
#     grouped_stations.rename(columns={'line': 'concat_lines'}, inplace=True)
#     grouped_stations.reset_index(drop=True, inplace=True)

#     return pd.merge(sttns, grouped_stations, on='name', how='left').copy()


def select_2_lines(lines, sttns, selection):
    my_lines = pd.concat([ selector(lines, 'name', line_char)
                           for line_char in selection
                         ]
                        ).copy()

    my_sttns = sttns.loc[ sttns['line'].str.contains(selection[0])
                        & sttns['line'].str.contains(selection[1])
                        # & sttns['line'].str.contains(selection[2])
                        ].copy()

    my_sttns['name'] = my_sttns['name'].astype(str)

    return my_lines, my_sttns


if __name__ == '__main__':
    lines, _ = prepare_data()
    # boros        = gpd.read_file('boroughs.geojson')[[ 'geometry'
    #                                                  , 'boro_name'
    #                                                  ]
    #                                                 ]
    # sttns_sjoin  = gpd.sjoin(sttns, boros, how='left', op='intersects')

    entrances    = gpd.read_file('subway_entrances.geojson')

    selection = ['6', 'M']
    # selection = ['4', 'R']  # reveals problem in grouping! need to solve...
    # selection = ['Q', 'R']

    my_lines, my_sttns = select_2_lines(lines, entrances, selection)

    fig, ax = plt.subplots(figsize=(5, 6.5))
    kwargs  = {'alpha': 0.25, 'ax': ax}

    my_lines.plot(column='name', **kwargs)
    if len(my_sttns) > 0:
        my_sttns.plot(column='name', **kwargs)

    ax.set_aspect('equal')

    plt.tight_layout()
    plt.show()
    plt.close()
