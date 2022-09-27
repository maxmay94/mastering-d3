/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/

const data = d3.json('data/buildings.json').then(data => {
  data.forEach(d => {
    d.height = Number(d.height)
  })
  
  const svg = d3.select('#chart-area').append('svg')
  .attr('width', 400)
  .attr('height', 800)
  
  const rects = svg.selectAll('rect')
  .data(data)

  
  rects.enter().append('rect')
  .attr('x', (d, i) => (i*60))
  .attr('y', 200)
  .attr('height', (d) => d.height)
  .attr('width', '30')
  .attr('fill', 'gray')
  .append('text')
  .text(d.name)
})