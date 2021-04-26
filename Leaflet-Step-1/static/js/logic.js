// Set API endpoint
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform GET request
d3.json(url, function(data){
      // Send data.features object to createFeatures function
      createFeatures(data.features)
})

function createFeatures(earthquakeData) {
      // Function to run for each feature in array, and give each feature a popup describing place & time
      function onEachFeature(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + 
            "</h3><hr><p>" + 
            new Date(feature.properties.time) +"</p>")
      }
      // Create GeoJSON layer, and run onEachFeature for each piece of data in the array
      var earthquakes = L.geoJSON(earthquakeData, {
            onEachFeature: onEachFeature
      })
      // Send earthquake layer to createMap function
      createImageBitmap(earthquakes)
}
