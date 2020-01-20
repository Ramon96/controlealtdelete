import {
    select,
    dsv,
    json
} from 'd3';
  

import * as d3 from 'd3';

const rawdata = require('../input/rawdata.json');
const chartData = cleanChartData(rawdata);
// console.log(rawdata)
console.log(chartData);


//this function needs the html_ID, a starttime, end time, and a duration
animateInsight("value1", 0, 25, 5000);
animateInsight("value2", 0, 50, 5000);

function invalidEntry(value){
    return value !== "99999";
}


function cleanChartData(data){
    return data.filter(d => {
        return d.rapportcijfer !== "99999"
    }).map(d => {
        return {
             Respodent: d.response_ID,
             Herkomst: d.Herkomst_def,
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