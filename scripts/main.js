import {
    select,
    dsv,
    json
} from 'd3';
  

import * as d3 from 'd3';

const rawdata = require('../input/rawdata.json');

console.log(rawdata[0].response_ID)

animateInsight("value1", 0, 25, 5000);
animateInsight("value2", 0, 50, 5000);

function cleanData(data){
    return data.map(d => {
        return {
            Respodent: data.response_ID
        }
    })
}


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