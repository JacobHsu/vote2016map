$.ajaxSetup({
  async: false
});

var map, cunli, votes;

function initialize() {

  $('#map').height(window.outerHeight / 2);

  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 25.053699,
      lng: 121.507837
    },
    zoom: 10
  });

  $.getJSON('data/votes_all.json', function(data) {  
    votes = data;
  });

  // Initial villages border
  $.getJSON('data/cunli.json', function(data) {
    var geoJson = topojson.feature(data, data.objects.cunli);
    cunli = map.data.addGeoJson(geoJson);
  });

  cunli.forEach(function(value) {
    var area_name = value.getProperty('T_Name');
    var village_name = value.getProperty('V_Name');
    var datas = {};

    votes.forEach(function(vote, index) {
      if (vote.areaname != area_name || vote.villagename != village_name) {
        return;
      }

      vote["v"]["區域立委"].forEach(function(n) {
        if (!datas[n.pt]) {
          datas[n.pt] = 0
        }
        datas[n.pt] += parseInt(n.c.replace(","), 10);
      });
    })

    var result = [];
    for (var key in datas) {
      var tmp = {};
      tmp.pt = key;
      tmp.count = datas[key];

      result.push(tmp);
    }

    result.sort(function(a, b) {
      return b.count - a.count;
    })

    value.setProperty('datas', result);
  });

  map.data.setStyle(function(feature) {
    var value = feature.getProperty('datas');
    if (value.length ==0 ) {
      return;
    }

    color = ColorBar(value[0].pt);
    feature.setProperty('pt', color.name);
    if (!color.value) {
      return;
    }

    return {
      fillColor: color.value,
      fillOpacity: 0.6,
      strokeColor: 'gray',
      strokeWeight: 1
    }
  });

  map.data.addListener('mouseover', function(event) {
    var cunliTitle = event.feature.getProperty('C_Name') + event.feature.getProperty('T_Name') + event.feature.getProperty('V_Name');
    map.data.revertStyle();
    map.data.overrideStyle(event.feature, {
      fillColor: 'white'
    });

    var datas = event.feature.getProperty('datas');
    var vote = datas[0];
    var vote2 = datas[1];
    if(!vote){
      return;
    }

    var text_html = '<div>' + cunliTitle + ' ：' + vote.pt  + vote.count + ' 票'+' vs. '+vote2.pt + vote2.count + ' 票'+'</div>'

    $('#content').html(text_html).removeClass('info');
    highcharts(event, cunliTitle, datas);

  });

  map.data.addListener('mouseout', function(event) {
    map.data.revertStyle();
    $('#content').html('在地圖上滑動或點選以顯示數據').addClass('info');
  });

  map.data.addListener('click', function(event) {

    var cunliTitle = event.feature.getProperty('C_Name') + event.feature.getProperty('T_Name') + event.feature.getProperty('V_Name');
    var datas = event.feature.getProperty('datas');
    highcharts(event, cunliTitle, datas);

  });

  var highcharts = function(event, cunliTitle, datas){

      datas = datas.map(function(data){
        color = ColorBar(data.pt);
        return {
          name: data.pt,
          y: data.count,
          color: color.value
        }
      })

      $('#chart').highcharts({
              chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie'
              },
              title: {
                  text: cunliTitle
              },
              tooltip: {
                  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
              },
              plotOptions: {
                  pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                      },
                      showInLegend: true
                  }
              },
              series: [{
                  name: 'Votes',
                  colorByPoint: true,
                  data: datas
              }]
          });

  } 

}

google.maps.event.addDomListener(window, 'load', initialize);