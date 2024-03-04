mapboxgl.accessToken = 'pk.eyJ1IjoibGluZm9yZXN0bGkiLCJhIjoiY2xzMjllcDBwMDh6ejJwcDBlazJxbnI1eSJ9.bdN98Gu22uwxkP8QpzvUZg'; 

// Create new map object
const map = new mapboxgl.Map({
    container: 'park-map', 
    style: 'mapbox://styles/linforestli/cltdcstsl016c01qk2pyg7f8d',
    center: [-79.3838, 43.6504],
    zoom: 10,
});

map.on('load', () => {
    // Add park layer to the map
    map.addSource('park-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/linforestli/WebMap/main/Lab3/sources/parks.geojson' // Link to the data source
    });

    map.addLayer({
        'id': 'park-point',
        'type': 'circle',
        'source': 'park-data',
        'paint': {
            'circle-radius': 2,
            'circle-color': '#4F7942'
        }
    });
});
