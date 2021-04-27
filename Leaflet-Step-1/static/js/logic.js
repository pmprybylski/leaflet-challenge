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
                  fillColor: mapColor(feature.geometry.coordinates[2]),
                  color: "#000000",
                  radius: mapRadius(feature.properties.mag),
                  stroke: true,
                  weight: 0.5
            }
      }

      // Function for color
      function mapColor(depth) {
            switch(true) {
                  case depth > 50:
                        return "#ea2c2c";
                  case depth > 40:
                        return "#eaa92c";
                  case depth > 30:
                        return "#d5ea2c";
                  case depth > 20:
                        return "#92ea2c";
                  case depth > 10:
                        return "#2ceabf";
                  default:
                        return "#2c99ea";
            }
      }

      // Function for radius
      function mapRadius(mag) {
            return mag * 4
      }

      // Generate geoJSON layer and add to map
      L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                  return L.circleMarker(latlng)
            },
            style: mapStyle,
            onEachFeature: function(feature, layer) {
                  layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr>" +
                  "<p>" + "Magnitude: " + feature.properties.mag + "</p>" +
                  "<p>" + "Depth: " + feature.geometry.coordinates[2] + "</p>" +
                  "<p>" + new Date(feature.properties.time) + "</p>")
            }
      }).addTo(map)

      // Generate Legend
      function getColor(depth) {
            return      depth > 50 ? "#ea2c2c" :
                        depth > 40 ? "#eaa92c" :
                        depth > 30 ? "#d5ea2c" :
                        depth > 20 ? "#92ea2c" :
                        depth > 10 ? "#2ceabf" :
                        depth > 00 ? "#2c99ea" :
                        "#922AFA"
      }
      
      var legend = L.control({
            position: "bottomleft",
      })

      legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend"),
            depth = [0, 10, 20, 30, 40, 50],
            labels =[]
            
            // Loop through colors to add to label
            for (var i=0; i < depth.length; i++) {
                  from = depth[i]
                  to = depth[i + 1]
                  
                  labels.push(
                        '<i style="background:' + getColor(from + 1) + '">&nbsp&nbsp&nbsp&nbsp&nbsp</i> ' +
                        from + (to ? '&ndash;' + to : '+'));
            }

            div.innerHTML = labels.join('<br>');
            return div;
      }

      legend.addTo(map)
})