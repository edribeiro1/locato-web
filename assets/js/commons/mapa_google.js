var MAPA_GOOGLE = {
    _map: {},
    _markers: [],
    _objLayers: {},
    _polyline: {},
    _popup: new google.maps.InfoWindow(),
    criaMapa: function (idElemento, options) {
        self = this;
        MAPA_GOOGLE._map = new google.maps.Map(document.getElementById(idElemento), $.extend({
            zoom: 4,
            center: { lat: -22.49745, lng: -49.49745 },
            mapTypeId: 'roadmap',
            mapTypeControl: true,
            
            maxZoom: 18
        }, options));
    },
    criaMarkers: function (arrayMarkersLatLng) {
        if ($.isArray(arrayMarkersLatLng)) {
            for (i in arrayMarkersLatLng) {
                let configMarker = arrayMarkersLatLng[i];
                let opts = $.type(configMarker.options) == 'object' ? configMarker.options : {};
                let marker = new google.maps.Marker({
                    position: configMarker.position,
                    map: MAPA_GOOGLE._map,
                    icon: configMarker.icon,
                    id: (configMarker.id ? configMarker.id : 0)
                });

                if (configMarker.hasOwnProperty(popupContent)) {
                    MAPA_GOOGLE._popupEvent(popupContent, marker);
                }
                MAPA_GOOGLE._markers.push(marker);
            }
        }
    },
    zoomMarkers: function () {
        if (MAPA_GOOGLE._markers.length > 0) {
            let bounds = new google.maps.LatLngBounds();
            for (i in MAPA_GOOGLE._markers) {
                bounds.extend(MAPA_GOOGLE._markers[i].getPosition());
            }
            MAPA_GOOGLE._map.fitBounds(bounds);
        }
    },
    zoomMarker: function (cordinate) {
        let bounds = new google.maps.LatLngBounds();
        bounds.extend(cordinate);
        MAPA_GOOGLE._map.fitBounds(bounds);
    },
    setView: function (lat, lng, zoom) {

    },
    criaPolyline: function (arrayCoordinates) {
        MAPA_GOOGLE._polyline = new google.maps.Polyline({
            path: arrayCoordinates,
            geodesic: true,
            strokeColor: '#00b3fd',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });

        MAPA_GOOGLE._polyline.setMap(MAPA_GOOGLE._map);
    },
    limparMarkers: function () {
        for (i in MAPA_GOOGLE._markers) {
            MAPA_GOOGLE._markers[i].setMap(null);
        }
        MAPA_GOOGLE._markers = [];
    },
    limparPolyline: function () {
        if (!$.isEmptyObject(MAPA_GOOGLE._polyline)) {
            MAPA_GOOGLE._polyline.setMap(null);
        }
    },
    limparMapa: function () {
        MAPA_GOOGLE.limparMarkers();
        MAPA_GOOGLE.limparPolyline();
    },
    bounceMarker: function (id) {
        for (i in MAPA_GOOGLE._markers) {
            if (MAPA_GOOGLE._markers[i].id == id) {
                MAPA_GOOGLE._markers[i].setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function () {
                    for (j in MAPA_GOOGLE._markers) {
                        if (MAPA_GOOGLE._markers[j].id == id) {
                            MAPA_GOOGLE._markers[j].setAnimation(null);
                            break;
                        }
                    }
                }, 3000);
                break;
            }
        }
    },
    getIcon: function (ignicao, tipo) {
        let prefix = parseInt(ignicao) == 1 ? (baseUrl + 'images/markers/on_') : (baseUrl + 'images/markers/off_');
        let urlImg = "";
        switch (tipo) {
            case 'Bicicleta': urlImg = prefix + 'bike.png'; break;
            case 'Moto': urlImg = prefix + 'motorcycle.png'; break;
            case 'Carro': urlImg = prefix + 'car.png'; break;
            case 'Caminhão': urlImg = prefix + 'truck.png'; break;
            case 'Pessoa': urlImg = prefix + 'person.png'; break;
            default: urlImg = prefix + 'car.png'; break;
        }

        return {
            url: urlImg,
            scaledSize: new google.maps.Size(36, 56), // size
            // origin: new google.maps.Point(0,0), // origin
            // anchor: new google.maps.Point(0, 0) // anchor 
        };
    },
    _popupEvent: function (content, marker) {
        google.maps.event.addListener(marker, 'click', function() {
            MAPA_GOOGLE._popup.setContent(content);
            MAPA_GOOGLE._popup.open(MAPA_GOOGLE._map, marker);
          });
    }
}
