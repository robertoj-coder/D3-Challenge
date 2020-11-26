// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.2,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, chartWidth]);

  return xLinearScale;

}

function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]),
      d3.max(censusData, d => d[chosenYAxis])
    ])
    .range([chartWidth, 0]);

  return yLinearScale;
}

  function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  function renderAxes(newYScale, YAxis) {
    var bottomAxis = d3.axisBottom(newYScale);
  
    YAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return YAxis;
  }

  function renderCircles(circlesGroup, newXScale, chosenXaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXaxis]))
     
  
    return circlesGroup;
  }

  function renderCircles(circlesGroup, newYScale, chosenYaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYaxis]));
  
    return circlesGroup;

  }

  // function renderCircles(circlesGroup, newXScale, newYScale, chosenXaxis, chosenYaxis) {

  //   circlesGroup.transition()
  //     .duration(1000)
  //     .attr("cx", d => newXScale(d[chosenXaxis]))
  //     .attr("cy", d => newYScale(d[chosenYaxis]));
  
  //   return circlesGroup;

  // }

  function updateToolTip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
      var label = "Poverty:";
    }

    else if (chosenXAxis === "age"){
      var label ="Age:"
    }
    else {
      var label = "Income:";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }


  
  d3.csv("assets/data/data.csv").then(function(censusData) {

    // parse data
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcareLow= +data.healthcareLow;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
      data.abbr = +data.abbr;
      
    });
    console.log(censusData);
});


   




























  


