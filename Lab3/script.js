mapboxgl.accessToken = 'pk.eyJ1IjoibGluZm9yZXN0bGkiLCJhIjoiY2xzMjllcDBwMDh6ejJwcDBlazJxbnI1eSJ9.bdN98Gu22uwxkP8QpzvUZg'; 

// Create new map object
const map = new mapboxgl.Map({
    container: 'park-map', 
    style: 'mapbox://styles/linforestli/cltdcstsl016c01qk2pyg7f8d',
    center: [-79.3838, 43.6504],
    zoom: 10,
});

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

map.on('load', () => {
    // Add wards layer to the map
    map.addSource('ward-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/linforestli/WebMap/main/Lab3/sources/wards.geojson' // Link to the data source
    });

    map.addLayer({
        'id': 'ward-polygon',
        'type': 'fill',
        'source': 'ward-data',
        'paint': {
            'fill-opacity': 0.4,
            'fill-color': '#ECFFDC'
        }
    });

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
            'circle-radius': 3.5,
            'circle-color': '#4F7942'
        },
        'filter': ['==', ['get', 'TYPE'], 'Park'] 
    });

    map.addLayer({
        'id': 'cc-point',
        'type': 'circle',
        'source': 'park-data',
        'paint': {
            'circle-radius': 3.5,
            'circle-color': '#E4D00A'
        },
        'filter': ['==', ['get', 'TYPE'], 'Community Centre'] 
    });


    // Create pop-ups for both park layer and community centre layer
    map.on('click', 'cc-point', (e) => {
        new mapboxgl.Popup() 
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.ASSET_NAME + "<br>" +
                "<b>Address: </b> " + e.features[0].properties.ADDRESS + "<br>" + 
                "<b>Amenities:  </b> " + e.features[0].properties.AMENITIES) 
            .addTo(map);
    });

    map.on('click', 'park-point', (e) => {
        new mapboxgl.Popup() //Declare new popup object on each click
            .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
            .setHTML(e.features[0].properties.ASSET_NAME + "<br>" +
                "<b>Address: </b> " + e.features[0].properties.ADDRESS + "<br>" + 
                "<b>Amenities:  </b> " + e.features[0].properties.AMENITIES) //Use click event properties to write text for popup
            .addTo(map); //Show popup on map
    });

    // Change the size of dots while zooming
    map.on('zoom', () => {
        var zoomLevel = map.getZoom();
        if (zoomLevel > 8) {
            map.setPaintProperty('park-point', 'circle-radius', 4);
            map.setPaintProperty('cc-point', 'circle-radius', 4);
        } else {
            map.setPaintProperty('park-point', 'circle-radius', 2.5);
            map.setPaintProperty('cc-point', 'circle-radius', 2.5);
        }
    });
    
    // Implementation of full extent button
    document.getElementById('returnbutton').addEventListener('click', () => {
        map.flyTo({
            center: [-79.3838, 43.6504],
            zoom: 10,
            essential: true
        });
    });

    // Filters
    document.getElementById('show-parks').addEventListener('change', function(e) {
        map.setLayoutProperty('park-point', 'visibility', e.target.checked ? 'visible' : 'none');
    });
    
    document.getElementById('show-cc').addEventListener('change', function(e) {
        map.setLayoutProperty('cc-point', 'visibility', e.target.checked ? 'visible' : 'none');
    });
    

    
    
});
