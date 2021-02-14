$(function () {
    $(document).ready(function () {

        if ($('#grid-lista').length > 0) {
            TABLE.init({
                uniqueId: 'lct_id',
                columns: [
                    {
                        checkbox: true
                    },
                    {
                        title: 'ID',
                        field: 'lct_id',
                        sortable: true,
                    },
                    {
                        title: 'Nome',
                        field: 'lct_nome',
                        sortable: true,
                    },
                    {
                        title: 'Telefone',
                        field: 'lct_telefone',
                        sortable: true,
                    },
                    {
                        title: 'Celular',
                        field: 'lct_celular_principal',
                        sortable: true,
                    },
                    {
                        title: 'Email',
                        field: 'lct_email',
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
                                $('#lct_id_filial').append(
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
                    REQUESTER.enviar(REQUESTER.gerarUrl('locatario/' + id), "", {
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