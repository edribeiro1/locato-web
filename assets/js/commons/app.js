let dataToken = localStorage.getItem('token');
var baseUrl = $('body').attr('data-baseurl');
if (dataToken) {
    try {
        dataToken = JSON.parse(dataToken);

        let dadosUsuario = localStorage.getItem('dados_usuario');

        if (dadosUsuario) {
            dadosUsuario = JSON.parse(dadosUsuario);
            $('#nome_usuario').html(dadosUsuario.usu_nome);
            

            if (dadosUsuario.usu_id_filial) {
                $('.menu-filial').hide();
                $('.menu-usuario').hide();
            }

            $('.loading-tela').fadeOut('slow');
        } else {
            REQUESTER.enviar(REQUESTER.gerarUrl('usuario/dadosUsuarioLogado'), "", {
                type: 'GET',
                success: data => {
                    localStorage.setItem('dados_usuario', JSON.stringify(data));
                    $('#nome_usuario').html(data.usu_nome);
                    $('.loading-tela').fadeOut('slow');
                }
            });
        }
    }
    catch (e) {
        window.location.href = baseUrl + 'login';
    }
} else {
    window.location.href = baseUrl + 'login';
}

$(document).ready(function () {

    $(document).on('click', function (e) {
        $(event.target).closest('#menu').length;
        if ($(event.target).closest('#menu').length == 0 && event.target != $('.menu-link')[0]) {
            $('#menu').css('width', '60px');
            $('.desc-item-menu').hide();
            $('.desc-grupo-menu').hide();
            $('.hr-menu').show();
        }
    });

    $(document).on('click', '.span-close-menu', () => {
        $('#menu').css('width', '60px');
        $('.desc-item-menu').hide();
        $('.desc-grupo-menu').hide();
        $('.hr-menu').show();
    });

    $(document).on('click', '.menu-link', () => {
        if ($('.desc-item-menu').is(':visible')) {
            $('#menu').css('width', '60px');
            $('.desc-item-menu').hide();
            $('.desc-grupo-menu').hide();
            $('.hr-menu').show();
        }
        else {
            $('#menu').css('width', '250px');
            $('.desc-item-menu').show();
            $('.desc-grupo-menu').show();
            $('.hr-menu').hide();
        }
    });


    $(document).on('click', '.icon-menu', function () {
        window.location.href = baseUrl + $(this).attr('data-url');
    });

    // $(document).on('click touchstart','.menu-link', function() {
    //    if( $('.menu-link').hasClass('active') ) {
    //       $('body').addClass('disable-overflow');
    //    } else {
    //       $('body').removeClass('disable-overflow');
    //    }
    // });

    REQUESTER.enviar(REQUESTER.gerarUrl('notificacao/contar'), "", {
        type: 'GET',
        success: function (data) {
            if (parseInt(data.total) > 0) {
                $(".badge-notificacao").text(data.total);
            } else {
                $(".badge-notificacao").text('');
            }

        }
    });

    var iziModal = $('#modal_notificacoes').iziModal({
        title: 'Notificações',
        headerColor: '#7367f0',
        iconColor: 'white',
        top: 100,
        icon: 'far fa-bell',
        overlayClose: false,
        focusInput: false,
        width: '70%',
        overlayColor: 'rgba(0, 0, 0, 0.6)',
        transitionIn: 'bounceInDown',
        transitionOut: 'bounceOutDown',
        navigateCaption: true,
        navigateArrows: 'closeScreenEdge',
        onOpening: function () {
            iziModal.iziModal('startLoading');

            $('#table-notificacoes').bootstrapTable({
                url: REQUESTER.gerarUrl('notificacao'),
                locale: 'pt-BR',
                pagination: true,
                sidePagination: 'server',
                pageSize: 10,
                sortable: true,
                ajaxOptions: {
                    headers: { 'Authorization': 'Bearer ' + REQUESTER.getToken() },
                },
                onCheck: function () {
                    controlaBotoesNotificacoes();
                },
                onUncheck: function () {
                    controlaBotoesNotificacoes();
                },
                onCheckAll: function () {
                    controlaBotoesNotificacoes();
                },
                onUncheckAll: function () {
                    controlaBotoesNotificacoes();
                },
                onSort: function () {
                    controlaBotoesNotificacoes();
                    $('#table-notificacoes').bootstrapTable('showLoading');
                },
                onLoadSuccess: function () {
                    controlaBotoesNotificacoes();
                    $('#table-notificacoes').bootstrapTable('hideLoading');
                },
                search: true,
                pageList: [],
                columns: [
                    {
                        checkbox: true,
                    },
                    {
                        title: 'Titulo',
                        field: 'not_titulo',
                        valign: 'middle',
                        sortable: true
                    },
                    {
                        title: 'Descrição',
                        field: 'not_corpo',
                        valign: 'middle',
                        sortable: true
                    },
                    {
                        title: 'Data',
                        field: 'not_data_ocorrencia',
                        valign: 'middle',
                        sortable: true
                    },
                    {
                        title: 'Ações',
                        field: 'acoes',
                        valign: 'middle',
                    }
                ],
                rowStyle: function rowStyle(row, index) {
                    return (row.not_lido == '0' ? { classes: '', css: { 'font-weight': 'bold', 'color': '#0078d4' } } : {});
                },
                responseHandler: function (dados) {
                    for (i in dados.rows) {
                        dados.rows[i].not_data_ocorrencia = dataHoraBR(dados.rows[i].not_data_ocorrencia);

                        if (dados.rows[i].not_lido == 0) {
                            dados.rows[i].acoes = '<button id="marcar-lido" class="btn btn-info btn-acoes" title="Marcar como lida" data-id-notificacao="' + dados.rows[i].not_id + '"><i class="far fa-envelope-open"></i></button>';
                        } else {
                            dados.rows[i].acoes = '<button id="marcar-nao-lido" class="btn btn-secondary btn-acoes" title="Marcar não lida" data-id-notificacao="' + dados.rows[i].not_id + '"><i class="far fa-envelope"></i></button>';
                        }

                        dados.rows[i].acoes += ' <button id="excluir-notificacao" class="btn btn-danger btn-acoes" title="Deletar notificacao" data-id-notificacao="' + dados.rows[i].not_id + '"><i class="fas fa-trash-alt"></i></button>'
                    }

                    return dados;
                }
            });

        },
        onOpened: function () {
            iziModal.iziModal('stopLoading');
        },
        onClosed: function () {
            controlaBotoesNotificacoes();


            REQUESTER.enviar(REQUESTER.gerarUrl('notificacao/contar'), "", {
                type: 'GET',
                success: function (data) {
                    if (parseInt(data.total) > 0) {
                        $(".badge-notificacao").text(data.total);
                    } else {
                        $(".badge-notificacao").text('');
                    }
                }
            });
        }
    });

    $('#notificacao').on('click', function () {
        iziModal.iziModal('open');
    });


    $(document).on('click', '#marcar-nao-lido, #marcar-lido, #marcar-todos-lido, #marcar-todos-nao-lido', function () {
        $('#table-notificacoes').bootstrapTable('showLoading');
        let ids = [];
        let lido = 0;

        if ($(this).attr('id') == 'marcar-todos-lido') {
            let dadosTabela = $('#table-notificacoes').bootstrapTable('getAllSelections');
            for (i in dadosTabela) {
                ids.push(dadosTabela[i].not_id);
            }
            lido = 1;
        } else if ($(this).attr('id') == 'marcar-todos-nao-lido') {
            let dadosTabela = $('#table-notificacoes').bootstrapTable('getAllSelections');
            for (i in dadosTabela) {
                ids.push(dadosTabela[i].not_id);
            }
            lido = 0;
        } else if ($(this).attr('id') == 'marcar-lido') {
            ids = [$(this).attr('data-id-notificacao')];
            lido = 1;
        } else if ($(this).attr('id') == 'marcar-nao-lido') {
            ids = [$(this).attr('data-id-notificacao')];
            lido = 0;
        }

        let update = {
            'ids': ids,
            'lido': lido
        }

        REQUESTER.enviar(REQUESTER.gerarUrl('notificacao/lido'), update, {
            type: 'PUT',
            success: function (data) {
                $('#table-notificacoes').bootstrapTable('refresh');
            }
        });
    });

    $(document).on('click', '#excluir-notificacao, #excluir-todos', function () {
        $('#table-notificacoes').bootstrapTable('showLoading');
        let ids = [];
        if ($(this).attr('id') == 'excluir-todos') {
            let dadosTabela = $('#table-notificacoes').bootstrapTable('getAllSelections');
            for (i in dadosTabela) {
                ids.push(dadosTabela[i].not_id);
            }
        } else if ($(this).attr('id') == 'excluir-notificacao') {
            ids = [$(this).attr('data-id-notificacao')];
        }

        if (ids.length > 0) {
            REQUESTER.enviar(REQUESTER.gerarUrl('notificacao/deletar'), { 'ids': ids }, {
                type: 'PUT',
                success: function (data) {
                    $('#table-notificacoes').bootstrapTable('refresh');
                    REQUESTER.izitoast({
                        type: 'success',
                        title: 'Sucesso',
                        message: data.message
                    })
                }
            });
        }
    });

    $('#logout').click(function (e) {
        e.stopPropagation()
    });
});

function controlaBotoesNotificacoes() {
    let qtdeSelecionados = $('#table-notificacoes').bootstrapTable('getAllSelections').length;
    if (parseInt(qtdeSelecionados) > 0) {
        $('#marcar-todos-lido').fadeIn('slow');
        $('#marcar-todos-nao-lido').fadeIn('slow');
        $('#excluir-todos').fadeIn('slow');
    } else {
        $('#marcar-todos-lido').fadeOut('slow');
        $('#marcar-todos-nao-lido').fadeOut('slow');
        $('#excluir-todos').fadeOut('slow');
    }
}

function dataHoraBR(dataEN) {
    return dataEN.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");
}
