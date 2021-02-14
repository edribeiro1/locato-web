$(function() {
   $(document).ready(function(){

      if( $('#grid-lista').length > 0 ) {
         TABLE.init({
            uniqueId: 'fil_id',
            columns: [
               {
                  checkbox:true
               },
               {
                  title: 'ID',
                  field: 'fil_id',
                  sortable: true,
               },
               {
                  title: 'Nome fantasia',
                  field: 'fil_nome_fantasia',
                  sortable: true,
               },
               {
                  title: 'Razão social',
                  field: 'fil_razao_social',
                  sortable: true,
               },
               {
                title: 'Telefone',
                field: 'fil_telefone',
                sortable: true,
             }
            ]
         });
      } 
      else {
        let id = parseInt($('#config-form').attr('data-id'));
        if(id > 0) {
            loadingInputs();
            REQUESTER.enviar(REQUESTER.gerarUrl('filial/'+id),"", {
                type: 'GET',
                success: function(data) {
                    preencheDadosFormulario(data.data);
                    loadingInputs(false);
                },
            });
        }
      }
   });
});