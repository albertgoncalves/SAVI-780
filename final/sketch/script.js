/* jshint esversion: 6 */
/* jshint -W014 */

var createSvg = (containerId) => (svgShape) => (attributes, text="") => {
    var newSvg = document.createElementNS( "http://www.w3.org/2000/svg"
                                         , svgShape
                                         );
    attributes.forEach(([prop, value]) => newSvg.setAttribute(prop, value));
    newSvg.innerHTML = text;

    document.getElementById(containerId).appendChild(newSvg);
};

var changeColor = (color) => (id) => () => {
    document.getElementById(id).style.color = color;
};

circleAttributes = [ [ "r",        "40"]
                   , ["cx",       "400"]
                   , ["cy",        "30"]
                   , ["id", "newCircle"]
                   ];
textAttributes   = [ ["class", "newText"]
                   , [    "x",     "400"]
                   , [    "y",      "30"]
                   ];

createSvg("circles")("circle")(circleAttributes);
createSvg("circles")("text"  )(textAttributes, "Hello again!");

["circle", "newCircle"].forEach(
    (circleId) => {
        document.querySelector(".button")
                .addEventListener( "click"
                                 , changeColor("hsl(350, 35%, 50%)")(circleId)
                                 );
    }
);
