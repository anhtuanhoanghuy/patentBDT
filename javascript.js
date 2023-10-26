var rssi;
var gps =  [];
var buttons = ['#button-3', '#button-4', '#button-5', '#button-6'];
var tmp=[0,0,0,0];
// variables for the first series
var chart_container1 = 'chart-container1';
var chart_title1 = 'Dữ liệu Nhiệt độ';
var field1_number = 1;
var field1_color = '#d62020';
var y_axis_title1 = 'Nhiệt độ (' + String.fromCharCode(176) + 'C)';
var id_input1 = '#data-value3';
var unit1 = String.fromCharCode(176) + 'C';

// variables for the second series
var chart_container2 = 'chart-container2';
var chart_title2 = 'Dữ liệu Độ mặn';
var field2_number = 2;
var field2_color = '#00aaff';
var y_axis_title2 = 'Độ mặn (S' + String.fromCharCode(8240) + ')';
var id_input2 = '#data-value4';
var unit2 = 'S' + String.fromCharCode(8240);

// variables for the third series
var chart_container3 = 'chart-container3';
var chart_title3 = 'Dữ liệu Độ dẫn';
var field3_number = 3;
var field3_color = '#009900';
var y_axis_title3 = 'Độ dẫn (mS/cm)';
var id_input3 = '#data-value5';
var unit3 = "mS/cm";

// variables for the fourth series
var chart_container4 = 'chart-container4';
var chart_title4 = 'Dữ liệu nồng độ Ion';
var field4_number = 4;
var field4_color = '#FF8000';
var y_axis_title4 = 'Nồng độ Ion (mol/l)';
var id_input4 = '#data-value6';
var unit4 = "mol/l";

// variables for the sixth series
var chart_container6 = 'chart-container6';
var chart_title6 = 'RSSI';
var field6_number = 6;
var field6_color = '#990099';
var y_axis_title6 = 'RSSI';
var id_input6 = '#data-value1';
var unit6 = "%";

// user's timezone offset
var my_offset = new Date().getTimezoneOffset();

// when the document is ready
$(document).ready(function() {
  $.getJSON("https://ipinfo.io/", onLocationGot);
  fetchState();
  controlDevices();
  // chart variable
  var chart1 = addChart(chart_container1, chart_title1,y_axis_title1);
  addSeries(field1_number, field1_color,chart1,id_input1,unit1);
  // add the second series
  var chart2 = addChart(chart_container2, chart_title2,y_axis_title4);
  addSeries(field2_number, field2_color, chart2,id_input2,unit2);
  // add the third series
  var chart3 = addChart(chart_container3, chart_title3,y_axis_title3);
  addSeries(field3_number, field3_color, chart3,id_input3,unit3);
// add the fourth series
  var chart4 = addChart(chart_container4, chart_title4,y_axis_title4);
  addSeries(field4_number, field4_color, chart4,id_input4,unit4);
// add the sixth series
  var chart6 = addChart(chart_container6, chart_title6,y_axis_title6);
  addSeries(field6_number, field6_color, chart6,id_input6,unit6);
});

// **************************************************************************************-
// add the base chart
function addChart(chart_container, chart_title, y_axis_title) {
  // variable for the local date in milliseconds
  var localDate;

  // specify the chart options
  var chartOptions = {
    chart: {
      renderTo: chart_container,
      defaultSeriesType: 'line',
      backgroundColor: '#ffffff',
      events: { }
    },
    title: { text: chart_title },
    plotOptions: {
      series: {
        marker: { radius: 3 },
        animation: true,
        step: false,
        borderWidth: 0,
        turboThreshold: 0
      }
    },
    tooltip: {
      // reformat the tooltips so that local times are displayed
      formatter: function() {
        var d = new Date(this.x + (my_offset*60000));
        var n = (this.point.name === undefined) ? '' : '<br>' + this.point.name;
        return this.series.name + ':<b>' + this.y + '</b>' + n + '<br>' + d.toDateString() + '<br>' + d.toTimeString().replace(/\(.*\)/, "");
      }
    },
    xAxis: {
      type: 'datetime',
      title: { text: 'Thời gian' }
    },
    yAxis: { title: { text: y_axis_title } },
    exporting: { enabled: false },
    legend: { enabled: false },
    credits: {
      text: 'uet.vnu.edu.vn',
      style: { color: '#D62020' }
    }
  };

  // draw the chart
  return new Highcharts.Chart(chartOptions);
}

// **************************************************************************************
// add a series to the chart
function addSeries(field_number, color, chart,id_input,unit) {
  var field_name = 'field' + field_number;

  // get the data with a webservice call
  function fetch() {
    $.getJSON('https://api.thingspeak.com/channels/2045404/fields/' + field_number + '.json?offset=0&round=2&api_key=api_key=Y1F9XUK9TM11GRKN&results=10', function(data) {
    // blank array for holding chart data
    var field_value = [];
    var sum = 0;
    // iterate through each feed
    $.each(data.feeds, function(index,feed) {
      var point = new Highcharts.Point();
      // set the proper values
      var value = this[field_name];
      if(id_input=='#data-value1'){
        $(id_input).val( value + " " + unit);
      }
      point.x = getChartDate(this.created_at);
      point.y = parseFloat(value);
      sum+=point.y;    
      // add location if possible
      if (this.location) { point.name = this.location; }
      // if a numerical value exists add it
      if (!isNaN(parseInt(value))) { field_value.push(point); }
    });
    // add the chart data
    chart.addSeries({ data: field_value, name: data.channel[field_name], color: color });
    if(id_input!='#data-value1'){
      $(id_input).val((sum/10).toFixed(2) + " " + unit);
    }
    });
  }
  fetch();
  setInterval(fetch,15000);
}

// ***********************************************************************************************
// converts date format from JSON
function getChartDate(d) {
  return Date.parse(d) - (my_offset * 60000);
}

// **************************************************************************************
//Get devices state
function fetchState() {
  function readState(){
    $.getJSON('https://api.thingspeak.com/channels/2045404/fields/5.json?offset=0&round=2&api_key=api_key=Y1F9XUK9TM11GRKN&results=1', function(data) {
    $.each(data.feeds, function(index,feed) {
    console.log(this['field5']);
    for(var i= 0;i<buttons.length;i++) {
      tmp[i] = this['field5'].charAt(i+1);
      if(this['field5'].charAt(i+1)=='0') {
        $(buttons[i]).prop('checked',true);
      } else {
        $(buttons[i]).prop('checked',false);
      }
    }
    });
    //Get GPS
    var GPS = ConvertDecimalToDMS(data.channel.latitude) + ', ' + ConvertDecimalToDMS(data.channel.longitude);
    $("#data-value2").val(GPS);
    gps[0] = data.channel.latitude;
    gps[1] = data.channel.longitude;
    }); 
  }
readState();
setInterval(readState,1000);
}

// **************************************************************************************
//Control devices
function controlDevices(){
  for (var i = 0; i < buttons.length; i++) {
    (function(i) {
      $(buttons[i]).change(function() {
        if (this.checked) {
          tmp[i] = '0';
        } else {
          tmp[i] = '1';
        }
        var html = "https://api.thingspeak.com/update.json?api_key=7WGV3FAAC35MBEB6&field5=1";
        html+=tmp.join("");
        console.log("html: " + html);
        $.post( html, function( data ) {
            if (data==0) {
              console.log("Lỗi mạng, chưa gửi được dữ liệu");
              alert("Vui lòng thử lại sau 10 giây")
            } else {
              console.log("Dữ liệu được gửi thành công");
              alert("Thành công");
            }
          });
      });
      
    })(i);
  }
}

// **************************************************************************************
//Covert decimaltoDMS
function ConvertDecimalToDMS (DD) {
  // Tách số thập phân thành hai phần: độ và số lẻ
  let degree = DD.split (".")[0]; // lấy phần trước dấu chấm
  let decimal = DD.split (".")[1]; // lấy phần sau dấu chấm

  // Tính ra phút từ số lẻ
  let minute = Math.floor (Number ("0." + decimal) * 60);

  // Tính ra giây từ số lẻ
  let second = Math.round ((Number ("0." + decimal) * 60 - minute) * 60);

  // Trả về kết quả dạng string
  return degree + "°" + minute + "'" + second + "\"";
}

// **************************************************************************************
//Get weather
function onLocationGot(info) {
  let position = info.loc.split(",");
  var lat = position[0];
  var lon = position[1];
  url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon +'&appid=2a57a02df82bc7d87088d657a944cb5a&units=metric&lang=vi';
  async function asyncCall() {
      const response = await fetch(url);
      const json = await response.json(); 
      var data = JSON.parse(JSON.stringify(json));
      var name = data.name;
      var temp = "Nhiệt độ: " + data.main.temp +"&degC";
      var humidity = "Độ ẩm: " + data.main.humidity + "%";
      var weather = data.weather[0].description;
      weather = weather.charAt(0).toUpperCase() + weather.slice(1)
      var icon = data.weather[0].icon;
      var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
      $('#name').html(name);
      $('#temp').html(temp); 
      $('#humid').html(humidity);
      $('#description').html(weather);
      $('#icon').attr('src',iconurl)
  }
  asyncCall();
}

// **************************************************************************************
//Get map
 function getMap() {
  var map = new Microsoft.Maps.Map('#map', {
    credentials: 'ApmjZMScf3QndIcQhYNlkzZrFokZjkqUjGE6y-3Y00-sJdpjwUvoVDlaEFQPjctJ',
  });
 //Request the user's location
  
  var loc = new Microsoft.Maps.Location(
    gps[0],gps[1]);

  //Add a pushpin at the user's location.
  var pin = new Microsoft.Maps.Pushpin(loc);
  map.entities.push(pin);

  //Center the map on the user's location.
  map.setView({ center: loc, zoom: 15 });

}
 

