// src/d3-visualization.js
// d3-script.js
d3.json('src/assets/prep_data.json').then(function(data) {
    console.log('data log', data);
    if (error) throw error;

    const svg = d3.select("#d3-visualization").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    const margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(data, d => d.playCount));
    y.domain(d3.extent(data, d => d.eggsCollected));

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .append("text")
        .attr("fill", "#000")
        .attr("x", width)
        .attr("dy", "2.5em")
        .attr("text-anchor", "end")
        .text("Play Count");

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("dy", "-2.5em")
        .attr("text-anchor", "end")
        .text("Eggs Collected");

    const dots = g.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.playCount))
        .attr("cy", d => y(d.eggsCollected))
        .attr("r", 5);

    document.getElementById('search-box').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        dots.attr("fill", d => d.userId.toLowerCase().includes(searchTerm) ? "red" : "black");
    });
}).catch(function(error) {
    console.error('Error loading or parsing data:', error);
});
