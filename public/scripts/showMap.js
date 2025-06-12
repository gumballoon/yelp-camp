mapboxgl.accessToken = mapToken;

if (document.querySelector('#show-map')) {
    const map = new mapboxgl.Map({
        container: 'show-map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        center: foundCampground.geometry.coordinates, // starting position [lng, lat]
        zoom: 10, // starting zoom
    });
    
    // to add a pin to mark the location (= center)
    const marker = new mapboxgl.Marker({
        color:'#a2a7ab'
    })
        .setLngLat(foundCampground.geometry.coordinates)
        .setPopup(
            // to show a popup message when the pin is clicked-on
            new mapboxgl.Popup({offset:25})
                .setHTML(
                    `<div class="p-2 ps-0 pb-0">
                        <h5>${foundCampground.title}</h5>
                        <p class="mb-0">${foundCampground.location}</p>
                    </div>`
                )
        )       
        .addTo(map)

    map.addControl(new mapboxgl.NavigationControl());
}



