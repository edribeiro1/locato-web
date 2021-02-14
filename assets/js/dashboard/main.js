// $(document).ready(function () {

    var calendar = new FullCalendar.Calendar($('#calendar')[0], {
        plugins: ['dayGrid'],
        locale: 'pt-br'
    });

    calendar.render();


    REQUESTER.enviar(REQUESTER.gerarUrl('dashboard'),"", {
       type: 'GET',
       success: function(data) {
            for(i in data) {
               $('.valor-resumo[data-id='+i+']',).html(data[i]);
            }
            $('.div-loading').fadeOut('slow');
        }
    });

    $(document).on('click', '.card-resumo', function () {
        window.location.href = $(this).attr('data-url');
    });



    REQUESTER.enviar(REQUESTER.gerarUrl('dashboard/agenda'),"", {
        type: 'GET',
        success: function(data) {

            for (i in data.manutencao) {
                calendar.addEvent({
                    title: data.manutencao[i].man_descricao, 
                    start: data.manutencao[i].man_data_vencimento,
                    backgroundColor: '#dc3545',
                    borderColor: '#dc3545',
                    textColor: 'white'
              })
            }

            for (i in data.documento) {
                calendar.addEvent({
                    title: data.documento[i].doc_descricao, 
                    start: data.documento[i].doc_data_vencimento,
                    backgroundColor: '#e87600',
                    borderColor: '#e87600',
                    textColor: 'white'
              })
            }

            for (i in data.devolucao) {
                calendar.addEvent({
                    title: data.devolucao[i].lct_nome + ' - ' +data.devolucao[i].lct_celular_principal, 
                    start: data.devolucao[i].loc_data_devolucao_prevista,
                    backgroundColor: '#3999ff',
                    borderColor: '#3999ff',
                    textColor: 'white'
              })
            }

            for (i in data.locacao) {
                calendar.addEvent({
                    title: data.locacao[i].lct_nome + ' - ' +data.locacao[i].lct_celular_principal, 
                    start: data.locacao[i].loc_data_locacao_agendada,
                    backgroundColor: '#009823',
                    borderColor: '#009823',
                    textColor: 'white'
              })
            }

         }
     });

// });