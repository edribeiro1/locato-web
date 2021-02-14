$(function() {
   $(document).ready(function(){

      if( $('#grid-lista').length > 0 ) {
         TABLE.init({
            uniqueId: 'usu_id',
            columns: [
               {
                  checkbox:true
               },
               {
                  title: 'ID',
                  field: 'usu_id',
                  sortable: true,
               },
               {
                  title: 'Nome',
                  field: 'usu_nome',
                  sortable: true,
               },
               {
                  title: 'Login',
                  field: 'usu_login',
                  sortable: true,
               },
               {
                  title: 'E-mail',
                  field: 'usu_email',
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
                            $('#usu_id_filial').append("<option value='" + data.rows[i].fil_id + "'>" + data.rows[i].fil_nome_fantasia + "</option>");
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
                REQUESTER.enviar(REQUESTER.gerarUrl('usuario/' + id), "", {
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