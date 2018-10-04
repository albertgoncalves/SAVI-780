#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import matplotlib.pyplot as plt
import pandas as pd

from examine_data import prepare_data
from examine_data import selector


def concat_lines(sttns):  # ugly function!
    grouped_stations = \
        sttns.groupby('name')['line'].apply(lambda x: '-'.join(x))  # nice tho!
    grouped_stations = pd.DataFrame(grouped_stations)
    grouped_stations['name'] = grouped_stations.index
    grouped_stations.rename(columns={'line': 'concat_lines'}, inplace=True)
    grouped_stations.reset_index(drop=True, inplace=True)

    return pd.merge(sttns, grouped_stations, on='name', how='left').copy()


def select_2_lines(lines, sttns, selection):
    my_lines = pd.concat([ selector(lines, 'name', line_char)
                           for line_char in selection
                         ]
                        ).copy()

    my_sttns = sttns.loc[ sttns['concat_lines'].str.contains(selection[0])
                        & sttns['concat_lines'].str.contains(selection[1])
                        ].copy()

    return my_lines, my_sttns


if __name__ == '__main__':
    lines, sttns = prepare_data()
    sttns        = concat_lines(sttns)

    selection = ['R', '4']  # reveals problem in grouping! need to solve...

    my_lines, my_sttns = select_2_lines(lines, sttns, selection)

    fig, ax = plt.subplots(figsize=(5, 6.5))
    kwargs  = {'column': 'name', 'alpha': 0.25, 'ax': ax}

    my_lines.plot(**kwargs)
    my_sttns.plot(**kwargs)

    plt.tight_layout()
    plt.show()
    plt.close()
