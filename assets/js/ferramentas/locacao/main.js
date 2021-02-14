$(function () {
    $(document).ready(function () {

        if ($('#grid-lista').length > 0) {
            TABLE.init({
                uniqueId: 'loc_id',
                columns: [
                    {
                        checkbox: true
                    },
                    {
                        title: 'ID',
                        field: 'loc_id',
                        sortable: true,
                    },
                    {
                        title: 'Data agendado',
                        field: 'loc_data_locacao_agendada',
                        sortable: true,
                    },
                    {
                        title: 'Data locação',
                        field: 'loc_data_locacao',
                        sortable: true,
                    },
                    {
                        title: 'Data devolução prevista',
                        field: 'loc_data_devolucao_prevista',
                        sortable: true,
                    },
                    {
                        title: 'Data devolução',
                        field: 'loc_data_devolucao',
                        sortable: true,
                    },
                    {
                        title: 'Locatário',
                        field: 'lct_nome',
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
                    REQUESTER.enviar(REQUESTER.gerarUrl('veiculo/veiculosDisponiveisLocacao/'+ id), "", {
                        type: 'GET',
                        success: function (data) {
                            for (i in data.rows) {
                                $('#loc_id_veiculo').append(
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
                                $('#loc_id_filial').append(
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
                    REQUESTER.enviar(REQUESTER.gerarUrl('locatario/locatariosDisponiveis/' + id), "", {
                        type: 'GET',
                        success: function (data) {
                            for (i in data.rows) {
                                $('#loc_id_locatario').append(
                                    "<option value='" + data.rows[i].lct_id + "'>"
                                    + data.rows[i].lct_nome +
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
                    REQUESTER.enviar(REQUESTER.gerarUrl('locacao/' + id), "", {
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