/*--------------------------------------------------------------------
GGR472 LAB 4: Incorporating GIS Analysis into web maps using Turf.js 
--------------------------------------------------------------------*/

/*--------------------------------------------------------------------
Step 1: INITIALIZE MAP
--------------------------------------------------------------------*/
// Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoibGluZm9yZXN0bGkiLCJhIjoiY2xzMjllcDBwMDh6ejJwcDBlazJxbnI1eSJ9.bdN98Gu22uwxkP8QpzvUZg'; //****ADD YOUR PUBLIC ACCESS TOKEN*****

// Initialize map and edit to your preference
const map = new mapboxgl.Map({
    container: 'map', // container id in HTML
    style: 'mapbox://styles/mapbox/streets-v12',  // ****ADD MAP STYLE HERE *****
    center: [-79.39, 43.65],  // starting point, longitude/latitude
    zoom: 12 // starting zoom level
});

map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
);
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

/*--------------------------------------------------------------------
Step 2: VIEW GEOJSON POINT DATA ON MAP
--------------------------------------------------------------------*/
//HINT: Create an empty variable
//      Use the fetch method to access the GeoJSON from your online repository
//      Convert the response to JSON format and then store the response in your new variable
let pedcyc_colli;

fetch('https://raw.githubusercontent.com/linforestli/WebMap/main/Lab4/data/pedcyc_collision_06-21.geojson')
    .then(response => response.json())
    .then(response => {
        console.log(response);
        pedcyc_colli = response;
    })

map.on('load', () => {
    map.addSource('colli-data', {
        type: 'geojson',
        data: pedcyc_colli,
    })

    map.addLayer({
        'id': 'colli-point',
        'type': 'circle',
        'source': 'colli-data',
        'paint': {
            'circle-radius': 3,
            'circle-color': '#aba8a1',
        }
    });
})


/*--------------------------------------------------------------------
    Step 3: CREATE BOUNDING BOX AND HEXGRID
--------------------------------------------------------------------*/
//HINT: All code to create and view the hexgrid will go inside a map load event handler
//      First create a bounding box around the collision point data then store as a feature collection variable
//      Access and store the bounding box coordinates as an array variable
//      Use bounding box coordinates as argument in the turf hexgrid function
map.on('load', () => {

    var enveloped = turf.envelope(pedcyc_colli);

    var bboxscaled = turf.transformScale(enveloped, 1.10);

    let bboxgeojson = {
        "type": "FeatureCollection",
        "features": [enveloped]
    }

    map.addSource('colli-bbox', {
        type: "geojson",
        data: bboxgeojson
    })

    let bboxcords = [
        bboxscaled.geometry.coordinates[0][0][0], 
        bboxscaled.geometry.coordinates[0][0][1], 
        bboxscaled.geometry.coordinates[0][2][0], 
        bboxscaled.geometry.coordinates[0][2][1]
    ]
    
    var hexgrid = turf.hexGrid(bboxcords, 0.5, {units: 'kilometers'})

    map.addSource('colli-hex', {
        type: "geojson",
        data: hexgrid
    })

    // map.addLayer({
    //     'id': 'colli-hex-polygon',
    //     'type': 'fill',
    //     'source': 'colli-hex',
    //     'paint': {
    //         'fill-opacity': 0.5,
    //         'fill-color': '#ECFFDC',
    //         'fill-outline-color': "white"
    //     }
    // });


    /*--------------------------------------------------------------------
Step 4: AGGREGATE COLLISIONS BY HEXGRID
--------------------------------------------------------------------*/
//HINT: Use Turf collect function to collect all '_id' properties from the collision points data for each heaxagon
//      View the collect output in the console. Where there are no intersecting points in polygons, arrays will be empty

    let collishex = turf.collect(hexgrid, pedcyc_colli, '_id', 'values');

    let maxcollis = 0;

    // go through each feature in the feature collection Collishex
    collishex.features.forEach((feature) => {
        // Get the count of incidents within the current feature
        feature.properties.COUNT = feature.properties.values.length;
        // Compare with the highest met so far
        if (feature.properties.COUNT > maxcollis) {
            // if higher than recorded, update the record variable
            maxcollis = feature.properties.COUNT;
        }
    })

    console.log(maxcollis)

    map.addSource('collis-hex-filled', {
        type: 'geojson',
        data: collishex
    })

    map.addLayer({
        'id': 'collis-hex-count',
        'type': 'fill',
        'source': 'collis-hex-filled',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'COUNT'],
                '#1984c5',
                10, '#22a7f0',
                20, '#63bff0',
                30, '#a7d5ed',
                40, '#e1a692',
                50, '#c23728',
            ],
            'fill-opacity': 0.8}
    })
    // /*--------------------------------------------------------------------
// Step 5: FINALIZE YOUR WEB MAP
// --------------------------------------------------------------------*/
//HINT: Think about the display of your data and usability of your web map.
//      Update the addlayer paint properties for your hexgrid using:
//        - an expression
//        - The COUNT attribute
//        - The maximum number of collisions found in a hexagon
//      Add a legend and additional functionality including pop-up windows
    map.on('click', 'collis-hex-count', (e) => {
        new mapboxgl.Popup() 
            .setLngLat(e.lngLat)
            .setHTML(
                "<b>Count: </b> " + e.features[0].properties.COUNT) 
            .addTo(map);
    });
})

