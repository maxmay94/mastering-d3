/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM
const continents = ['europe', 'asia', 'americas', 'africa']
let year = 0

// SELECT char area and append SVG then append main Group
const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append('g')
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// SCALES
const x = d3.scaleLog()
	.base(100)
	.range([0, WIDTH])
	.domain([142, 150000])
// Scales
const y = d3.scaleLinear()
	.range([HEIGHT, 0])
	.domain([0, 90])
const area = d3.scaleLinear()
	.range([25*Math.PI, 1500*Math.PI])
	.domain([2000, 1400000000])
const continentColor = d3.scaleOrdinal(d3.schemeTableau10)

// AXES 
const xAxisGroup = g.append('g')
	.attr('class', 'x axis')
	.attr("transform", `translate(0, ${HEIGHT})`)

const yAxisGroup = g.append('g')
  .attr("class", "y axis")

// LABELS
const yearLabel = g.append('text')
	.attr('class', 'year label')
	.attr('font-size', 20)
	.attr('x', WIDTH  - (WIDTH / 30))
	.attr('y', HEIGHT - 5)
	.attr('text-anchor', 'middle')

// X label
const xLabel = g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Salary")

// Y label
const yLabel = g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (HEIGHT / 2))
  .attr("y", -30)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
	.text('Life Expectancy (Years)')

const legend = g.append('g')
	.attr('transform', `translate(${WIDTH - 10}, ${HEIGHT - 100})`)

continents.forEach((continent, i) => {
	const legendRow = legend.append('g')
		.attr('transform', `translate(0, ${i * 20})`)

	legendRow.append('rect')
		.attr('width', 10)
		.attr('height', 10)
		.attr('fill', continentColor(continent))

	legendRow.append('text')
		.attr('x', -10)
		.attr('y', 10)
		.attr('text-anchor', 'end')
		.style('text-transform', 'capitalize')
		.text(continent)
})

// READ DATA
d3.json("data/data.json").then(data =>{

	let newData = data.map(d => {
		d.year = Number(d.year)
		return d
	})

	d3.interval(() => {
		update(newData[year])
		year < newData.length - 1 ? year++ : year -= (newData.length - 1)
	}, 100)

})

// UPDATE FUNCTION
let update = (data) => {
	const t = d3.transition().duration(75)

	// DRAW AXES
	const xAxisCall = d3.axisBottom(x)
		.tickValues([400, 4000, 40000])
		.tickFormat(d => '$' + d)
	xAxisGroup.transition(t).call(xAxisCall)
		.selectAll('text')
		.attr("y", "10")
		.attr("x", "-5")
		.attr("text-anchor", "end")
		.attr("transform", "rotate(-40)")

	const yAxisCall = d3.axisLeft(y)
	yAxisGroup.transition(t).call(yAxisCall)

	const points = g.selectAll('circle')
		.data(data.countries, d => d.country)

	points.exit().remove()

	points.enter().append('circle')
		.attr('fill', d => continentColor(d.continent))
		.merge(points)
		.transition(t)
			.attr('cx', (d) => x(d.income))
			.attr('cy', (d) => y(d.life_exp))
			.attr('r', d => (Math.sqrt(area(d.population)) / Math.PI))

	yearLabel.text(data.year)
}