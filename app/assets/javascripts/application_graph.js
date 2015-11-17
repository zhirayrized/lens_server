var renderTable = function(app, eventSources) {
  d3.select('#event-sources thead').selectAll('th')
    .data(d3.keys(eventSources[0])).
    enter().append('th').text(function(d) { return d; });

  var tr = d3.select('#event-sources tbody').selectAll('tr')
    .data(eventSources).enter().append('tr');

  var linkOrDataFn = function(i, e) {
    if(i == 0) {
      return '<a href="/applications/' + app + '/sources/' + e +'">' + e + '</a>';
    } else {
      return e;
    }
  };
  tr.selectAll('td')
    .data(function(d) { return d3.values(d); })
    .enter().append('td').html(function(d, i) {
      return linkOrDataFn(i, d);
    });
};

var renderChart = function(app, token) {
  var apiEndpoint = '/api/v1/applications/' + app + '/sources?api_token=' + token;

  d3.json(apiEndpoint, function(error, json) {
    renderTable(app, json.event_sources);

    var data = json.requests;

    var countFn = function(d) { return parseInt(d.count); }
    var parseDate = d3.time.format('%Y-%m-%d %X+00').parse;

    var svg = d3.select('#requests-chart');
    // var container = d3.select(svg.node().parentNode);

    var margin = {top: 20, right: 40, bottom: 30, left: 20}
    var width = parseInt(d3.select(svg.node().parentNode).style('width')) - margin.left - margin.right;
    var height = parseInt(d3.select(svg.node()).style('height')) - margin.top - margin.bottom;
    var barWidth = width / data.length;

    var x = d3.time.scale()
      .domain([
        parseDate(data[0].date),
        parseDate(data[data.length - 1].date)
      ])
      .range([barWidth / 2, width - barWidth / 2]);
    var y = d3.scale.linear()
      .domain([0, d3.max(data, countFn)])
      .range([height, 0])

    var xAxis = d3.svg.axis().scale(x).orient('bottom');

    var chart = svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var bar = chart.selectAll('g')
      .data(data)
    .enter().append('g')
      .attr('transform', function(d, i) { return 'translate(' + i * barWidth + ', 0)'; });

    bar.append('rect')
      .attr('class', 'bar')
      .attr('y', function(d) { return y(d.count) })
      .attr('width', barWidth - 1)
      .attr('height', function(d) { return height - y(d.count); });

    chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);
  });
}
