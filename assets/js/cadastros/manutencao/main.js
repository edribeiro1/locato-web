$(function () {
    $(document).ready(function () {

        if ($('#grid-lista').length > 0) {
            TABLE.init({
                uniqueId: 'man_id',
                columns: [
                    {
                        checkbox: true
                    },
                    {
                        title: 'ID',
                        field: 'man_id',
                        sortable: true,
                    },
                    {
                        title: 'Descrição',
                        field: 'man_descricao',
                        sortable: true,
                    },
                    {
                        title: 'Observação',
                        field: 'man_observacao',
                        sortable: true,
                    },
                    {
                        title: 'Veículo',
                        field: 'vei_descricao',
                        sortable: true,
                    },
                    {
                        title: 'Kilometragem',
                        field: 'man_kilometragem',
                        sortable: true,
                    },
                    {
                        title: 'Data vencimento',
                        field: 'man_data_vencimento',
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

            $('.datetimepicker').bootstrapMaterialDatePicker({
                format: 'DD/MM/YYYY HH:mm',
                lang: 'pt-br',
                cancelText: 'Cancelar'
            });
            
            var promises = [];
            promises.push(
                new Promise(function (resolve, reject) {
                    REQUESTER.enviar(REQUESTER.gerarUrl('filial/lista'), "", {
                        type: 'GET',
                        success: function (data) {
                            for (i in data.rows) {
                                $('#man_id_filial').append("<option value='" + data.rows[i].fil_id + "'>" + data.rows[i].fil_nome_fantasia + "</option>");
                            }
                            resolve();
                        },
                        error: () => reject()
                    });
                })
            );

            promises.push(
                new Promise(function (resolve, reject) {
                    REQUESTER.enviar(REQUESTER.gerarUrl('veiculo/lista'), "", {
                        type: 'GET',
                        success: function (data) {
                            for (i in data.rows) {
                                $('#man_id_veiculo').append("<option value='" + data.rows[i].vei_id + "'>" + data.rows[i].vei_descricao + ' - ' + data.rows[i].vei_placa + "</option>");
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
                    REQUESTER.enviar(REQUESTER.gerarUrl('manutencao/' + id), "", {
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