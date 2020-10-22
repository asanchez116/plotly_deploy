url = 'https://raw.githubusercontent.com/asanchez116/plotly_deploy/master/samples.json'

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json(url).then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json(url).then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  
  // 2. Use d3.json to load and retrieve the samples.json file 
  // d3.json("samples.json").then((data) => {
  d3.json(url).then(function(data){
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredArray = sampleArray.filter(filterObj => filterObj.id === sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = filteredArray[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // var otu_ids = data.samples[0].otu_ids;
    var otu_labels = data.samples[0].otu_labels.slice(0, 10);
    // var sample_values = data.samples[0].sample_values.slice(0, 10).reverse();

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 
    // var otu_top_ten = data.samples[0].otu_ids.slice(0, 10).reverse();
    // var otu_ids = otu_top_ten.map(d => "OTU " + d);
    // var labels = data.samples[0].otu_labels.slice(0, 10);

    // if(data.samples[0].id == sample){
    //   console.log(data.samples[0].sample_values.sort((a, b)=>b-a).slice(0, 10))
    // }

    for (i=0; i< data.samples.length; i++){
      if (data.samples[i].id == sample){
        var sample_values = data.samples[i].sample_values.sort((a, b)=> b-a).slice(0, 10).reverse();
        var sample_values_all = data.samples[i].sample_values
        var otu_top_ten = data.samples[i].otu_ids.slice(0, 10).reverse();
        var otu_ids = otu_top_ten.map(d => "OTU " + d);
        var otu_ids_all = data.samples[i].otu_ids
        var labels = data.samples[i].otu_labels.slice(0, 10);
      }
    };

    for (i=0; i< data.metadata.length; i++){
      if (data.metadata[i].id == sample){
        var wfreq = data.metadata[i].wfreq;
      }
    };
    
    var config = {responsive: true};
    // 8. Create the trace for the bar chart. 
    var barData = [{
      type: 'bar',
      x: sample_values,
      y: otu_ids,
      text: labels,
      orientation: 'h',
      marker: {
        color: 'rgb(158,202,225)',
        opacity: 0.6,
        line: {
          color: 'rgb(8,48,107)',
          width: 1.5
        }
      }
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
    };


    // // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    
    var bubbleData = {
      x: otu_ids_all,
      y: sample_values_all,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values_all,
        color: ['#f3cec9', '#e7a4b6', '#cd7eaf', '#a262a9', '#6f4d96', '#3d3b72', '#182844']
      }
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample (OTU)", 
      showlegend: false,
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', [bubbleData], bubbleLayout);

  //Belly Button Washing Frequency


    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
        domain: {x:[0,1], y:[0,1]},
        value: wfreq, 
        title: {text:"Belly Button Washing Frequency<br><span style='font-size:0.8em;color:black'>Scrubs Per Week</span>"},
        type: "indicator",
        mode: "gauge+number",
        bar: { color: "white" },
        gauge: {
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow"},
            { range: [6, 8], color: 'green'},
            { range: [8, 10], color: "darkgreen"}
          ],
          
          
        }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      paper_bgcolor: "white", 
      font: {family: "Arial"},
      colorway : ['#f3cec9', '#e7a4b6', '#cd7eaf', '#a262a9', '#6f4d96', '#3d3b72', '#182844']

    };

    // 6. Use Plotly to plot the gauge data and layout.
    
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  })};

