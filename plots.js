var url = "http://127.0.0.1:8000/samples.json"

function init(){
    var selector = d3.select("#selDataset");

    d3.json(url).then(function(data){
        console.log(data)
        var sampleNames = data.names;
        sampleNames.forEach(function(sample){
            selector.append("option").text(sample).property("value", sample);
        })
    });
};

init();

function optionChanged(newSample){  
    // this is wher ethe id number selected is used to filter the dataset 
    console.log(newSample);
    buildMetadata(newSample);
    buildCharts(newSample);
};

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray)
    var result = resultArray[0];
    console.log(result)
    var PANEL = d3.select("#sample-metadata");
    
        // console.log(result)

    PANEL.html("");

    PANEL.append("h6").text("ID: " + result.id);
    PANEL.append("H6").text("ETHNICITY: " + result.ethnicity);
    PANEL.append("H6").text("GENDER: " + result.gender);
    PANEL.append("h6").text("age: " + result.age);
    PANEL.append("h6").text("location: " + result.location);
    PANEL.append("h6").text("BBTYPE: " + result.bbtype);
    PANEL.append("h6").text("WFREQ: " + result.wfreq);


  });
}