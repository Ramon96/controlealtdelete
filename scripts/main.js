import {
    select,
    dsv,
    json,
    scaleBand
} from 'd3';
import * as d3 from 'd3';
const rawdata = require('../input/rawdata.json');
const chartData = cleanChartData(rawdata);

console.log('chartskie: ', chartData);

// const svg = d3.select('#barChart');
// const width = +svg.attr('width');
// const height = +svg.attr('height');
// const margin = { top: 40, right: 30, bottom: 150, left: 100 };
// const innerWidth = width - margin.left - margin.right;
// const innerHeight = height - margin.top - margin.bottom;
// svg.attr('viewBox', [0, 0, width, height]);

const svg = d3.select("#barChart");
const margin = ({top: 10, right: 10, bottom: 20, left: 40})
const height = 600;
const width= 960;


const keys = ["westers", "niet-westers"];
const groupKey = 'Vetrouwen';

const color = d3.scaleOrdinal()
.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])


const x0 = d3.scaleBand()
    .domain(chartData.map(d => d[groupKey]))
    .rangeRound([margin.left, width - margin.right])
    .paddingInner(0.1)

    // console.log(x0(10))

const x1 = d3.scaleBand()
        .domain(keys)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05)

const y = d3.scaleLinear()
    // .domain([0, d3.max(chartData, d => d3.max(keys, key => d[key]))]).nice()
    .domain([0, 100]).nice()
    .rangeRound([height - margin.bottom, margin.top])
    // .rangeRound([height - margin.bottom, margin.top])



    console.log(y(50))

const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x0).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())

const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, "s"))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(chartData.y))

    svg.append("g")
    .selectAll("g")
    .data(chartData)
    .join("g")
    .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
    .selectAll("rect")
    .data(d => keys.map(key => {
        // console.log(key)
        return ({key, value: d["Herkomst"]})
    })
    )
    .join("rect")
    .attr("x", d => x1(d.key))
    // .attr("x", d => { 
    //   //  console.log(d)
    //    return  x1(d.key)
    //     })
    // .attr("y", d => console.log(d))
    .attr("y", d => y(50))
    // .attr("y", d => console.log(y(d.value)))
    .attr("width", x1.bandwidth())
    // .attr("height", d => console.log(y(0)))
    // .attr("height", d => console.log(d.value))
    // Het probleem is dat ik op de Y as de bar wil plotten, ik kijk nu tussen de positie 0 en d.value maar d.value staat gelijk aan westers en niet-westers
    .transition()
    .delay(10)
    .duration(700)
    .ease(d3.easeQuadOut)
    .attr("height", d => y(0) - y(50)) 
    // .attr("height", d => console.log(d.value))
    .attr("fill", d => color(d.key));

svg.append("g")
    .call(xAxis);

svg.append("g")
    .call(yAxis);

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


    function countGroups(data){

        data.forEach(d => {
            origin = d.Herkomst;
        })

        //kaoloo 
    }

/*
const svg = d3.select('#barChart');
const width = +svg.attr('width');
const height = +svg.attr('height');
const margin = { top: 40, right: 30, bottom: 150, left: 100 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
svg.attr('viewBox', [0, 0, width, height]);

const keys = ["westers", "niet-westers"];
const groupKey = 'Vetrouwen';

const x0 = d3.scaleBand()
    .domain(chartData.map(d => d[groupKey]))
    .rangeRound([0, innerHeight ])
    .paddingInner(0.1)

    console.log(x0.domain())

// chartData.map(d=> console.log(d))
// console.log(chartData)

const x1 = d3.scaleBand()
    .domain(keys)
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05)
    console.log("x1" + x1.domain())

// const y = d3.scaleLinear()
//     .domain([0, d3.max(chartData, d => d3.max(keys, key => d[key]))]).nice()
//     .rangeRound([height - margin.bottom, margin.top])
const color = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])

    // Dit moeten aantal respodenten zijn in %
const yScale = d3.scaleLinear()
    .domain([0, 5])
    // .domain([d3.max(chartData, d => d3.max(keys, key => d[groupKey])), 0]).nice()
    // .domain([0, d3.max(chartData, d => d3.max(keys, key => d[key]))])
    .range([0, innerWidth])
    .nice();
    
console.log(yScale.domain())

const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

//append a new group for the y axis and set it on the left side
g.append('g')
.style('font-size', '1rem')
.call(d3.axisLeft(yScale)
    .tickSize('0'));
    g.append('g')
    .style('font-size', '1rem')
    .call(d3.axisBottom(x0)
        // .tickSize(-innerHeight)
        .tickValues([0, 1, 2, 3 ]))
    .style('stroke-dasharray', ('3, 3'))
    .attr('transform', `translate(0, ${innerHeight})`)
    .append('text')
    .style('font-size', '1rem')
    .attr('y', 40)
    .attr('x', innerWidth / 2)
    .attr('fill', 'white')
    .text('asfsadf');

    g.append('g')
    .selectAll('g')
    .data(chartData)
    .join('g')
    .attr('transform', d => `translate(${x0(d[keys])},0)`)
    // .attr('transform', d => console.log(x0.domain()))
    .selectAll('rect')
    .data(d => keys.map(key => ({key, value: d[groupKey]})))
    .join('rect')
    .attr('y', d => yScale(d))
    .attr('x', d => x1(d.key))
    // .attr('height', x1.bandwidth())
    .attr('width', x1.bandwidth())
    .attr('height', d => yScale(d.value) - yScale(0))
    .attr('fill', d => color(d.key));

    */
   
   //this function needs the html_ID, a starttime, end time, and a duration
   animateInsight("value1", 0, 25, 5000);
   animateInsight("value2", 0, 50, 5000);


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