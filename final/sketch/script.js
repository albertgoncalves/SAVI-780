/* jshint esversion: 6 */
/* jshint -W014 */

var arrayToString = (array) => array.map((item) => item.toString());
var circleAttributes = (id, x, y, r) => {
    var [xx, yy, rr] = arrayToString([x, y, r]);
    return([ ["id", id]
           , ["cx", xx]
           , ["cy", yy]
           , [ "r", rr]
           ]
          );
};
var textAttributes = (id, x, y) => {
    var [xx, yy] = arrayToString([x, y]);
    return([ ["id", id]
           , [ "x", xx]
           , [ "y", yy]
           , ["text-anchor", "middle"]
           , ["alignment-baseline", "middle"]
           ]
          );
};
var createSvg = (containerId) => (svgShape) => (attributes, text="") => {
    var newSvg = document.createElementNS( "http://www.w3.org/2000/svg"
                                         , svgShape
                                         );
    attributes.forEach(([prop, value]) => newSvg.setAttribute(prop, value));
    newSvg.innerHTML = text;

    document.getElementById(containerId).appendChild(newSvg);
};
var createCircle = (containerId) => (r) => (x, y) => (id) => {
    createSvg(containerId)("circle")(circleAttributes(id, x, y, r));
};
var createText = (containerId) => (x, y) => (text) => (id) => {
    createSvg(containerId)("text")(textAttributes(id, x, y), text);
}
var changeColor = (color) => (id) => () => {
    document.getElementById(id).style.color = color;
};

//
// main
//
createCircle("circles")(40)(400, 30)("newCircle");
createText("circles")(400, 30)("Hello again!")("newText");

["circle", "newCircle"].forEach(
    (elemId) => {
        document.querySelector(".button")
                .addEventListener( "click"
                                 , changeColor("hsl(350, 35%, 50%)")(elemId)
                                 );
    }
);
