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
var arrayToString = (array) => array.map((item) => item.toString());
var createCircleAttributes = (id, r, x, y) => {
    var [rr, xx, yy] = arrayToString([r, x, y]);
    return([ ["id", id]
           , [ "r", rr]
           , ["cx", xx]
           , ["cy", yy]
           ]
          );
};
var createTextAttributes = (id, x, y) => {
    var [xx, yy] = arrayToString([x, y]);
    return([ ["id", id]
           , [ "x", xx]
           , [ "y", yy]
           ]
          );
};

circleAttributes = createCircleAttributes("newCircle", 40, 400, 30);
textAttributes   = createTextAttributes("newText", 400, 30);

createSvg("circles")("circle")(circleAttributes);
createSvg("circles")("text"  )(textAttributes, "Hello again!");

["circle", "newCircle"].forEach(
    (elemId) => {
        document.querySelector(".button")
                .addEventListener( "click"
                                 , changeColor("hsl(350, 35%, 50%)")(elemId)
                                 );
    }
);
