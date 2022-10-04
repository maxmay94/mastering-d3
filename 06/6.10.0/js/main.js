/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 3 - CoinStats
*/
		
const MARGIN = { LEFT: 20, RIGHT: 100, TOP: 50, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

let newData = new Map()
let curr_coin = 'bitcoin'
let y_selector = 'price_usd'

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// time parser for x-scale
const parseTime = d3.timeParse("%Y")
// for tooltip
const bisectDate = d3.bisector(d => d.year).left

// scales
const x = d3.scaleTime().range([0, WIDTH])
const y = d3.scaleLinear().range([HEIGHT, 0])

// axis generators
const xAxisCall = d3.axisBottom()
const yAxisCall = d3.axisLeft()
	.ticks(6)
	.tickFormat(d => `${parseInt(d / 1000)}k`)

// axis groups
const xAxis = g.append("g")
	.attr("class", "x axis")
	.attr("transform", `translate(0, ${HEIGHT})`)
const yAxis = g.append("g")
	.attr("class", "y axis")
    
// y-axis label
yAxis.append("text")
	.attr("class", "axis-title")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.attr("fill", "#5D6971")
	.text("Population")

// x-axis label
yAxis.append("text")
	.attr("class", "axis-title")
	.attr('transform', `translate(${WIDTH / 2}, ${HEIGHT + 50})`)
	.style("text-anchor", "middle")
	.attr("fill", "#5D6971")
	.attr('font-size', '20px')
	.text("Date")

// line path generator
const line = d3.line()
	.x(d => x(d.year))
	.y(d => y(d.value))

d3.json("data/coins.json").then(data => {
	// clean data
	let parseTime = d3.timeParse('%d/%m/%Y')
	for(const coin in data) {
		newData.set(coin, data[coin].filter(d => {
			const dataExists = (d.market_cap > 0 && d.price_usd > 0)
			d['24h_vol'] = Number(d['24h_vol'])
			d.date = parseTime(d.date)
			d.market_cap = Number(d.market_cap)
			d.price_usd = Number(d.price_usd)
			return dataExists
		}))
	}
	update(newData.get(curr_coin))
})


function update(data) {
	// set scale domains
	x.domain([
		(data[0]['date']),
		(data[Object.keys(data).length - 1]['date'])
	])
	y.domain([
		d3.min(data, d => d[y_selector]) / 1.005, 
		d3.max(data, d => d[y_selector]) * 1.005
	])

	// generate axes once scales have been set
	xAxis.call(xAxisCall.scale(x))
	yAxis.call(yAxisCall.scale(y))

	// add line to chart
	g.append("path")
		.attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", "grey")
		.attr("stroke-width", "3px")
		.attr("d", line(data))

	/******************************** Tooltip Code ********************************/
	const focus = g.append("g")
		.attr("class", "focus")
		.style("display", "none")

	focus.append("line")
		.attr("class", "x-hover-line hover-line")
		.attr("y1", 0)
		.attr("y2", HEIGHT)

	focus.append("line")
		.attr("class", "y-hover-line hover-line")
		.attr("x1", 0)
		.attr("x2", WIDTH)

	focus.append("circle")
		.attr("r", 7.5)

	focus.append("text")
		.attr("x", 15)
		.attr("dy", ".31em")

	g.append("rect")
		.attr("class", "overlay")
		.attr("width", WIDTH)
		.attr("height", HEIGHT)
		.on("mouseover", () => focus.style("display", null))
		.on("mouseout", () => focus.style("display", "none"))
		.on("mousemove", mousemove)

	function mousemove() {
		const x0 = x.invert(d3.mouse(this)[0])
		const i = bisectDate(data, x0, 1)
		const d0 = data[i - 1]
		const d1 = data[i]
		const d = x0 - d0.year > d1.year - x0 ? d1 : d0
		focus.attr("transform", `translate(${x(d.year)}, ${y(d.value)})`)
		focus.select("text").text(d.value)
		focus.select(".x-hover-line").attr("y2", HEIGHT - y(d.value))
		focus.select(".y-hover-line").attr("x2", -x(d.year))
	}
	/******************************** Tooltip Code ********************************/
}

$("#coin-select").on('change', () => {
		curr_coin = $('#coin-select').val()
		update(newData.get(curr_coin))
})

$("#var-select").on('change', () => {
		y_selector = $('#var-select').val()
		update(newData.get(curr_coin))
})

$("#date-slider").slider({
	min: 2005,
	max: 2015,
	values: [2005, 2015],
	step: 1,
	slide: (event, ui) => {
		update(newData.get(curr_coin))
	}
})