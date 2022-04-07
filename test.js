async function calculate(){
    start_parts = $("#Q1").val().split("/");
    end_parts = $("#Q2").val().split("/");
    start_date = new Date("20" + start_parts[2], start_parts[1]-1, start_parts[0]);
    end_date = new Date("20" + end_parts[2], end_parts[1]-1, end_parts[0]);
    start = findQuarter(start_date);
    end = findQuarter(end_date);
    console.log(start);
    console.log(end);
    getObs(start, end);
}

function findQuarter(date){
    quarterData = '';
    month = date.getMonth();
    if(month < 3){
        quarterData = "Q1";
    } else if(month < 6){
        quarterData = "Q2";
    } else if(month < 9){
        quarterData = "Q3";
    } else {
        quarterData = "Q4";
    }
    quarterData = date.getFullYear() + "-" + quarterData;
    return quarterData;
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
            console.log(results)
            results_array = $.map(results, function(el) {return el});
            qstart_cpi = results_array[0];
            qend_cpi = results[results_array.length -1];
            cpi_change = 100*(qend_cpi-qstart_cpi)/qstart_cpi;
            allowable_increase = cpi_change*1.1
            current_rent = $("#current-rent").val();
            max_increase = current_rent*(allowable_increase/100);
            max_new_rent = Number(current_rent) + max_increase;
            cpi_change = Math.round(cpi_change*100)/100;
            allowable_increase = Math.round(allowable_increase*100)/100;
            max_increase = Math.round(max_increase);
            max_new_rent = Math.round(max_new_rent);
            $("#result").empty();
            $("#result").append("<p>" + 'Starting quarter CPI: ' + qstart_cpi + "</p>");
            $("#result").append("<p>" + 'Ending quarter CPI: ' + qend_cpi + "</p>");
            $("#result").append("<p>" + 'Change in CPI: ' + cpi_change + "%</p>");
            $("#result").append("<p>" + 'Allowable increase: ' + allowable_increase + "%</p>");
            $("#result").append("<p>" + 'Maximum allowable increase: $' + max_increase + "</p>");
            $("#result").append("<p>" + 'Maximum new rent per week: $' + max_new_rent + "</p>");
        }
    )
}