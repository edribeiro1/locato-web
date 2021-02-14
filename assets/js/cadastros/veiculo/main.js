$(function () {
    $(document).ready(function () {

        if ($('#grid-lista').length > 0) {
            TABLE.init({
                uniqueId: 'vei_id',
                columns: [
                    {
                        checkbox: true
                    },
                    {
                        title: 'ID',
                        field: 'vei_id',
                        sortable: true,
                    },
                    {
                        title: 'Descrição',
                        field: 'vei_descricao',
                        sortable: true,
                    },
                    {
                        title: 'Placa',
                        field: 'vei_placa',
                        sortable: true,
                    },
                    {
                        title: 'Grupo',
                        field: 'gru_vei_descricao',
                        sortable: true,
                    },
                    {
                        title: 'Filial',
                        field: 'fil_nome_fantasia',
                        sortable: true,
                    },
                    {
                        title: 'Kilometragem',
                        field: 'vei_kilometragem',
                        sortable: true,
                    },
                    {
                        title: 'Combustível',
                        field: 'vei_tipo_combustivel',
                        sortable: true,
                    },
                    {
                        title: 'Cor',
                        field: 'vei_cor',
                        sortable: true,
                    },
                    {
                        title: 'Modelo',
                        field: 'vei_modelo',
                        sortable: true,
                    },
                    {
                        title: 'Ano Modelo',
                        field: 'vei_ano_modelo',
                        sortable: true,
                    },
                    {
                        title: 'Fabricante',
                        field: 'vei_fabricante',
                        sortable: true,
                    },
                    {
                        title: 'Ano fabricação',
                        field: 'vei_ano_fabricacao',
                        sortable: true,
                    },
                    {
                        title: 'Chassi',
                        field: 'vei_chassi',
                        sortable: true,
                    },
                    {
                        title: 'Renavam',
                        field: 'vei_renavam',
                        sortable: true,
                    },
                ],
                // responseHandler: function(dados) {
                //    for(i in dados.dados) {
                //       dados.dados[i].equ_numero_serie = (dados.dados[i].equ_numero_serie ? dados.dados[i].equ_numero_serie : '-') +(dados.dados[i].pro_fabricante ? ' - ' + dados.dados[i].pro_fabricante : '') + (dados.dados[i].pro_descricao ? ' - ' + dados.dados[i].pro_descricao : '');
                //    }
                //    return {
                //       rows: dados.dados,
                //       total: dados.total
                //    }
                // }
            });
        }
        else {

            var promises = [];
            promises.push(
                new Promise(function (resolve, reject) {
                    REQUESTER.enviar(REQUESTER.gerarUrl('grupoVeiculo/lista'), "", {
                        type: 'GET',
                        success: function (data) {
                            for (i in data.rows) {
                                $('#vei_id_grupo').append(
                                    "<option value='" + data.rows[i].gru_vei_id + "'>"
                                    + data.rows[i].gru_vei_descricao +
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
                                $('#vei_id_filial').append(
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
                    REQUESTER.enviar(REQUESTER.gerarUrl('veiculo/' + id), "", {
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