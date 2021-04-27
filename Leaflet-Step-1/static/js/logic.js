// Create initial map object
var map = L.map("mapid", {
      center: [37.78, -122.42],
      zoom: 5
});

// Define basemap layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
}).addTo(map)

// Set API endpoint
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform GET request
d3.json(url, function(data){
      
      // Function for style
      function mapStyle(feature) {
            return {
                  opacity: 1,
                  fillOpacity: 1,
                  fillColor: mapColor(feature.properties.mag),
                  color: "#000000",
                  radius: mapRadius(feature.properties.mag),
                  stroke: true,
                  weight: 0.5
            }
      }

      // Function for color
      function mapColor(mag) {
            switch(true) {
                  case mag > 5:
                        return "#ea2c2c";
                  case mag > 4:
                        return "#eaa92c";
                  case mag > 3:
                        return "#d5ea2c";
                  case mag > 2:
                        return "#92ea2c";
                  case mag > 1:
                        return "#2ceabf";
                  default:
                        return "#2c99ea";
            }
      }

      // Function for radius
      function mapRadius(mag) {
            if (mag === 0) {
                  return 1
            }
            return mag * 4
      }

      // Generate geoJSON layer and add to map
      L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                  return L.circleMarker(latlng)
            },
            style: mapStyle,
            onEachFeature: function(feature, layer) {
                  layer.bindPopup("<h3>" + feature.properties.place + 
                  "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + "</p>" +
                  "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
            }
      }).addTo(map)

      // Generate Legend
      var legend = L.control({
            position: "bottomright"
      })

      legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info-legend")
            var grades = [0, 1, 2, 3, 4, ,5]
            var colors = ["#2c99ea", "#2ceabf", "#92ea2c", "#d5ea2c","#eaa92c", "#ea2c2c"]
            
            // Loop through colors to add to label
            for (var i=0; i < grades.length; i++) {
                  div.innerHTML +=
                  "<i style='background: " + colors[i] + "'></i> " +
                  grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
            }
            return div
      }

      legend.addTo(map)
})