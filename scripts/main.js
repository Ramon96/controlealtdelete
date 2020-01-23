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
const x0 = d3.scaleBand()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .rangeRound([margin.left, width - margin.right])
    .paddingInner(0.1)

const x1 = d3.scaleBand()
        .domain(keys)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05)

const y = d3.scaleLinear()
    .domain([0, 100]).nice()
    .rangeRound([height - margin.bottom, margin.top])

const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x0).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())

const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, "s"))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick text").clone()
            .attr("text-anchor", "start")
            .attr("font-weight", "bold"));
            
    restructureData(chartData)

    function update(data){
        const rects = bar.selectAll("rect");
        rects.data(data)
                .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
                .attr("x", d => x1(d.herkomst))
                .attr("width", x1.bandwidth())
                .attr("fill", d => color(d.herkomst))
                .transition()
                .delay((d, i) => {return i * 1})
                .duration(700)
                .ease(d3.easeQuadOut)
                .attr("y", d => y(d.percentage))
                .attr("height", d => y(0) - y(d.percentage));
        rects.data(data)
            .enter().append('rect')  
            .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
            .attr("x", d => x1(d.herkomst))
            .attr("data-percentage", d => d.percentage)
            .attr("width", x1.bandwidth())
            .attr("y", d => y(d.percentage))
                .attr("height", d => y(0) - y(d.percentage))
                .attr("fill", d => color(d.herkomst));

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