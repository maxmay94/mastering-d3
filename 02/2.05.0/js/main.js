/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.5 - Activity: Adding SVGs to the screen
*/

const data = [25, 20, 10, 12, 15]

const svg = d3.select('#chart-area').append('svg')
  .attr('width', 400)
  .attr('height', 400)

const circles = svg.selectAll('circle')
  .data(data)

circles.enter().append('circle')
  .attr('cx', (d, i) => i * 50 + 50
  )
  .attr('cy', 100)
  .attr('r', (d) => d)
  .attr('fill', 'red')