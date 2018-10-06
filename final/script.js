/* global lines */
/* global sttns */

/* jshint esversion: 6 */
/* jshint -W014 */

const getField  = (field)      => (station)   => station[field];
const checkLine = (line)       => (station)   => contains(station.lines)(line);
const contains  = (mainString) => (subString) => {
    return mainString.indexOf(subString) >= 0 ? true
                                              : false;
};

// stations = [ {'name': '1', 'lines': 'A-C-E'}
//            , {'name': '2', 'lines': 'C-D'  }
//            , {'name': '3', 'lines': '7-D'  }
//            , {'name': '4', 'lines': 'G-4'  }
//            , {'name': '5', 'lines': 'Q-N-R'}
//            , {'name': '6', 'lines': 'R-4-5'}
//            , {'name': '7', 'lines': '4-5'  }
//            , {'name': '8', 'lines': 'A-R-Q'}
//            , {'name': '9', 'lines': 'G'    }
//            ];

console.log(sttns.filter(checkLine('G')).map(getField('name')));
