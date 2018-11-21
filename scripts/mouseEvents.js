import {EventCodes} from './eventCodes.js'


function eventOnMouseOver(d, tooltip) {

  tooltip.transition()
    .duration(100)
    .style("opacity", 0.9)
    .style("background", "black");

  tooltip.html(tooltipHTML(d))
    .style("left", (d3.event.pageX + 15) + "px")
    .style("top", (d3.event.pageY - 50 ) + "px");
}

function eventOnMouseOut(d, tooltip) {

  tooltip.transition()
    .duration(100)
    .style("opacity", 0);
}

function tooltipHTML(d) {

  let ec = new EventCodes();

  return "<b>Global Event ID:</b> " + d['ID'] + " </br>" +
    "<b>Actor 1:</b> " + d['Actor1'] + " </br>" +
    "<b>Actor 2:</b> " + d['Actor2'] + " </br>" +
    "<b>Action:</b> " + ec.codes[d['Code']].name + " </br>";
}

export {
    eventOnMouseOver, eventOnMouseOut
}
