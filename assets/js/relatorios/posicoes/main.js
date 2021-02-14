$(function () {
    let urlApi = $('#config-form').attr('data-url-api');

    $(document).ready(function () {
        moment.locale('pt-br');
        $('.select2', '#base-relatorio').select2({ language: 'pt-BR' });

        $('.datetimepicker').bootstrapMaterialDatePicker({
            format: 'DD/MM/YYYY HH:mm:ss',
            lang: 'br',
            cancelText: 'Cancelar'
        });

        $('#data_inicial').bootstrapMaterialDatePicker('setDate', moment().hour(0).minute(0).second(0));
        $('#data_final').bootstrapMaterialDatePicker('setDate', moment().hour(23).minute(59).second(59));

        MAPA_GOOGLE.criaMapa('mapa');

        REQUESTER.enviar(REQUESTER.gerarUrl('veiculo/lista'), "", {
            type: 'GET',
            processData: true,
            contentType: "application/x-www-form-urlencoded",
            dataType: 'json',
            success: function (data) {
                $('#vei_id').html('');
                for (i in data.rows) {
                    $('#vei_id').append("<option value='" + data.rows[i].vei_id + "'>" + data.rows[i].vei_descricao + " - " + data.rows[i].vei_placa + "</option>");
                }
                
            }
        });

        $('#relatorio-bootstrap-table').bootstrapTable({
            locale: 'pt-BR',
            sortable: true,
            search: false,
            columns: [
                {
                    title: 'ID',
                    field: 'his_pos_id',
                    sortable: true
                },
                {
                    title: 'Veículo',
                    field: 'vei_descricao',
                    sortable: true,
                },
                {
                    title: 'Rastreador',
                    field: 'ras_numero_serie',
                    sortable: true,
                },
                {
                    title: 'Localização',
                    field: 'localizacao',
                },
                {
                    title: 'Velocidade',
                    field: 'his_pos_velocidade',
                    sortable: true,
                },
                {
                    title: 'Iginição',
                    field: 'his_pos_ignicao',
                    sortable: true,
                },
                {
                    title: 'GPS',
                    field: 'his_pos_gps',
                    sortable: true,
                },
                {
                    title: 'Data(GPS)',
                    field: 'his_pos_data_gps',
                    sortable: true,
                },
                {
                    title: 'Data comunicação',
                    field: 'his_pos_data_servidor',
                    sortable: true,
                },
            ],
            onClickCell: function (field, elm, dados, event) {
                if (field == 'localizacao') {
                    MAPA_GOOGLE.zoomMarker({ lat: parseFloat(dados.lat), lng: parseFloat(dados.lng) })
                    MAPA_GOOGLE.bounceMarker(dados.his_pos_id);
                }
            }
        });

        $(document).on('click', '#btn-gerar-relatorio', function () {
            $('#relatorio-bootstrap-table').bootstrapTable('removeAll');
            MAPA_GOOGLE.limparMapa();
            let ladda = Ladda.create(this);
            ladda.start();

            let idVeiculo = $('#vei_id').val();
            if (parseInt(idVeiculo) > 0) {
                let dados = {
                    id_veiculo: idVeiculo,
                    data_inicial: $('#data_inicial').val(),
                    data_final: $('#data_final').val()
                }
                REQUESTER.enviar(REQUESTER.gerarUrl('historicoPosicao/gerar'), dados, {
                    type: 'GET',
                    processData: true,
                    contentType: "application/x-www-form-urlencoded",
                    dataType: 'json',
                    success: function (data) {
                        ladda.stop();

                        if (data.length) {
                            criaMarkers(data);
                            $('#relatorio-bootstrap-table').bootstrapTable('load', formataDadosTabela(data));
                        }
                      
                    }
                });
            }
            else {
                // $('#ras_id').addClass('input-erro');
                REQUESTER.izitoast({
                    type: 'warning',
                    title: 'Atenção',
                    message: 'Selecione um rastreado!'
                });
                ladda.stop();
            }
        });


    });
});

function formataDadosTabela(dados) {

    for (i in dados) {
        dados[i].his_pos_gps = (parseInt(dados[i].his_pos_gps) == 1 ? '<i class="fas fa-podcast" style="color: green; font-size: 16px;"></i>' : '<i class="fas fa-podcast" style="color: red; font-size: 16px;"></i>');
        dados[i].his_pos_ignicao = (parseInt(dados[i].his_pos_ignicao) == 1 ? '<i class="fas fa-key" style="color: green; font-size: 16px;"></i>' : '<i class="fas fa-key" style="color: red; font-size: 16px;"></i>');
        dados[i].his_pos_velocidade = (dados[i].his_pos_velocidade ? dados[i].his_pos_velocidade : 0) + ' km/h';
        dados[i].localizacao = '<a href="#">' + dados[i].lat + ', ' + dados[i].lng + '</a>';
    }
    return dados;
}

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