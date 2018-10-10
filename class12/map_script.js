/* global d3 */

/* jshint esversion: 6 */
/* jshint -W014 */

var mouseAction = (action, bool) => (d, i, nodes) => {
    d3.select(nodes[i]).classed(action, bool);
};

var svg     = d3.select("body").append("svg");
var width   = svg.node().getBoundingClientRect().width;
var height  = svg.node().getBoundingClientRect().height;
var dataUrl = ( "https://cdn.glitch.com/a66dc148-6640-4ac2-8d8c-cd5f7bb2b5a"
              + "8%2Fus-states2.geojson?1539045595817"
              );

var loadViz = (data) => {
    var projection = d3.geoAlbersUsa()
                       .fitSize([width, height], data);

    var path = d3.geoPath()
                 .projection(projection);

    svg.append("g")
       .selectAll("path")
       .data(data.features)
       .enter().append("path")
       .attr("d", path)
       .on("mouseenter", mouseAction("mouseover", true ))
       .on("mouseout"  , mouseAction("mouseover", false))
       .classed("state", true);
};

fetch(dataUrl)
    .then((response) => response.json())
    .then(loadViz);
