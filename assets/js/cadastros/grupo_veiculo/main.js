$(function () {
    $(document).ready(function () {

        if ($('#grid-lista').length > 0) {
            TABLE.init({
                uniqueId: 'gru_vei_id',
                columns: [
                    {
                        checkbox: true
                    },
                    {
                        title: 'ID',
                        field: 'gru_vei_id',
                        sortable: true,
                    },
                    {
                        title: 'Descrição',
                        field: 'gru_vei_descricao',
                        sortable: true,
                    },
                    {
                        title: 'Filial',
                        field: 'fil_nome_fantasia',
                        sortable: true,
                    }
                ],
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
                                $('#gru_vei_id_filial').append(
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

            Promise.all(promises).then(function (cb) {
                let id = parseInt($('#config-form').attr('data-id'));
                if (id > 0) {
                    REQUESTER.enviar(REQUESTER.gerarUrl('grupoVeiculo/' + id), "", {
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