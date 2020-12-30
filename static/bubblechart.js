//Sean Klein 5575709

// source I got started with:
// https://www.d3-graph-gallery.com/graph/bubble_template.html
// also used the parts of the code from the tutorial for the tooltips

//console.table(dataset)
//console.log(dataset)

// set the dimensions and margins of the graph
let margin = {top: 40, right: 150, bottom: 60, left: 30},
    width = 1400 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// create svg on page
let svg = d3.select("#bubblechart")
    .append('svg')
    .attr("width", width + margin.left+ margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// TITLE //

    //graph title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top * 0.7))
        .attr("text-anchor", "middle")
        .style("font-size", "17px")
        .style("text-decoration", "underline")
        .text("Fertility Rate and Child Mortality estimations from 2018");


// Y AXIS //

    // y scale
    let y = d3.scaleLinear()
        .domain([0, 8]) //8 is next int after max again
        .range([ height, 0]);

    //y ticks
    svg.append("g").call(d3.axisLeft().scale(y));

    // y gridlines
    svg.append("g")
        .call(d3.axisLeft()
            .scale(d3.scaleLinear()     //avoid overlapping with axis ticks
                .domain([1, 7])
                .range([ height - (height / 8), (height / 8)]))
            .tickFormat("")             //no text at gridlines
            .tickSize(-width)           //length for starting point left
            .ticks(8)                   //same amount as axis ticks
            .tickSizeOuter(0)           //hide gridlines where axis is
            )
        .attr("class", "grid");         //dashed and grey

    //Y Axis label
    svg.append("text")
        //.attr("text-anchor", "end")
        .attr("x", -20 )
        .attr("y", -20 )
        .text("Children born per woman")
        .style("font-size", 12)
        .attr("text-anchor", "start");

// X AXIS //

    // x scales
    let x = d3.scaleLog()
        .domain([500, 100000]) //75000 is next value after max that fits the ticks
        .range([ 0, width ]);
    let xticks = d3.scaleLinear()
        .domain([500, 100000]) //75000 is next value after max that fits the ticks
        .range([ 0, width ]);
    //x ticks
    svg.append("g")
        .attr("transform", "translate(0," + height + ")") //put zero to the bottom
        .call(d3.axisBottom()
            .scale(xticks));
    // label text
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height+50 )
        .text("GDP per Capita (int. dollars)")
        .style("font-size", 12);


    // bubble color: maps each continent to a color
    let continentColor = new Map([["Asia", "red"], ["Europe", "orange"], ["North America", "purple"], ["South America", "green"], ["Africa", "blue"], ["Oceania", "brown"]])

    // scale bubble size
    let z = d3.scaleSqrt()
        .domain([1, 122]) //122 is the max in the table
        .range([2 , 26]); //took (domain / 5) + 2

// DRAW BUBBLES //

svg.append('g')
    .selectAll("dot")
    .data(dataset)  //read Data
    .enter()
    .append("circle")
    .attr("class", function(d) { return "bubbles " + d.continent.replaceAll(" ", "") }) //replace to remove whitespaces, also found when selecting bubble for onClick
    .attr("cx", function (d) { return x(d.income); } )
    .attr("cy", function (d) { return y(d.child_per_woman); } )
    .attr("r", function (d) { return z(d.child_mortality); } )
    .style("opacity", "0.7")
    .style("fill", function (d) { return continentColor.get(d.continent ); } )  //.replace(/([a-z])([A-Z])/g, '$1 $2')); } ) //regex to add Whitespace between capitalized
    // add onClick interaction
    .on("click",(event,d, i) => {onClick(event,d, i)})
    //call tooltip function (see below)
    .on("mouseover",(event,d) => {whileMouseOver(event,d)})
    .on("mouseout",(event,d) => {whileMouseOut(event,d)});

// TOOLTIPS //

    //tooltip, hidden by default
    let tooltip = d3.selectAll("#tooltip")
        .append("foreignObject")
        .style("visibility","hidden")

    //puts a html into the tooltip in order to allow easy styling
    // https://bl.ocks.org/mbostock/1424037
    function whileMouseOver(event,d){
        tooltip
            .style("visibility","visible")
            .append('div')
            .attr("class", "tooltip")
            .style("top", height - 2* margin.top + "px")
            .style("left", 2* margin.left + "px")
            .html(d.country + " | "+ d.continent + //.replace(/([a-z])([A-Z])/g, '$1 $2') regex to add white space between capitalised words
                "<br>" +
                "<br> "+ d.child_mortality + " child deaths" +
                "<br>" + d.child_per_woman + " childs per woman"+
                "<br>" + Math.trunc(d.income).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") //format for readability "38880.0" -> "38,880"
                + " gdp per capita"
                );
    ;}

    // hides tooltip
    function whileMouseOut(event,d){
        tooltip.style("visibility","hidden") //hide empty tooltip element (black dot otherwise)
        d3.select("#tooltip").select("div").remove(); //clear html-element on mouse leave
    };


// LEGENDS //

    // colrized bubbles for each continent
    let legendPos = width*0.9 //align all legend text the same

    svg.selectAll("mylabels")
        .data(continentColor.keys()) //get keys from bubble color
        .enter()
        .append("circle")
        .attr("stroke", "black")
        .attr("cx", legendPos)
        .attr("cy", function(d,i){ return 10 + i*(25)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d){ return continentColor.get(d)})
        // add onClick interaction
        .on("click",(event,d, i) => {onClick(event,d, i)})

    // labels next to legend bubbles
    svg.selectAll("mylabels")
        .data(continentColor.keys())
        .enter()
        .append("text")
        .attr("x", legendPos + 20 )
        .attr("y", function(d,i){ return i * (25)+ (25/2) }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return continentColor.get(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "bottom")
        .style("font-size", 14)
        // add onClick interaction
        .on("click",(event,d, i) => {onClick(event,d, i)})


    // legend for circle size
    let valuesToShow = [10, 120]
    let ySpacer = height * 0.3

    svg.selectAll("legend")
        .attr("class", "legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", width*0.9 - z(10))
        .attr("cy", function(d){ return ySpacer - z(d) } )
        .attr("r", function(d){ return z(d) })
        .style("fill", "none")
        .attr("stroke", "black");

    // circle sizes as text
    svg.selectAll("legend")
        .attr("class", "legend")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr('x', legendPos +20)
        .attr('y', function(d){ return ySpacer - 2 * z(d) + 10} )
        .text( function(d){ return d } )
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')

    //cirlce size legend label
    svg.append("text")
        .attr('x', legendPos - 30)
        .attr("y", ySpacer + 20)
        .text("Child Mortality per 1000")
        .attr("text-anchor", "start");

// HIGHLIGHT //

    //variable to track if higlight is active or not
    let higlightActive = false

    function onClick(event, d, i){

        //"hide" all bubbles
        d3.selectAll(".bubbles").style("opacity", .1)


        if (!higlightActive) {

            //put opacity of bubbles with correct continent back up
            dataset.forEach(function(element, index){
                if (element.continent == d.continent || element.continent == d) {
                    d3.selectAll("."+(element.continent
                        .replaceAll(" ", ""))) //replace to remove whitespaces, also found when mapping bubbles to classes
                        .style("opacity", 0.7)
                }

            })
            higlightActive = true
        }
        else {
            d3.selectAll(".bubbles").style("opacity", 0.7)
            higlightActive = false
        }

  }


