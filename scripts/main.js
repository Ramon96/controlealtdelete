import {
    select,
    dsv,
    json,
    scaleBand
} from 'd3';
import * as d3 from 'd3';
const svg = d3.select(".barChart");
const bar = svg.append("g");
const rawdata = require('../input/rawdata.json');
const chartData = cleanChartData(rawdata);
// const groupedData = restructureData(chartData);

const margin = ({top: 10, right: 10, bottom: 20, left: 40})
const height = 600;
const width= 960;
const keys = ["westers", "niet-westers"];
const groupKey = 'vertrouwen';
const color = d3.scaleOrdinal()
.range(["#db393c", "#0f4ff4"])
function sortNumber(a, b) {
  return a - b;
}
const bar_x0 = d3.scaleBand()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .rangeRound([margin.left, width - margin.right])
    .paddingInner(0.1)

const bar_x1 = d3.scaleBand()
        .domain(keys)
        .rangeRound([0, bar_x0.bandwidth()])
        .padding(0.05)

const y2 = d3.scaleLinear()
    .domain([0, 50]).nice()
    .rangeRound([height - margin.bottom, margin.top])

const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(bar_x0).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())

const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y2).ticks(null, "s"))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick text").clone()
            .attr("text-anchor", "start")
            .attr("font-weight", "bold"))

        
            
    restructureData(chartData)

    function update(data){
        const rects = bar.selectAll("rect");
        rects.data(data)
                .attr("transform", d => `translate(${bar_x0(d[groupKey])},0)`)
                .attr("x", d => bar_x1(d.herkomst))
                .attr("width", bar_x1.bandwidth())
                .attr("fill", d => color(d.herkomst))
                .transition()
                .delay((d, i) => {return i * 1})
                .duration(700)
                .ease(d3.easeQuadOut)
                .attr("y", d => y2(d.percentage))
                .attr("height", d => y2(0) - y2(d.percentage));

        rects.data(data)
            .enter().append('rect')  
            .attr("transform", d => `translate(${bar_x0(d[groupKey])},0)`)
            .attr("x", d => bar_x1(d.herkomst))
            .attr("data-percentage", d => d.percentage)
            .attr("width", bar_x1.bandwidth())
            .attr("y", d => y2(d.percentage))
                .attr("height", d => y2(0) - y2(d.percentage))
                .attr("fill", d => color(d.herkomst))

        rects.data(data).exit().remove();

        const menu = d3.select('nav');
        menu.on("click", ()=>{
            console.log(event.target.dataset.finance)
            if(event.target.dataset.finance == 7){
                restructureData(chartData);
            }
            else{
                const temp = chartData.filter(obj => {
                      return  event.target.dataset.finance == obj.Rondkomen;
                  })
                
                  restructureData(temp)
            }
        })
        svg.append("g")
            .call(xAxis);
        svg.append("g")
            .call(yAxis);

}
    const legend = svg => {
        const g = svg
            .attr("transform", `translate(${width},0)`)
            .attr("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .attr('fill', 'white')
            .attr("font-size", 10)
          .selectAll("g")
          .data(color.domain().slice().reverse())
          .join("g")
            .attr("transform", (d, i) => `translate(0,${i * 20})`);
        g.append("rect")
            .attr("x", -19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", color);
        g.append("text")
            .attr("x", -24)
            .attr("y", 9.5)
            .attr("dy", "0.35em")
            .text(d => d);
      }
    svg.append("g")
    .call(legend);
    function restructureData(data){
        const sortOrigin = d3.nest()
            .key(d => d.Herkomst)
            .entries(data)
            console.log(sortOrigin)
        const trustByOriginWestern = d3.nest()
            .key(d => d.Vetrouwen)
            .entries(sortOrigin[0].values);
        const trustByOriginNonWestern = d3.nest()
            .key(d => d.Vetrouwen)
            .entries(sortOrigin[1].values);
        const objectsW = trustByOriginWestern.map(obj => {
            return {
                herkomst: 'Westers',
                percentage: Math.ceil((100 / sortOrigin[0].values.length) * obj.values.length),
                groeplengte: obj.values.length,
                vertrouwen: obj.key
            }
        })
        const objectsN = trustByOriginNonWestern.map(obj => {
            return {     
                herkomst: 'niet-westers',
                percentage: Math.ceil((100 / sortOrigin[1].values.length) * obj.values.length),
                groeplengte: obj.values.length,
                vertrouwen: obj.key
            }
        })
        const newData = [...objectsW, ...objectsN];

        update(newData);
        // return newData;
    }

// westers : 1, 6
// niet westers :  2 ,3 4 ,5 ,7 
// weg : 8
// This function checks the origin of the induvidual 1 or 6 is western anything else is non western
function ancestry(origin){
    if(origin == "1" || origin == "6"){
        return "westers"
    }
    else{
        return "niet-westers"
    }
}
function cleanChartData(data){
    return data.filter(d => {
        return  d.rapportcijfer != "99999" 
    }).filter(d => {
        return d.Herkomst_def != '8'
    }).map(d => {
        return {
             Respodent: d.response_ID,
             Herkomst: ancestry(d.Herkomst_def),
             Vetrouwen: d.rapportcijfer,
             Rondkomen: d.stel_rondkomen
        }
    })
}
//this functions handels the countup on the one page
function animateInsight(id, start, end, duration){
    let object = document.getElementById(id);
    let range = end - start;
    let minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration/range));
    stepTime = Math.max(stepTime, minTimer);
    let startTime = new Date().getTime();
    let endTime = startTime + duration;
    let Timer;
    function run(){
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now)/duration, 0);
        let value = Math.round(end - (remaining * range));
        object.innerHTML = value + "%";
        if(value == end){
            clearInterval(Timer);
        }
    }
    Timer = setInterval(run, stepTime);
    run();
}

// dkjfakl;ads



var svg2 = d3.select(".columnChart"),
margin2 = {top: 50, right: 50, bottom: 100, left: 100},
width2 = +svg2.attr("width") - margin2.left - margin2.right,
height2 = +svg2.attr("height") - margin2.top - margin2.bottom,
g = svg2.append("g").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// The scale spacing the groups:
var column_x0 = d3.scaleBand()
.rangeRound([0, width2])
.paddingInner(0.1);

// The scale for spacing each group's bar:
var column_x1 = d3.scaleBand()
.padding(0.05);

var column_y = d3.scaleLinear()
.rangeRound([height2, 0]);

var z = d3.scaleOrdinal()
.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

console.log("je moeder")

d3.csv("../input/data.csv", function(d, i, columns) {
for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
return d;
}).then(function(data) {
console.log(data);

var keys = data.columns.slice(1);

console.log('keys');
console.log(keys);
column_x0.domain(data.map(function(d) { return d.State; }));
column_x1.domain(keys).rangeRound([0, column_x0.bandwidth()]);
column_y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("class","bar")
    .attr("transform", function(d) { return "translate(" + column_x0(d.State) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
    .attr("x", function(d) { return column_x1(d.key); })
    .attr("y", function(d) { return column_y(d.value); })
    .attr("width", column_x1.bandwidth())
    .attr("height", function(d) { return height2 - column_y(d.value); })
    .attr("fill", function(d) { return z(d.key); });

g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(column_x0));

g.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(column_y).ticks(null, "s"))
    .append("text")
    .attr("x", 2)
    .attr("column_y", column_y(column_y.ticks().pop()) + 0.5)
    .attr("dy", "0.32em")
    .attr("fill", "white")
    .attr("font-weight", "italic")
    .attr("text-anchor", "start")
          .style("font-size", "20px")
          .attr("font-style", "italic")
          .attr("transform", "translate(-70,230) rotate(-90)")
    .text("Aantal respondenten in %");

g.append("g")
    .append("text")
    .attr("fill", "white")
    .attr("font-weight", "italic")
    .attr("text-anchor", "start")
          .style("font-size", "20px")
          .attr("font-style", "italic")
          .attr("transform", "translate(210,320)")
    .text("\"De politie was beleefd gedurende het contact.\"");

var legend = g.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 14)
    .attr("text-anchor", "end")
    .attr("fill","white")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
    .attr("x", width2 - 17)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", z)
    .attr("stroke", z)
    .attr("stroke-width",2)
    .on("click",function(d) { update(d) });

legend.append("text")
    .attr("x", width2 - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function(d) { return d; });

var filtered = [];

////
//// Update and transition on click:
////

function update(d) {

    //
    // Update the array to filter the chart by:
    //

    // add the clicked key if not included:
    if (filtered.indexOf(d) == -1) {
        filtered.push(d);
        // if all bars are un-checked, reset:
        if(filtered.length == keys.length) filtered = [];
    }
    // otherwise remove it:
    else {
        filtered.splice(filtered.indexOf(d), 1);
    }

    //
    // Update the scales for each group(/states)'s items:
    //
    var newKeys = [];
    keys.forEach(function(d) {
        if (filtered.indexOf(d) == -1 ) {
            newKeys.push(d);
        }
    })
    column_x1.domain(newKeys).rangeRound([0, column_x0.bandwidth()]);
    column_y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { if (filtered.indexOf(key) == -1) return d[key]; }); })]).nice();

    // update the column_y axis:
    svg2.select("y")
        .transition()
        .call(d3.axisLeft(column_y).ticks(null, "s"))
        .duration(500);


    //
    // Filter out the bands that need to be hidden:
    //
    var bars = svg2
    .selectAll(".bar")
    .selectAll("rect")
      .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })

    bars.filter(function(d) {
            return filtered.indexOf(d.key) > -1;
        })
        .transition()
        .attr("x", function(d) {
            return (+d3.select(this).attr("x")) + (+d3.select(this).attr("width"))/2;
        })
        .attr("height",0)
        .attr("width",0)
        .attr("y", function(d) { return height2; })
        .duration(500);

    //
    // Adjust the remaining bars:
    //
    bars.filter(function(d) {
            return filtered.indexOf(d.key) == -1;
        })
        .transition()
        .attr("x", function(d) { return column_x1(d.key); })
        .attr("y", function(d) { return column_y(d.value); })
        .attr("height", function(d) { return height2 - column_y(d.value); })
        .attr("width", column_x1.bandwidth())
        .attr("fill", function(d) { return z(d.key); })
        .duration(500);


    // update legend:
    legend.selectAll("rect")
        .transition()
        .attr("fill",function(d) {
            if (filtered.length) {
                if (filtered.indexOf(d) == -1) {
                    return z(d);
                }
                else {
                    return "white";
                }
            }
            else {
                return z(d);
            }
        })
        .duration(100);


}

});


