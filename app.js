// Initialize the map
var map = L.map('map').setView([51.05, -114.05], 11);

// Add an OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

var drawnPolyline;      // Store the initial polyline
var simplifiedPolyline; // Store the simplified polyline

// Initialize drawing
function startDrawing() {
    var latlngs = [];
    var tempPolyline = L.polyline([], {color: 'blue'}).addTo(map);

    // On map click, add a new point and update the temporary polyline
    map.on('click', function(e) {
        latlngs.push(e.latlng);
        tempPolyline.setLatLngs(latlngs);
    });

    // On double click, finish drawing
    map.on('dblclick', function() {
        if (latlngs.length > 1) {
            drawnPolyline = L.polyline(latlngs, {color: 'blue'}).addTo(map);
        }
        map.removeLayer(tempPolyline);
        map.off('click');
        map.off('dblclick');
    });
}

// Function for "Simplify" button
document.getElementById('simplify').addEventListener('click', function() {
    if (drawnPolyline) {
        var simplified = turf.simplify(drawnPolyline.toGeoJSON(), {tolerance: 0.01, highQuality: false});
        if (simplifiedPolyline) map.removeLayer(simplifiedPolyline);
        simplifiedPolyline = L.geoJSON(simplified, {color: 'red'}).addTo(map);
    }
});

// Function for "Reset" button
document.getElementById('reset').addEventListener('click', function() {
    if (drawnPolyline) map.removeLayer(drawnPolyline);
    if (simplifiedPolyline) map.removeLayer(simplifiedPolyline);
    startDrawing(); // Allow the user to draw a new polyline
});

// Initial start drawing
startDrawing();
