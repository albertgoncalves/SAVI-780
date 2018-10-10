/* global d3 */

var rectangles = [ { fill: "#4daf4a"
                   , x: 100
                   , y: 100
                   }
                 , { fill: "#e41a1c"
                   , x: 200
                   , y: 200
                   }
                 , { fill: "#377eb8"
                   , x: 300
                   , y: 300
                   }
                 ];

var svg = d3.select("body")
            .append("svg" );

svg.selectAll("circle")
   .data(rectangles)
   .enter().append("circle")
   .attr("r", 60)
   .attr("fill", (d) => d.fill)
   .attr("cx"  , (d) => d.x   )
   .attr("cy"  , (d) => d.y   );
