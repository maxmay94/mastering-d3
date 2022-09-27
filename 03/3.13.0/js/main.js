/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

const MARGIN = {
  LEFT: 100,
  RIGHT: 10,
  TOP: 10,
  BOTTOM: 100
}
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select('#chart-area').append('svg')
  .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append('g')
  .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)


// READ DATA
d3.csv('data/revenues.csv').then(data => {
  data.forEach(d => {
    d.revenue = Number(d.revenue)
    d.profit = Number(d.profit)
  })

  // SCALES
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.revenue)])
    .range([HEIGHT, 0])
  const x = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, WIDTH])
    .paddingInner(0.2)
    .paddingOuter(0.2)

  // DRAW AXES
  const xAxis = d3.axisBottom(x)
  g.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${HEIGHT})`)
    .call(xAxis)

  const yAxis = d3.axisLeft(y)
    .ticks(5)
    .tickFormat(d => "$" + d )
  g.append('g')
    .attr('class', 'y axis')
    .call(yAxis)

  // LABEL AXES
  // X Axis
  g.append('text')
    .attr('x', WIDTH / 2)
    .attr('y', HEIGHT + 40)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text('Month')
  // Y Axis
  g.append('text')
    .attr('x', -(HEIGHT / 2))
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Revenue')

  // DRAW RECTS
  const rects = g.selectAll('rect')
    .data(data)
  rects.enter().append('rect')
    .attr('x', d => x(d.month))
    .attr('y', d => y(d.revenue))
    .attr('width', x.bandwidth)
    .attr('height', d => HEIGHT - y(d.revenue))
    .attr('fill', 'green')

})