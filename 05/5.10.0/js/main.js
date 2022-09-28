/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM
let year = 1800

// SELECT char area and append SVG then append main Group
const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

const x = d3.scaleLog()
	.domain([0, WIDTH])
	.base(10)


// READ DATA
d3.json("data/data.json").then(data =>{

	let newData = data.map(d => {
		let maxPop = 0
		let maxLifeExp = 0
		d.countries.forEach(c => {
			if(c.life_exp > maxLifeExp) maxLifeExp = c.life_exp
			if(c.population > maxPop) maxPop = c.population
		})
		d.maxPop = maxPop
		d.maxLifeExp = maxLifeExp
		return d
	})
	

	
	console.log(newData)

	d3.interval(() => {
		update(newData)
	}, 2000)
})

let update = (data) => {
	// console.log(data)
}