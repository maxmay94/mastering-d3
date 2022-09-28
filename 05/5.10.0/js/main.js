/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM
let year = 0

// SELECT char area and append SVG then append main Group
const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append('g')
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// SCALES
const x = d3.scaleLinear()
	.range([0, WIDTH])

const y = d3.scaleLinear()
	.range([HEIGHT, 0])

// AXES 
const xAxisGroup = g.append('g')
	.attr('class', 'x axis')
	.attr("transform", `translate(0, ${HEIGHT})`)

const yAxisGroup = g.append('g')
  .attr("class", "y axis")

// READ DATA
d3.json("data/data.json").then(data =>{

	let newData = data.map(d => {
		let maxPop = 0
		let maxLifeExp = 0
		let maxIncome = 0
		d.countries.forEach(c => {
			if(c.life_exp > maxLifeExp) maxLifeExp = c.life_exp
			if(c.population > maxPop) maxPop = c.population
			if(c.income > maxIncome) maxIncome = c.income
		})
		d.maxPop = maxPop
		d.maxLifeExp = maxLifeExp
		d.maxIncome = maxIncome
		d.year = Number(d.year)
		return d
	})

	const x = d3.scaleLog()
		.domain([0, 1390110388])
		.base(10)

	d3.interval(() => {
		update(newData[year])
		year < newData.length - 1 ? year++ : year -= newData.length - 1
	}, 1000)

})


// UPDATE FUNCTION
let update = (data) => {
	// console.log(data)
	const t = d3.transition().duration(500)

	x.domain([0, data.maxIncome])
	y.domain([0, data.maxPop])

	// DRAW AXES
	const xAxisCall = d3.axisBottom(x)
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
		.attr('class', 'circle')
		.data(data)

	points.exit()
		.attr('fill', 'red')
		.transition(t)
			.attr('cy', y(0))
		.remove()


	points.enter().append('circle')
		.attr('cy', y(0))
		.attr('fill', 'green')
		.attr('r', 5)
		.merge(points)
		.transition(t)
			.attr('cx', (d) => x(d.income))
			.attr('cy', (d) => y(d.population))

	const text = data.year
}