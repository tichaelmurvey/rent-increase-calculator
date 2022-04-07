async function calculate(){
    start = document.getElementById("Q1").value;
    end = document.getElementById("Q2").value;
    getObs(start, end);
}

async function getObs(startQtr, endQtr){
const requestURL = 'https://api.data.abs.gov.au/data/ABS%2CCPI%2C1.0.0/1.115522.10.8.Q?startPeriod=' + startQtr + '&endPeriod=' + endQtr + '&detail=dataonly';

const headers = new Headers({'Accept': 'application/vnd.sdmx.data+json'});
const request = new Request(requestURL, {headers: headers});

fetch(request).then(
        (value) => {
            return value.json()
        }   
    ).then(
        (value) => {
            results = value['data']['dataSets'][0]['series']['0:0:0:0:0']['observations'];
            results_array = $.map(results, function(el) {return el});
            qstart_cpi = results_array[0];
            qend_cpi = results[results_array.length -1];
            cpi_change = 100*(qend_cpi-qstart_cpi)/qstart_cpi;
            cpi_change = Math.round(cpi_change*100)/100;
            $("#result").empty();
            $("#result").append("<p>" + 'Starting quarter CPI: ' + qstart_cpi + "</p>");
            $("#result").append("<p>" + 'Ending quarter CPI: ' + qend_cpi + "</p>");
            $("#result").append("<p>" + 'Change in CPI: ' + cpi_change + "%</p>");
        }
    )
}