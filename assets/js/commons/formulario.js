var arrayLadda = [];
let urlApi = $('#config-form').attr('data-url-api');
let urlForm = $('#config-form').attr('data-url-form');

var TABLE = {
    init: function (config) {
        var idIndex = config.uniqueId;
        let dataToken = localStorage.getItem('token');
        try {
            dataToken = JSON.parse(dataToken);
        } catch (e) {
            window.location.href = 'login';
        }
        $('#lista-bootstrap-table').bootstrapTable({
            url: REQUESTER.gerarUrl(urlApi + '/lista'),
            locale: 'pt-BR',
            ajaxOptions: {
                headers: { 'Authorization': 'Bearer ' + dataToken.access_token },
            },
            pagination: true,
            sidePagination: 'server',
            searchOnEnterKey: true,
            pageSize: 10,
            sortable: true,
            search: true,
            pageList: [],
            clickToSelect: true,
            uniqueId: config.uniqueId,
            onSort: function () {
                $('#lista-bootstrap-table').bootstrapTable('showLoading');
            },
            onLoadSuccess: function () {
                $('#lista-bootstrap-table').bootstrapTable('hideLoading');
                TABLE.controlaStatusBotoes();
            },
            columns: config.columns,
            responseHandler: function (dados) {
                if ($.isFunction(config.responseHandler)) {
                    return config.responseHandler(dados);
                }
                return dados;
            }
        });

        $(document).on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table page-change.bs.table', '#lista-bootstrap-table', function () {
            TABLE.controlaStatusBotoes();
        });

        $(document).on('click', '#adicionar', function () {
            startLaddaButtons();
            window.location.href = baseUrl + urlForm + '/novo';
        });

        $(document).on('click', '#editar', function () {
            startLaddaButtons();
            let dados = $("#lista-bootstrap-table").bootstrapTable('getAllSelections');
            if ($.isArray(dados) && dados.length == 1 && dados[0].hasOwnProperty(config.uniqueId)) {
                let id = dados[0][config.uniqueId];
                window.location.href = baseUrl + urlForm + '/editar/' + id;
            }
        });

        $(document).on('click', '#deletar', function () {
            startLaddaButtons();

            REQUESTER.izitoast({
                type: 'warning',
                class: 'delete',
                message: 'Deseja realmente deletar os registros?',
                timeout: 0,
                onClosing: function () {
                    stopLaddaButtons();
                },
                buttons: [
                    ['<button>Sim</button>', function (instance, toast) {
                        let dados = $("#lista-bootstrap-table").bootstrapTable('getAllSelections');

                        if ($.isArray(dados) && parseInt(dados.length) > 0) {
                         
                            let arrayId = [];
                            for (i in dados) {
                                if (dados[i].hasOwnProperty(config.uniqueId)) {
                                    arrayId.push(dados[i][config.uniqueId]);
                                }
                            }

                            REQUESTER.enviar(REQUESTER.gerarUrl(urlApi + '/deletar'), {'id': arrayId}, {
                                type: 'POST',
                                success: function (data) {
                                    iziToast.hide({
                                        transitionOut: 'fadeOutUp',
                                    }, toast);
                                    REQUESTER.izitoast({
                                        type: 'success',
                                        title: 'Sucesso',
                                        message: 'Deletado com sucesso!',
                                    });
                                    $("#lista-bootstrap-table").bootstrapTable('refresh');
                                    stopLaddaButtons();
                                },
                                fnerror: function () {
                                    iziToast.hide({
                                        transitionOut: 'fadeOutUp',
                                    }, toast);
                                    REQUESTER.izitoast({
                                        type: 'error',
                                        title: 'Erro',
                                        message: 'Erro ao tentar deletar, tente novamente!'
                                    });
                                    stopLaddaButtons();
                                }
                            });

                        }
                    }],
                    ['<button>Não</button>', function (instance, toast) {
                        iziToast.hide({
                            transitionOut: 'fadeOutUp',
                        }, toast);
                        stopLaddaButtons();
                    }]
                ]
            });



        });

    },
    controlaStatusBotoes: function () {
        let qtdDadosSelecionados = $('#lista-bootstrap-table').bootstrapTable("getSelections").length;
        if (parseInt(qtdDadosSelecionados) > 0) {
            $('#deletar').attr('disabled', false).removeClass('disable-element');
            if (qtdDadosSelecionados == 1) {
                $('#editar').attr('disabled', false).removeClass('disable-element');
            } else {
                $('#editar').attr('disabled', true).addClass('disable-element');
            }
        } else {
            $('#deletar').attr('disabled', true).addClass('disable-element');
            $('#editar').attr('disabled', true).addClass('disable-element');
        }
    }
}


$(document).ready(function () {

    if ($('.select2', '#base-formulario').length > 0) {
        $('.select2').select2({ language: 'pt-BR' })
    }

    if ($('.datetimepicker', '#base-formulario').length > 0) {
        $('.datetimepicker').bootstrapMaterialDatePicker({
            format: 'DD/MM/YYYY HH:mm',
            lang: 'pt-br',
            cancelText: 'Cancelar',
            clearButton: true,
            clearText: 'Limpar'
        });
    }

    $("#btn-salvar-formulario").on('click', function () {
        startLaddaButtons();
        $('.input-erro').removeClass('input-erro');
        let dados = pegarDadosFormulario();
        let id = parseInt($('#config-form').attr('data-id'));
        let chaveId = $('#config-form').attr('data-chave-id');
       
        if (id > 0 && chaveId) {
            dados[chaveId] = id;
        }
        
        REQUESTER.enviar(REQUESTER.gerarUrl(urlApi + '/salvar'), dados, {
            type: 'POST',
            success: function (data) {
                    REQUESTER.izitoast({
                        type: 'success',
                        title: 'Sucesso',
                        message: 'Sucesso!',
                    });
                    window.location.href = baseUrl + urlForm + '/lista';
            },
            fnerror: function (xhr) {
                error = xhr.hasOwnProperty('responseJSON') && xhr.responseJSON.hasOwnProperty('campos') ? xhr.responseJSON.campos : [];

                for (i in error) {
                    $('#'+error[i]).addClass('input-erro');
                }
                REQUESTER.izitoast({
                    type: 'error',
                    title: 'Erro',
                    message: 'Preencha os campos obrigatórios!',
                });

                stopLaddaButtons();
            }
        });
    });

    $("#btn-cancelar-formulario").on('click', function () {

        startLaddaButtons();

        REQUESTER.izitoast({
            type: 'warning',
            class: 'cancel',
            message: 'Deseja cancelar o cadastro?',
            timeout: 0,
            onClosing: function () {
                stopLaddaButtons();
            },
            buttons: [
                ['<button>Sim</button>', function (instance, toast) {
                    window.history.go(-1);
                }],
                ['<button>Não</button>', function (instance, toast) {
                    iziToast.hide({
                        transitionOut: 'fadeOutUp',
                    }, toast);
                    stopLaddaButtons();
                }]
            ]
        });
    });
});


function pegarDadosFormulario() {
    let dados = {};
    $("[data-bind]", "#base-formulario").each(function () {
        if ($(this).hasClass('datetimepicker')) {
            let value = $(this).val();
            if (value.length) {
                value = (value + ':00').replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1");
                dados[$(this).attr('data-bind')] = value;
            } else {
                dados[$(this).attr('data-bind')] = null;
            }
        } else {
            dados[$(this).attr('data-bind')] = $(this).val();
        }
    });

    return dados;
};

function preencheDadosFormulario(dados) {

    $("[data-bind]", "#base-formulario").each(function () {
        let tipo = $(this).prop("tagName").toLowerCase();
        if (dados[$(this).attr('data-bind')]) {
            if (tipo == 'input' || tipo == 'textarea') {

                if ($(this).hasClass('datetimepicker')) { 
                    let value = dados[$(this).attr('data-bind')];
                    value = value.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1").slice(0, -3);
                    $(this).val(value);
                } else {
                    $(this).val(dados[$(this).attr('data-bind')]);
                }
            }
            else if (tipo == 'select') {
                $(this).val(dados[$(this).attr('data-bind')]).change();
            }
        }
    });

}

function loadingInputs(load = true) {
    if (load) {
        $("[data-bind]", "#base-formulario").each(function () {
            let tipo = $(this).prop("tagName").toLowerCase();
            if (tipo == 'select') {

            } else {
                $(this).addClass('loading-input');
            }
        });
    } else {
        $('.loading-input').removeClass('loading-input');
    }

}

function startLaddaButtons() {
    arrayLadda = [];
    $(".btn-acoes-formulario, .btn-lista-formulario").each(function () {
        let ladda = Ladda.create(this);
        ladda.start();
        arrayLadda.push(ladda);
    });
}

function stopLaddaButtons() {
    for (i in arrayLadda) {
        arrayLadda[i].stop();
    }
    arrayLadda = [];
}

