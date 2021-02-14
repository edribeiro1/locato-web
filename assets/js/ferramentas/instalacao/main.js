$(function () {
    $(document).ready(function () {

        if ($('#grid-lista').length > 0) {
            TABLE.init({
                uniqueId: 'ins_id',
                columns: [
                    {
                        checkbox: true
                    },
                    {
                        title: 'ID',
                        field: 'ins_id',
                        sortable: true,
                    },
                    {
                        title: 'Número série',
                        field: 'ras_numero_serie',
                        sortable: true,
                    },
                    {
                        title: 'Veículo',
                        field: 'vei_descricao',
                        sortable: true,
                    },
                    {
                        title: 'Filial',
                        field: 'fil_nome_fantasia',
                        sortable: true,
                    }
                ]
            });
        }
        else {

            var promises = [];
            promises.push(
                new Promise(function (resolve, reject) {
                    let id = parseInt($('#config-form').attr('data-id'));
                    REQUESTER.enviar(REQUESTER.gerarUrl('veiculo/veiculosDisponiveis/' + id), "", {
                        type: 'GET',
                        success: function (data) {
                            for (i in data.rows) {
                                $('#ins_id_veiculo').append(
                                    "<option value='" + data.rows[i].vei_id + "'>"
                                    + data.rows[i].vei_descricao + " - " + data.rows[i].vei_placa +
                                    "</option>");
                            }
                            resolve();
                        },
                        error: () => reject()
                    });
                })
            );

            promises.push(
                new Promise(function (resolve, reject) {
                    REQUESTER.enviar(REQUESTER.gerarUrl('filial/lista'), "", {
                        type: 'GET',
                        success: function (data) {
                            for (i in data.rows) {
                                $('#ins_id_filial').append(
                                    "<option value='" + data.rows[i].fil_id + "'>"
                                    + data.rows[i].fil_nome_fantasia +
                                    "</option>");
                            }
                            resolve();
                        },
                        error: () => reject()
                    });
                })
            );

            promises.push(
                new Promise(function (resolve, reject) {
                    let id = parseInt($('#config-form').attr('data-id'));
                    REQUESTER.enviar(REQUESTER.gerarUrl('rastreador/rastreadoresDisponiveis/' + id), "", {
                        type: 'GET',
                        success: function (data) {
                            for (i in data.rows) {
                                $('#ins_id_rastreador').append(
                                    "<option value='" + data.rows[i].ras_id + "'>"
                                    + data.rows[i].ras_numero_serie +
                                    "</option>");
                            }
                            resolve();
                        },
                        error: () => reject()
                    });
                })
            );

            Promise.all(promises).then(function (cb) {
                let id = parseInt($('#config-form').attr('data-id'));
                if (id > 0) {
                    REQUESTER.enviar(REQUESTER.gerarUrl('instalacao/' + id), "", {
                        type: 'GET',
                        success: function (data) {
                            preencheDadosFormulario(data.data);
                        }
                    });
                }
            });

        }
    });
});