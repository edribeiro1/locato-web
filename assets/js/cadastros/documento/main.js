$(function () {
    $(document).ready(function () {

        if ($('#grid-lista').length > 0) {
            TABLE.init({
                uniqueId: 'doc_id',
                columns: [
                    {
                        checkbox: true
                    },
                    {
                        title: 'ID',
                        field: 'doc_id',
                        sortable: true,
                    },
                    {
                        title: 'Descrição',
                        field: 'doc_descricao',
                        sortable: true,
                    },
                    {
                        title: 'Data vencimento',
                        field: 'doc_data_vencimento',
                        sortable: true,
                    },
                    {
                        title: 'Veiculo',
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
                    REQUESTER.enviar(REQUESTER.gerarUrl('filial/lista'), "", {
                        type: 'GET',
                        success: function (data) {
                            for (i in data.rows) {
                                $('#doc_id_filial').append("<option value='" + data.rows[i].fil_id + "'>" + data.rows[i].fil_nome_fantasia + "</option>");
                            }
                            resolve();
                        },
                        error: function () {
                            reject();
                        }
                    });
                })
            );

            promises.push(
                new Promise(function (resolve, reject) {
                    REQUESTER.enviar(REQUESTER.gerarUrl('veiculo/lista'), "", {
                        type: 'GET',
                        success: function (data) {
                            for (i in data.rows) {
                                $('#doc_id_veiculo').append("<option value='" + data.rows[i].vei_id + "'>" + data.rows[i].vei_descricao + " - " + data.rows[i].vei_placa + "</option>");
                            }
                            resolve();
                        },
                        error: function () {
                            reject();
                        }
                    });
                })
            );


            Promise.all(promises).then(function (cb) {
                let id = parseInt($('#config-form').attr('data-id'));
                if (id > 0) {
                    REQUESTER.enviar(REQUESTER.gerarUrl('documento/' + id), "", {
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