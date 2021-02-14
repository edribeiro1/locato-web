$(function () {
    $(document).ready(function () {

        if ($('#grid-lista').length > 0) {
            TABLE.init({
                uniqueId: 'ras_id',
                columns: [
                    {
                        checkbox: true
                    },
                    {
                        title: 'ID',
                        field: 'ras_id',
                        sortable: true,
                    },
                    {
                        title: 'Número série',
                        field: 'ras_numero_serie',
                        sortable: true,
                    },
                    {
                        title: 'Produto',
                        field: 'pro_descricao',
                        sortable: true,
                    },
                    {
                        title: 'Numero chip',
                        field: 'ras_numero_chip',
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
                    REQUESTER.enviar(REQUESTER.gerarUrl('produto/lista'), "", {
                        type: 'GET',
                        success: function (data) {
                            for (i in data.rows) {
                                $('#ras_id_produto').append("<option value='" + data.rows[i].pro_id + "'>" + data.rows[i].pro_descricao + "</option>");
                            }
                            resolve();
                        }
                    });
                })
            );

            promises.push(
                new Promise(function (resolve, reject) {
                    REQUESTER.enviar(REQUESTER.gerarUrl('filial/lista'), "", {
                        type: 'GET',
                        success: function (data) {
                            for (i in data.rows) {
                                $('#ras_id_filial').append(
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
                    REQUESTER.enviar(REQUESTER.gerarUrl('rastreador/' + id), "", {
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