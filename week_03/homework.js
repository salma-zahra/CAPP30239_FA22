
d3.csv("library_visits_jan22.csv").then(data => {

    for (let d of data) {
        d.num = +d.num; //force a number
    };

    const height = 400,
          width = 700,
          margin = ({ top: 25, right: 30, bottom: 35, left: 50 }); //defining margin as an object so we can give it values

    let svg = d3.select("#chart") 
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // for resizing element in browser
    
    let x = d3.scaleBand()
        .domain(data.map(d => d.branch)) // map will match the values in the csv. => indicates we're looping through the data. we're mapping and creating an array
        .range([margin.left, width - margin.right]) // pixels on page
        .padding(0.1); // padding is a stylistic element
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.num)]).nice() // nice rounds the top number to make it cleaner
        .range([height - margin.bottom, margin.top]); //svgs are built from top down, so this is reversed
    
    /* Update: simplfied axes */
    svg.append("g") // g is part of the html. Its a group element
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) // transform allows us to move location of axis by 5 pixels
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`) 
        .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar") // create bar groups
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");

    bar.append("rect") // add rect to bar group
        .attr("fill", "purple")
        .attr("x", d => x(d.branch)) // x position attribute
        .attr("width", x.bandwidth()) // this width is the width attr on the element. Bnadwidth is only used for bar chart because it comes with scaleband
        .attr("y", d => y(d.num)) // y position attribute
        .attr("height", d => y(0) - y(d.num)); // this height is the height attr on element
    
    bar.append("text") // add data labels
        .text(d => d.num)
        .attr("x", d => x(d.branch) + (x.bandwidth()/2))
        .attr("y", d => y(d.num) - 15) // +15 will put the data label inside the bar
        .attr("text-anchor", "middle")
        .style("fill", "black");

    svg.append("text") // add x axis label
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width)
        .attr("y", height - 6)
        .style("font-size", "14px") 
        .text("Library branch");

    svg.append("text") // add y axis label
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .style("font-size", "14px") 
        .text("Number of visits");

    svg.append("text") // add title
        .attr("x", width / 2 )
        .attr("y", 20)
        .style("text-anchor", "middle")
        .text("Library visits in January 2022");
});