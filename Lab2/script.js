mapboxgl.accessToken = 'pk.eyJ1IjoibGluZm9yZXN0bGkiLCJhIjoiY2xzMjllcDBwMDh6ejJwcDBlazJxbnI1eSJ9.bdN98Gu22uwxkP8QpzvUZg'; 

const map = new mapboxgl.Map({
    container: 'theft-map', 
    style: 'mapbox://styles/linforestli/clsjt2z9w01f701qrdzwi45sh',
    center: [-79.3838, 43.6504],
    zoom: 10,
});

map.on('load', () => {

    map.addSource('police-division-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/linforestli/WebMap/main/Lab2/sources/police_division.geojson' // Your URL to your buildings.geojson file
    });

    map.addLayer({
        'id': 'police-division-polygon',
        'type': 'fill',
        'source': 'police-division-data',
        'paint': {
            'fill-opacity': 0.6,
            'fill-color': '#8c0303'
        }
    });

    map.addSource('bike-theft-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/linforestli/WebMap/main/Lab2/sources/bike_theft.geojson'
    });

    map.addLayer({
        'id': 'bike-theft-point',
        'type': 'circle',
        'source': 'bike-theft-data',
        'paint': {
            'circle-radius': 2,
            'circle-color': '#026069'
        }
    });

    map.addSource('bike-parking-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/linforestli/WebMap/main/Lab2/sources/bike_parking.geojson'
    });

    map.addLayer({
        'id': 'bike-parking-point',
        'type': 'circle',
        'source': 'bike-parking-data',
    });
});
