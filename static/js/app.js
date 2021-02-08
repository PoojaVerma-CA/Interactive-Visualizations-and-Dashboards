//build Panel with data from json
function buildPanel(sample) {
    //read metadata from json 
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];

      // select the panel id 
      var PANEL = d3.select("#sample-metadata");
  
      // clear the panel data
      PANEL.html("");
  
      // add key and value pair to the panel
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}: ${value}`);
      });
  
    });
  }
  
  // Build charts
  function bubbleCharts(sample) {
    //read samples from json
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var otu_ids = result.otu_ids;
      var sample_values = result.sample_values;
      var otu_labels = result.otu_labels;
            
      //get top 10 values
      top10Ids = otu_ids.slice(0, 10).reverse()
      top10Values = sample_values.slice(0, 10).reverse()
      top10Labels = otu_labels.slice(0, 10).reverse()

      // y tick for bar chart
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

      //define bar chart for top ten OTUs
      var barData = [
        {
          y: top10Ids.map(otuID => `OTU ${otuID}`),
          x: top10Values,
          text: top10Labels,
          type: "bar",
          orientation: "h",
          mode: "markers",
          marker: {
            size: sample_values,
          }
        }
      ];
      var barLayout = {
        title: "Top 10 OTUs for selected subject ID ",
        margin: { t: 25, l: 75 }
      };

      //Plot bar chart    
      Plotly.newPlot("bar", barData, barLayout);  

      // Build a Bubble Chart
      var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
          }
        }
      ];
      var bubbleLayout = {
        title: "sample values per OTU ID",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Value" },
        margin: { t: 30}
      };
  
      //plot bubble chart
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
      


    });
  }

  
  // function to Initializes the page
  function init() {
    // get reference to the selected dropdown element
    var selector = d3.select("#selDataset");
  
    // get sample names from json
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      // put sample names in drop down list
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample to build the initial plots
      var firstSample = sampleNames[0];
      buildPanel(firstSample);
      bubbleCharts(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildPanel(newSample);
    bubbleCharts(newSample);
  }
  
  // Initialize the dashboard
  init();
  