// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 620;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
// var svg = d3.select("#scatter")
//   .append("svg")
//   .attr("width", svgWidth)
//   .attr("height", svgHeight);

var chart = d3.select("#scatter")
  .append('div')
  .classed('chart', true)

var svg = chart.append('svg')
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
    .domain([
      (d3.min(censusData, d => d[chosenXAxis]))* 0.8,
      (d3.max(censusData, d => d[chosenXAxis])) * 1.02
    ])
    .range([0, chartWidth]);

  return xLinearScale;

}

function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([
      (d3.min(censusData, d => d[chosenYAxis]))* 0.7,
      (d3.max(censusData, d => d[chosenYAxis]))* 1.05
    ])
    .range([chartHeight, 0]);

  return yLinearScale;
}

  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

  

  function renderCircles(circlesGroup, newXScale,chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;

  }

  // /function for updating STATE labels
  function renderText(stateGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    stateGroup.transition()
      .duration(1000)
      .attr('x', d => newXScale(d[chosenXAxis]))
      .attr('y', d => newYScale(d[chosenYAxis]));

    return stateGroup;
  }

  function symbolX(x_value, chosenXAxis) {

    //style based on variable
    //poverty
    if (chosenXAxis === 'poverty') {
        return `${x_value}%`;
    }
    else {
      return `${x_value}`;
    }
}
  // function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  //   if (chosenXAxis === "poverty" && chosenYAxis ==="obesity") {
  //     var xlabel = "Poverty:";
  //     var ylabel = "Obesity:"
  //   }

  //   else if (chosenXAxis === "age" && chosenYAxis ==="obesity") {
  //     var xlabel = "Age:";
  //     var ylabel = "Obesity:"
  //   }

  //   else if (chosenXAxis === "income" && chosenYAxis ==="obesity") {
  //     var xlabel = "Income:";
  //     var ylabel = "Obesity:"
  //   }

  //   else if (chosenXAxis === "poverty" && chosenYAxis === "smokes"){
  //     var xlabel = "Poverty:";
  //     var ylabel ="Smokes:";
  //   }

  //   else if (chosenXAxis === "age" && chosenYAxis === "smokes"){
  //     var xlabel = "Age:";
  //     var ylabel ="Smokes:";
  //   }
  //   else if (chosenXAxis === "income" && chosenYAxis === "smokes"){
  //     var xlabel = "Income:";
  //     var ylabel ="Smokes:";
  //   }
  //   else if (chosenXAxis === "poverty" && chosenYAxis === "healthcare"){
  //     var xlabel = "Poverty:";
  //     var ylabel = "Healthcare:";
  //   }
  //   else if (chosenXAxis === "age" && chosenYAxis === "healthcare"){
  //     var xlabel = "Age:";
  //     var ylabel = "Healthcare:";
  //   }

  //   else {

  //   var xlabel = "Income:";
  //   var ylabel = "Healthcare";
  //   }
    
  
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

      //poverty
      if (chosenXAxis === 'poverty') {
        var xlabel = "Poverty: ";
      }
      //income
      else if (chosenXAxis === 'age'){
        var xlabel = 'Age: ';
      }
      //age
      else {
        var xlabel = 'Income: $';
      }

      if (chosenYAxis ==='obesity') {
        var ylabel = "Obese: "
      }
      else if(chosenYAxis === 'smokes') {
        var ylabel = 'Smokes: ';
      }
      //smoking
      else{
        var ylabel = 'Lack of Healthcare: ';
      }




    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xlabel} ${symbolX(d[chosenXAxis], chosenXAxis)}<br>${ylabel}${d[chosenYAxis]}%`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
     circlesGroup .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }


  
  d3.csv("assets/data/data.csv").then(function(censusData) {

    console.log(censusData);

    // parse data
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
      data.healthcare= +data.healthcare;
      // data.abbr = +data.abbr;
      
    });
    

    // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);

  // xLinearScale function above csv import
  var yLinearScale = yScale(censusData, chosenYAxis);

 // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


 // append x axis
 var xAxis = chartGroup.append("g")
 .classed("x-axis", true)
 .attr("transform", `translate(0, ${chartHeight})`)
 .call(bottomAxis);

 var yAxis= chartGroup.append("g")
  .classed("y-axis", true)
  .call(leftAxis);

 var circlesGroup = chartGroup.selectAll("circle")
  .data(censusData)
  .enter()
  .append("circle")
  .classed("stateCircle", true)
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", 20)
  .attr("opacity", ".8");

  var stateGroup = chartGroup.selectAll('.stateText')
  .data(censusData)
  .enter()
  .append('text')
  .classed('stateText', true)
  .attr('x', d => xLinearScale(d[chosenXAxis]))
  .attr('y', d => yLinearScale(d[chosenYAxis]))
  .attr('dy', 3)
  .attr('font-size', '10px')
  .text(function(d){return d.abbr});

  var xlabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 10 +margin.top})`);

  var ylabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${0-margin.left/4}, ${chartHeight/2})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y",20)
    .attr("x_value", "poverty") // value to grab for event listener
    .classed("active", true)
    .classed("aText", true)
    .text("In Poverty (%)");


  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("x_value", "age") // value to grab for event listener
    .classed("inactive", true)
    .classed("aText", true)
    .text("Age (Median)");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("x_value", "income") // value to grab for event listener
    .classed("inactive", true)
    .classed("aText", true)
    .text("Household Income (Median)");

    var obesityLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y",0 - 20)
    .attr("x", 0)
    .attr("dy", "1em")
    .attr("y_value", "obesity") // value to grab for event listener
    .classed("active", true)
    .classed("aText", true)
    .text("Obese (%)");


  var smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - 40)
    .attr("x",0 )
    .attr("dy", "1em")
    .attr("y_value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .classed("aText", true)
    .text("Smokes (%)");

  var healthLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y",  0 -60)
    .attr("x",0)
    .attr("dy", "1em")
    .attr("y_value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .classed("aText", true)
    .text("Lack of Healthcare (%)");


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

   // x axis labels event listener
   xlabelsGroup.selectAll("text")
   .on("click", function() {
     // get value of selection
     var x_value = d3.select(this).attr("x_value");
     if (x_value !== chosenXAxis) {

       // replaces chosenXAxis with value
       chosenXAxis = x_value;

       // console.log(chosenXAxis)

       // functions here found above csv import
       // updates x scale for new data
       xLinearScale = xScale(censusData, chosenXAxis);

       // updates x axis with transition
       xAxis = renderXAxes(xLinearScale, xAxis);

       // updates circles with new x values
       circlesGroup = renderCircles( circlesGroup, xLinearScale,chosenXAxis, yLinearScale, chosenYAxis);
       //update states 

       stateGroup = renderText(stateGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

       // updates tooltips with new info
       circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

       // changes classes to change bold text
       if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel 
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel 
            .classed("active", false)
            .classed("inactive", true);   
       }
       else if (chosenXAxis === "age"){
          povertyLabel
          .classed("active", false)
          .classed("inactive", true);
          ageLabel 
          .classed("active", true)
          .classed("inactive", false);
          incomeLabel 
          .classed("active", false)
          .classed("inactive", true); 
       }

       else{
          povertyLabel
          .classed("active", false)
          .classed("inactive", true);
          ageLabel 
          .classed("active", false)
          .classed("inactive", false);
          incomeLabel 
          .classed("active", true)
          .classed("inactive", false); 

       }

     }

    });

     ylabelsGroup.selectAll("text")
     .on("click", function() {
       // get value of selection
       var y_value = d3.select(this).attr("y_value");
       if (y_value !== chosenYAxis) {
  
         // replaces chosenXAxis with value
         chosenYAxis = y_value;
  
         // console.log(chosenXAxis)
  
         // functions here found above csv import
         // updates x scale for new data
         yLinearScale = yScale(censusData, chosenYAxis);
  
         // updates x axis with transition
         yAxis = renderYAxes(yLinearScale, yAxis);
  
         // updates circles with new x values
         circlesGroup = renderCircles(circlesGroup, xLinearScale,chosenXAxis, yLinearScale, chosenYAxis);

         stateGroup = renderText(stateGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
  
         // updates tooltips with new info
         circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
         // changes classes to change bold text
         if (chosenYAxis === "obesity") {
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel 
              .classed("active", false)
              .classed("inactive", true);
            healthLabel
              .classed("active", false)
              .classed("inactive", true);   
         }
         else if (chosenYAxis === "smokes"){
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel 
              .classed("active", true)
              .classed("inactive", false);
            healthLabel
              .classed("active", false)
              .classed("inactive", true);  
         }
  
         else{
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel 
              .classed("active", false)
              .classed("inactive", true);
            healthLabel
              .classed("active", true)
              .classed("inactive", false); 
    
         }

         
       }

      });




   }).catch(function(error) {
    console.log(error);
  });
  



















   




























  


