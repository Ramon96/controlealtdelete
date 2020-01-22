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

const x1 = d3.scaleBand()
    .domain(keys)
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05)
    console.log(x1.domain())

// const y = d3.scaleLinear()
//     .domain([0, d3.max(chartData, d => d3.max(keys, key => d[key]))]).nice()
//     .rangeRound([height - margin.bottom, margin.top])
const color = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])

    // Dit moeten aantal respodenten zijn in %
const yScale = d3.scaleLinear()
    .domain([0, 5]).nice()
    // .domain([0, d3.max(chartData, d => d3.max(keys, key => d[groupKey]))]).nice()
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
        .tickSize(-innerHeight)
        .tickValues([0, 1, 2, 3, 4, 5]))
    .style('stroke-dasharray', ('3, 3'))
    .attr('transform', `translate(0, ${innerHeight})`)
    .append('text')
    .style('font-size', '1rem')
    .attr('y', 40)
    .attr('x', innerWidth / 2)
    .attr('fill', 'white')
    .text('Gemiddelde score');

    g.append('g')
    .selectAll('g')
    .data(chartData)
    .join('g')
    .attr('transform', d => `translate(${x0(d[keys])},0)`)
    .selectAll('rect')
    .data(d => keys.map(key => ({key, value: d[groupKey]})))
    .join('rect')
    .attr('y', d => yScale(d))
    .attr('x', d => x1(d.key))
    // .attr('height', x1.bandwidth())
    .attr('width', x1.bandwidth())
    .attr('height', d => yScale(d.value) - yScale(0))
    .attr('fill', d => color(d.key));

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
        return d.rapportcijfer !== "99999" || d.Herkomst_def !== "8"
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