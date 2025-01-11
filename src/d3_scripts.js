
import { trainModel } from './logisticModel.js';

document.addEventListener('DOMContentLoaded', async function() {
    console.log('d3 script fires');

    const gameData = JSON.parse(sessionStorage.getItem("gameData"));

    if (!gameData) {
        
        gameData = await fetchData();
        console.log('data loaded from api')
    } else {
        console.log('Data loaded from sessionStorage');
       
    }
    try {
    const predictions = await trainModel();
    console.log('predictions in the d3', predictions);
    updateVisualization(gameData, predictions);
    }catch (error){console.error('error during training', error)}
});


export function updateVisualization(response, predictions) {
       
        console.log('data log', response.allUserData);
        console.log('predictions', predictions);
        const data = response.allUserData;



        d3.select("#d3-visualization").select("svg").remove();


        

        // Line Chart
        const svg1 = d3.select("#d3-visualization")
            .append("svg")
            .attr("width", '100%')
            .attr("height", 600)
            .attr("viewBox", "0 0 1000 600")
            .style("background-color", "rgba(240, 240, 240, 0.5)");  // Set background color

        const margin = { top: 20, right: 30, bottom: 50, left: 50 },
            width = 1000 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        const g1 = svg1.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x1 = d3.scaleLinear().range([0, width]),
            y1 = d3.scaleLinear().range([height, 0]);

        x1.domain(d3.extent(data, d => d.total_plays));
        y1.domain(d3.extent(data, d => d.total_eggs));

        // Add axes first
        g1.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x1));

        g1.append("g")
            .call(d3.axisLeft(y1));

        // Tooltip
        const tooltip1 = d3.select("#d3-visualization")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Now add the dots to the same `g` element
        g1.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x1(d.total_plays))
            .attr("cy", d => y1(d.total_eggs))
            .attr("r", 5)
            .attr("fill", "black")
            .on("mouseover", function(event, d) {
                tooltip1
                    .style("opacity", 1)
                    .html(`Play Count: ${d.total_plays}<br>Eggs Collected: ${d.total_eggs}`)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 10}px`);
            })
            .on("mousemove", function(event, d) {
                tooltip1
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 10}px`);
            })
            .on("mouseout", function() {
                tooltip1
                    .style("opacity", 0);
            });

        //visual logisitc regression
        
        const inputValues = data.map(user=>[
            user.total_death,
            user.total_eggs,
            user.total_plays,
            user.total_session_duration,
            user.opened_inventory,
            user.damage_taken
        
        ]);

        const xScale = d3.scaleLinear() 
            .domain([d3.min(inputValues, d => d[2]), d3.max(inputValues, d => d[2])])
            .range([0, width]); 

        const yScale = d3.scaleLinear() 
            .domain([0, 1]) 
            .range([height, 0]); 


        d3.select("#logistic-predictions-section").select("svg").remove();    

        const svg2 = d3.select("#logistic-predictions-section")
        .append("svg")
        .attr("width", '100%')
        .attr("height", 600)
        .attr("viewBox", "0 0 1000 600")
        .style("background-color", "rgba(240, 240, 240, 0.5)");
    
    const g2 = svg2.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    g2.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));
    
    g2.append("g")
        .call(d3.axisLeft(yScale));
    
    const colorScale = d3.scaleLinear()
        .domain([0, 1])
        .range(["steelblue", "red"]);
   
    g2.selectAll(".dot")
        .data(inputValues)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d[2])) 
        .attr("cy", (d, i) => yScale(predictions[i]))
        .attr("r", 5)
        .style("fill", (d, i) => colorScale(predictions[i])) 
        .on("mouseover", function(event, d) {
            tooltip1
                .style("opacity", 1)
                .html(`Play Count: ${d[2]}<br>Predicted Probability: ${predictions[i].toFixed(2)}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 10}px`);
        })
        .on("mousemove", function(event) {
            tooltip1
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", function() {
            tooltip1.style("opacity", 0);
        });
    
    // Add axis labels
    g2.append("text")
        .attr("x", (width - margin.left - margin.right) / 2)
        .attr("y", height - margin.bottom)
        .attr("text-anchor", "middle")
        .text("Total Plays");
    
    g2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height - margin.top - margin.bottom) / 2)
        .attr("y", -margin.left + 10)
        .attr("text-anchor", "middle")
        .text("Predicted Probability")


        // League Table
        const leagueData = data.sort((a, b) => b.win - a.win).slice(0, 3);
        const leagueTable = d3.select("#league-table tbody");

        leagueTable.selectAll("tr")
            .data(leagueData)
            .enter().append("tr")
            .html((d, i) => `
                <tr>
                    <td>${i + 1}</td>
                    <td>${d.user_id}</td>
                    <td>${d.win}</td>
                </tr>
            `);

        const userRank = d3.select("#user-rank");

        document.getElementById('search-box').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredData = data.filter(d => d.user_id.toLowerCase().includes(searchTerm));

            g1.selectAll(".dot")
            .data(filteredData)
            .join(
                enter => enter.append("circle").attr("class", "dot"),
                update => update,
                exit => exit.remove()
            )
            .attr("cx", d => x1(d.total_plays))
            .attr("cy", d => y1(d.total_eggs))
            .attr("r", 5)
            .attr("fill", "red")
            .on("mouseover", function(event, d) {
                tooltip1
                    .style("opacity", 1)
                    .html(`Play Count: ${d.total_plays}<br>Eggs Collected: ${d.total_eggs}`)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 10}px`);
            })
            .on("mousemove", function(event, d) {
                tooltip1
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 10}px`);
            })
            .on("mouseout", function() {
                tooltip1
                    .style("opacity", 0);
            });


            // Highlighting User's Row in the League Table
            const user = data.find(d => d.user_id.toLowerCase() === searchTerm);
            const allRows = d3.selectAll("#league-table tbody tr");
            allRows.classed("highlight", false); // Remove highlight from all rows

            if (user) {
                userRank.html(`User: ${user.user_id}<br>Rank: ${data.indexOf(user) + 1}<br>Wins: ${user.win}`);
                
                // Find and highlight the row with the user's data
                allRows.filter(d => d.user_id.toLowerCase() === searchTerm)
                    .classed("highlight", true); // Add highlight to the matching row
            } else {
                userRank.html("User not found");
            }
        });
    }

