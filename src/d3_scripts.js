


document.addEventListener('DOMContentLoaded', async function() {
    console.log('d3 script fires');

    const gameData = sessionStorage.getItem("gameData");

    if (!gameData) {
        await fetchData();
        gameData = JSON.parse(sessionStorage.getItem(gameData));
        console.log('data loaded from api')
    } else {
        console.log('Data loaded from sessionStorage');
       
    }
    updateVisualization(gameData);
});
export function updateVisualization(response) {
        response = JSON.parse(response);
        console.log('data log', response.allUserData);
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

