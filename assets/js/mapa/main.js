$(document).ready(function () {
    MAPA_GOOGLE.criaMapa('mapa', {
        fullscreenControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_LEFT
        },
    });

    REQUESTER.enviar(REQUESTER.gerarUrl('ultimaPosicao'), "", {
        type: 'GET',
        success: function (data) {
            criaMarkers(data);
        }
    });

    function criaMarkers(dados) {

        let markers = [];
        let coordinates = [];

        for (i in dados) {
            coordinates.push({
                lat: parseFloat(dados[i].lat),
                lng: parseFloat(dados[i].lng)
            });

            markers.push({
                position: {
                    lat: parseFloat(dados[i].lat),
                    lng: parseFloat(dados[i].lng)
                },
                // icon: MAPA_GOOGLE.getIcon(dados[i].his_pos_ignicao, dados[i].ras_tipo),
                id: dados[i].his_pos_id
            });
        }
        MAPA_GOOGLE.criaMarkers(markers);
        MAPA_GOOGLE.zoomMarkers();
        MAPA_GOOGLE.criaPolyline(coordinates);
    }
});