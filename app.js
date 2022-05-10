

async function calculate(){
    error = false;
    if(!valiDate($("#Q1").val())){
        $("#error-Q1").show();
        $("#error-Q1").text("Please enter a valid date")
        $("#Q1").attr("aria-invalid","true");
        error=true;
    } else {
        $("#error-Q1").hide();
        $("#Q1").attr("aria-invalid","false");

    }
    if(!valiDate($("#Q2").val())){
        $("#error-Q2").show();
        $("#error-Q2").text("Please enter a valid date");
        $("#Q2").attr("aria-invalid","true");
        error=true;
    } else {
        $("#error-Q2").hide();
        $("#Q2").attr("aria-invalid","false");
    }
    if(!(Number($("#current-rent").val()) > 0)){
        $("#error-current-rent").show();
        $("#error-current-rent").text("Please enter a number");
        $("#current-rent").attr("aria-invalid","true");
        error = true;
    } else {
        $("#error-current-rent").hide();
        $("#current-rent").attr("aria-invalid","false");
    }
    if(!error){
    console.log("calculating");
    start_parts = $("#Q1").val().split("/");
    end_parts = $("#Q2").val().split("/");

    start_date = new Date(start_parts[2], start_parts[1]-1, start_parts[0]);
    end_date = new Date(end_parts[2], end_parts[1]-1, end_parts[0]);
    if(!yearCheck(start_date, end_date)){
        $("#less-than-year").show();
    } else {
        $("#less-than-year").hide();
    }
    start = findQuarter(start_date);
    end = findLastQuarter(end_date);
    console.log(start);
    console.log(end);
    getObs(start, end);
    }
}

async function explain(){
    console.log("explaining");
    $(".explainer").slideDown();
    $("#explainer").attr('aria-expanded', function (i, attr) {
        return attr == 'true' ? 'false' : 'true'
    });
}

function yearCheck(start_date, end_date){
    year_later = new Date(start_date.getFullYear() + 1, start_date.getMonth(), start_date.getDate());
    if(year_later > end_date){
        return false;
    } else{
        return true;
    }
}

//Months look wrong beacuse they cound from 0
function findLastQuarter(date){
    month = date.getMonth();
    if(month < 3){
        return((date.getFullYear()-1) + "-" + "Q4");
    } else if(month < 6){
        quarterData = "Q1";
    } else if(month < 9){
        quarterData = "Q2";
    } else {
        quarterData = "Q3"
    }
    return date.getFullYear() + "-" + quarterData;
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
const requestURL = 'https://api.data.abs.gov.au/data/ABS,CPI,1.1.0/1.30014.10+20.8.Q?startPeriod=' + startQtr + '&endPeriod=' + endQtr + '&detail=dataonly';

const headers = new Headers({'Accept': 'application/vnd.sdmx.data+json'});
const request = new Request(requestURL, {headers: headers});

fetch(request).then(
        (value) => {
            return value.json()
        }   
    ).then(
        (value) => {
            console.log(value);
            results = value['data']['dataSets'][0]['series']['0:0:0:0:0']['observations'];
            Quarters = value['data']['structure']['dimensions']['observation'][0]['values'];
            lastQuarter = Quarters[Quarters.length -1].name;
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
            $("#result").slideDown();
            $("#max-new-rent").text("$" + max_new_rent);
            $("#allowable-increase").text("$" + max_increase);
            $("#start").text(start);
            $("#qstart_cpi").text(qstart_cpi);
            $("#end").text(lastQuarter);
            $("#qend_cpi").text(qend_cpi);
            $("#cpi_change").text(cpi_change);
            $("#allowable_increase").text(allowable_increase);
            $("#max_increase").text("$" + max_increase);
            //$("#result").append("<p>" + 'Maximum allowable increase: $' + max_increase + "</p>");
            // $("#result").append("<p>" + 'Starting quarter CPI: ' + qstart_cpi + "</p>");
            // $("#result").append("<p>" + 'Ending quarter CPI: ' + qend_cpi + "</p>");
            // $("#result").append("<p>" + 'Change in CPI: ' + cpi_change + "%</p>");
        }
    )
}

function valiDate(inputText)
  {
  var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  // Match the date format through regular expression
  if (dateformat.test(inputText))
  {
  //Test which seperator is used '/' or '-'
  var opera1 = inputText.split('/');
  var opera2 = inputText.split('-');
  lopera1 = opera1.length;
  lopera2 = opera2.length;
  // Extract the string into month, date and year
  if (lopera1>1)
  {
  var pdate = inputText.split('/');
  }
  else if (lopera2>1)
  {
  var pdate = inputText.split('-');
  }
  var dd = parseInt(pdate[0]);
  var mm  = parseInt(pdate[1]);
  var yy = parseInt(pdate[2]);
  // Create list of days of a month [assume there is no leap year by default]
  var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
  if (mm==1 || mm>2)
  {
  if (dd>ListofDays[mm-1])
  {
  return false;
  }
  }
  if (mm==2)
  {
  var lyear = false;
  if ( (!(yy % 4) && yy % 100) || !(yy % 400)) 
  {
  lyear = true;
  }
  if ((lyear==false) && (dd>=29))
  {
  return false;
  }
  if ((lyear==true) && (dd>29))
  {
  return false;
  }
  }
  }
  else
  {
  return false;
  }

return true;
  }